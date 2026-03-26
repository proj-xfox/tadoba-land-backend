// routes/upload.routes.js
import express from "express";
import multer from "multer";
import { uploadImagesController } from "../controllers/upload.controller.js";

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 6 * 1024 * 1024 },
});

console.log("Upload route loaded===============");

router.post("/images", upload.array("images", 6), uploadImagesController);

export default router;