// src/services/authService.js

import prisma from "../lib/prisma.js";
import { hashPassword, comparePassword, generateToken } from "vedaxon-auth-framework";

export const authService = {

    // --------------------------
    // USER SIGNUP
    // --------------------------
    async signup({ name, phone, email, password, role }) {

        if (!name || !phone || !password) {
            const error = new Error("Name, phone, password required");
            error.status = 400;
            throw error;
        }

        // --------------------------
        // ROLE MAPPING
        // --------------------------
        const allowedRoles = ["OWNER", "BUYER", "AGENT", "ADMIN"];

        const mappedRole = allowedRoles.includes(role)
            ? role
            : "BUYER";

        console.log("🧠 Incoming role:", role);
        console.log("✅ Mapped role:", mappedRole);

        // --------------------------
        // CHECK EXISTING USER
        // --------------------------
        const existing = await prisma.user.findFirst({
            where: {
                OR: [
                    { phone },
                    ...(email ? [{ email }] : [])
                ]
            }
        });

        if (existing) {
            const error = new Error("User already exists");
            error.status = 400;
            throw error;
        }

        // --------------------------
        // HASH PASSWORD
        // --------------------------
        const passwordHash = await hashPassword(password);

        // --------------------------
        // CREATE USER
        // --------------------------
        const user = await prisma.user.create({
            data: {
                name,
                phone,
                email: email || null,
                passwordHash,
                role: mappedRole
            }
        });

        // --------------------------
        // GENERATE TOKEN
        // --------------------------
        const token = generateToken({
            id: user.id,
            role: user.role
        });

        return {
            success: true,
            message: "Signup successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                role: user.role
            }
        };
    },

    // --------------------------
    // USER LOGIN
    // --------------------------
    async login({ phone, password }) {

        if (!phone || !password) {
            const error = new Error("Phone & password required");
            error.status = 400;
            throw error;
        }

        // Find user by phone
        const user = await prisma.user.findUnique({
            where: { phone }
        });

        if (!user) {
            const error = new Error("No account found");
            error.status = 400;
            throw error;
        }

        // Compare password
        const match = await comparePassword(password, user.passwordHash);

        if (!match) {
            const error = new Error("Incorrect password");
            error.status = 401;
            throw error;
        }

        // Generate token
        const token = generateToken({
            id: user.id,
            role: user.role
        });

        return {
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                role: user.role
            }
        };
    }
};