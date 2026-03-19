//src/routes/auth.routes.js
import express from "express";
import { login, signup } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);  // for tenant owner

export default router;
