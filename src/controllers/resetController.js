import { resetService } from "../services/resetService.js";

export const requestReset = async (req, res, next) => {
    try {
        const { email } = req.body;
        const result = await resetService.requestReset(email);
        return res.json(result);
    } catch (err) {
        next(err);
    }
};

export const verifyReset = async (req, res, next) => {
    try {
        const result = await resetService.verifyReset(req.body);
        return res.json(result);
    } catch (err) {
        next(err);
    }
};
