//src/services/authService.js
import prisma from "../prisma/client.js";
import { hashPassword, comparePassword, generateToken } from "vedaxon-auth-framework";
import { v4 as uuid } from "uuid";

export const authService = {

    // --------------------------
    // USER SIGNUP
    // --------------------------
    async signup({ name, email, phone, password }) {

        // ❗ IMPORTANT:
        // This was previously "throw new Error()" without status.
        // That caused a 500 response even when client sent bad input.
        // Now we mark it as 400 (Bad Request)
        if (!name || !email || !password) {
            const error = new Error("Name, email, password are required");
            error.status = 400; // <-- Explicit client error
            throw error;
        }

        // 1️⃣ Check if user already exists
        const existing = await prisma.user.findFirst({
            where: { email }
        });

        // ✔️ You correctly handled this earlier, just confirming
        if (existing) {
            const error = new Error("Email already registered");
            error.status = 400; // <-- Proper status code
            throw error;
        }

        // 2️⃣ Create Tenant record
        const tenant = await prisma.tenant.create({
            data: {
                id: uuid(),
                name: `${name}'s Workspace`,
                slug: email.split("@")[0] + "-" + Date.now()
            }
        });

        // 3️⃣ Hash Password (framework)
        const passwordHash = await hashPassword(password);

        // 4️⃣ Create USER with ADMIN role
        const user = await prisma.user.create({
            data: {
                id: uuid(),
                tenantId: tenant.id,
                name,
                email,
                phone,
                passwordHash,
                role: "ADMIN"
            }
        });

        // 5️⃣ Generate token (framework)
        const token = generateToken({
            id: user.id,
            tenantId: tenant.id,
            role: user.role
        });

        // 🔥 IMPORTANT:
        // Successful signup now returns proper JSON
        // This is unchanged — functionality remains intact
        return {
            success: true,
            message: "Signup successful",
            token,
            tenantId: tenant.id,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                email: user.email
            }
        };
    },

    // --------------------------
    // USER LOGIN
    // --------------------------
    async login({ email, password }) {

        // ❗ Before:
        // throw new Error("Email & password required")
        //
        // Caused 500 (server error) instead of 400 (client input error)
        if (!email || !password) {
            const error = new Error("Email & password required");
            error.status = 400; // <-- client sent invalid data
            throw error;
        }

        // 1️⃣ Find user by email
        const user = await prisma.user.findFirst({
            where: { email }
        });

        // ❗ Before:
        // throw new Error("No account found with this email")
        //
        // Caused 500 (server error) instead of 400
        if (!user) {
            const error = new Error("No account found with this email");
            error.status = 400; // <-- avoid revealing which field was wrong
            throw error;
        }

        // 2️⃣ Compare passwords
        const match = await comparePassword(password, user.passwordHash);

        // ❗ Before:
        // throw new Error("Incorrect password")
        //
        // Now:
        // treat as 401 Unauthorized (correct semantic)
        if (!match) {
            const error = new Error("Incorrect password");
            error.status = 401; // <-- user authenticated but failed
            throw error;
        }

        // 3️⃣ Generate token
        const token = generateToken({
            id: user.id,
            tenantId: user.tenantId,
            role: user.role
        });

        // 🔥 Status code stays handled by controller
        // No changes here — functionality preserved
        return {
            success: true,
            message: "Login successful",
            token,
            tenantId: user.tenantId,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }
};
