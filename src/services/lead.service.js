import prisma from "../lib/prisma.js";

export const leadService = {

    // --------------------------
    // CREATE LEAD
    // --------------------------
    async createLead({ name, phone, email, propertyId }) {

        if (!name || !phone || !propertyId) {
            const error = new Error("Name, phone and propertyId required");
            error.status = 400;
            throw error;
        }

        // --------------------------
        // FIND OR CREATE USER
        // --------------------------
        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { phone },
                    ...(email ? [{ email }] : [])
                ]
            }
        });
        console.log("USER FOUND:", user);

        if (!user) {
            console.log("CREATING NEW USER...");

            user = await prisma.user.create({
                data: {
                    name,
                    phone,
                    email: email || null,
                    role: "BUYER"
                }
            });
        }

        // --------------------------
        // PREVENT DUPLICATE LEAD
        // --------------------------
        const existingLead = await prisma.lead.findFirst({
            where: {
                propertyId,
                buyerId: user.id
            }
        });

        if (existingLead) {
            return {
                success: true,
                message: "You already requested this property",
                lead: existingLead,
                isDuplicate: true
            };
        }

        // --------------------------
        // CREATE LEAD
        // --------------------------
        const lead = await prisma.lead.create({
            data: {
                name,
                phone,
                propertyId,
                buyerId: user?.id || null   // optional link
            }
        });

        return {
            success: true,
            message: "Lead created successfully",
            lead,
            isDuplicate: false
        };
    }

};