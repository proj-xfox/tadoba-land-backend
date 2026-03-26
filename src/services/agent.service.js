import prisma from "../lib/prisma.js";

export const agentService = {

    async getTopAgents() {

        const agents = await prisma.user.findMany({
            where: {
                role: "AGENT",
                isActive: true
            },
            include: {
                properties: {
                    where: {
                        status: "ACTIVE"
                    },
                    select: {
                        gate: true
                    }
                }
            }
        });

        const formatted = agents.map(a => {

            const locations = [
                ...new Set(a.properties.map(p => p.gate))
            ];

            return {
                id: a.id,
                name: a.name,
                phone: a.phone,

                // 👉 for route
                slug: `agent-${a.id}`,

                // 👉 UI compatibility
                experience: 5, // dummy for now
                listings: a.properties.length,
                locations,

                avatar: `https://i.pravatar.cc/100?u=${a.id}` // safe fallback
            };
        });

        // 🔥 sort by listings (important)
        return formatted
            .sort((a, b) => b.listings - a.listings)
            .slice(0, 10);
    }

};