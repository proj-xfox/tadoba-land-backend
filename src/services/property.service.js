//src/services/property.service.js
import prisma from "../lib/prisma.js";

export const propertyService = {

    // ✅ CREATE PROPERTY
    async createProperty(data, user) {

        console.log("📦 Incoming Property Data:", data);
        console.log("👤 User received in service:", user);

        const {
            title,
            description,
            address,
            city,
            gate,
            type,
            area,
            areaUnit,
            price,
            contactName,
            contactPhone
        } = data;

        // 🔒 Required validation (aligned with UI)
        if (!title || !address || !city || !contactName || !contactPhone) {
            const error = new Error("Missing required fields");
            error.status = 400;
            throw error;
        }

        if (!user?.id) {
            throw new Error("Unauthorized");
        }



        return prisma.property.create({
            data: {
                title,
                description,
                address,
                city,

                // ✅ ENUMS (important)
                gate, // must match TadobaGate
                type, // must match PropertyType

                area: area ? Number(area) : null,
                areaUnit: areaUnit || null,

                price: price ? Number(price) : null,

                contactPhone: contactPhone.trim(),
                contactName: contactName.trim(),

                // 👤 creator
                userId: user?.id,
                status: "DRAFT"
            }
        });
    },

    async addPropertyImages(propertyId, images) {
        return prisma.propertyImage.createMany({
            data: images.map(img => ({
                propertyId: Number(propertyId),
                optimizedUrl: img.optimized.trim(),
                thumbnailUrl: img.thumbnail.trim()
            }))
        });
    },

    // ✅ ACTIVATE PROPERTY
    async activateProperty(propertyId) {
        return prisma.property.update({
            where: { id: Number(propertyId) },
            data: {
                status: "ACTIVE"
            }
        });
    },

    // ✅ GET ALL PROPERTIES (FILTER READY FOR YOUR UI)
    async getAllProperties(query) {

        const {
            city,
            gate,
            type,
            search
        } = query;

        return prisma.property.findMany({
            where: {
                status: "ACTIVE", // 🔥 only show active

                ...(city && { city }),
                ...(gate && { gate }),
                ...(type && { type }),

                ...(search && {
                    OR: [
                        {
                            title: {
                                contains: search,
                                mode: "insensitive"
                            }
                        },
                        {
                            address: {
                                contains: search,
                                mode: "insensitive"
                            }
                        }
                    ]
                })
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    },

    // ✅ GET SINGLE PROPERTY
    async getPropertyById(id) {
        return prisma.property.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                images: true // 🔥 needed for frontend later
            }
        });
    },

    // ✅ GET FEATURED PROPERTIES
    async getFeaturedProperties() {
        const properties = await prisma.property.findMany({
            where: {
                isFeatured: true,
                status: "ACTIVE"
            },
            include: {
                images: {
                    take: 1, // ✅ only first image
                    orderBy: {
                        createdAt: "asc"
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 10
        });

        // 🔥 Transform response (VERY IMPORTANT)
        return properties.map(p => ({
            ...p,
            image: p.images[0]
                ? {
                    optimized: p.images[0].optimizedUrl,
                    thumbnail: p.images[0].thumbnailUrl
                }
                : null,
            images: undefined // ❌ remove raw images
        }));
    },

    async getOwnerProperties() {
        const properties = await prisma.property.findMany({
            where: {
                status: "ACTIVE",
                user: {
                    role: "OWNER"   // 🔥 KEY FILTER
                }
            },
            include: {
                images: {
                    take: 1,
                    orderBy: { createdAt: "asc" }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 10
        });

        return properties.map(p => ({
            ...p,
            image: p.images[0]
                ? {
                    optimized: p.images[0].optimizedUrl,
                    thumbnail: p.images[0].thumbnailUrl
                }
                : null,
            images: undefined
        }));
    },

    async getAgentProperties() {
        const properties = await prisma.property.findMany({
            where: {
                status: "ACTIVE",
                user: {
                    role: "AGENT"   // 🔥 KEY FILTER
                }
            },
            include: {
                images: {
                    take: 1,
                    orderBy: { createdAt: "asc" }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 10
        });

        return properties.map(p => ({
            ...p,
            image: p.images[0]
                ? {
                    optimized: p.images[0].optimizedUrl,
                    thumbnail: p.images[0].thumbnailUrl
                }
                : null,
            images: undefined
        }));
    }
};