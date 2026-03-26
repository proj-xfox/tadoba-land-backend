import { leadService } from "../services/lead.service.js";

export const createLead = async (req, res, next) => {
    try {
        const result = await leadService.createLead(req.body);
        return res.json(result);
    } catch (err) {
        next(err);
    }
};