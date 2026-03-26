import express from "express";
import { getTopAgents } from "../controllers/agent.controller.js";

const router = express.Router();

// 👉 /api/agents/top
router.get("/top", getTopAgents);

export default router;