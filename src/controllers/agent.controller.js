import { agentService } from "../services/agent.service.js";

export const getTopAgents = async (req, res, next) => {
    try {

        const agents = await agentService.getTopAgents();

        res.json({
            success: true,
            data: agents
        });

    } catch (err) {
        next(err);
    }
};