// controllers/upload.controller.js
import { processAndUploadImages } from "../services/image.service.js";

export const uploadImagesController = async (req, res) => {
    try {
        console.log("Upload API hi===================");
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        const images = await processAndUploadImages(req.files);

        return res.json({
            success: true,
            images,
        });

    } catch (err) {
        console.error("Upload error:", err);
        return res.status(500).json({ error: err.message });
    }
};