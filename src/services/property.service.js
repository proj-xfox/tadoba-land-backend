import prisma from "../lib/prisma.js";

export const propertyService = {

    // CREATE
    async createProperty(data, user) {
        return prisma.property.create({
            data: {
                title: data.title,
                price: Number(data.price),
                location: data.location,
                createdBy: user?.id || 1 // temp fallback
            }
        });
    },

    // GET ALL
    async getAllProperties(query) {
        const { location } = query;

        return prisma.property.findMany({
            where: location
                ? {
                    location: {
                        contains: location,
                        mode: "insensitive"
                    }
                }
                : {},
            orderBy: { createdAt: "desc" }
        });
    },

    // GET ONE
    async getPropertyById(id) {
        return prisma.property.findUnique({
            where: {
                id: Number(id)
            }
        });
    }

};