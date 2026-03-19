import express from "express";
import { requestReset, verifyReset } from "../controllers/resetController.js";

const router = express.Router();

router.post("/request-reset", requestReset);
router.post("/verify-reset", verifyReset);

export default router;
