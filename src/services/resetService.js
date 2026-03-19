import prisma from "../prisma/client.js";
import { hashPassword } from "vedaxon-auth-framework";
import { sendResetEmail } from "../utils/sendEmail.js";
import bcrypt from "bcrypt";


export const resetService = {

    // 1️⃣ Request OTP
    async requestReset(email) {

        // 🔥 Before:
        // throw new Error("Email is required")
        //
        // ❗ Would return 500 Internal Server Error
        //    even though it's a client mistake.
        if (!email) {
            const error = new Error("Email is required");
            error.status = 400; // <-- Bad Request
            throw error;
        }

        const user = await prisma.user.findFirst({ where: { email } });

        // ✔️ Correct: security best practice — do NOT reveal user existence
        if (!user) return { success: true, message: "If email exists, OTP sent." };

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP with expiry
        await prisma.passwordReset.create({
            data: {
                email,
                otp,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 min
            }
        });

        // Send email via Resend
        await sendResetEmail(email, otp);

        return {
            success: true,
            message: "OTP sent to email."
        };
    },



    // 2️⃣ Verify OTP & Reset Password
    async verifyReset({ email, otp, newPassword }) {

        // 🔥 Before:
        // throw new Error(...)
        //
        // ❗ Missing status → becomes 500 instead of 400
        if (!email || !otp || !newPassword) {
            const error = new Error("Email, OTP, and new password are required");
            error.status = 400; // <-- Bad Request
            throw error;
        }

        // Find OTP record
        const record = await prisma.passwordReset.findFirst({
            where: { email, otp }
        });

        // ❗ Invalid OTP is a client error, not server crash
        if (!record) {
            const error = new Error("Invalid OTP");
            error.status = 400; // <-- Bad Request
            throw error;
        }

        // ❗ OTP expired — still client error
        if (record.expiresAt < new Date()) {
            const error = new Error("OTP expired");
            error.status = 400; // <-- Bad Request
            throw error;
        }

        // Find user
        const user = await prisma.user.findFirst({
            where: { email }
        });

        // ❗ Before: unhandled => causes 500
        if (!user) {
            const error = new Error("User not found");
            error.status = 404; // <-- Not Found
            throw error;
        }

        // Hash new password using framework
        const passwordHash = await hashPassword(newPassword);

        // Update password by ID (unique field)
        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash }
        });

        // Clear all OTPs for this email
        await prisma.passwordReset.deleteMany({ where: { email } });

        return {
            success: true,
            message: "Password reset successful"
        };
    }

};
