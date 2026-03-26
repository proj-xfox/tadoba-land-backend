// services/image.service.js
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

const BUCKET = process.env.SUPABASE_BUCKET;

async function uploadBuffer(buffer, filePath, mimeType) {
    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, buffer, {
            contentType: mimeType,
            upsert: false,
        });

    if (error) throw error;

    return supabase.storage.from(BUCKET).getPublicUrl(filePath).data.publicUrl;
}

export const processAndUploadImages = async (files) => {
    const results = [];

    for (const file of files) {
        const base = uuidv4();

        const optimizedPath = `uploads/optimized/${base}.webp`;
        const thumbPath = `uploads/thumb/${base}_thumb.webp`;

        // Thumbnail
        const thumbBuffer = await sharp(file.buffer)
            .resize(400, 300, { fit: "cover" })
            .webp({ quality: 75 })
            .toBuffer();

        // Optimized
        const optimizedBuffer = await sharp(file.buffer)
            .resize({ width: 1600, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

        const optimizedUrl = await uploadBuffer(
            optimizedBuffer,
            optimizedPath,
            "image/webp"
        );

        const thumbnailUrl = await uploadBuffer(
            thumbBuffer,
            thumbPath,
            "image/webp"
        );

        results.push({
            optimized: optimizedUrl,
            thumbnail: thumbnailUrl,
        });
    }

    return results;
};