//src/controllers/authController.js
import { authService } from "../services/authService.js";

export const signup = async (req, res, next) => {
    try {
        const result = await authService.signup(req.body);
        return res.json(result);
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        return res.json(result);
    } catch (err) {
        next(err);
    }
};
