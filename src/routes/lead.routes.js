import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { name, phone, message, propertyId } = req.body;

        const lead = await prisma.lead.create({
            data: {
                name,
                phone,
                message,
                propertyId: Number(propertyId)
            }
        });

        res.json(lead);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;