import express from "express";
import Multer from "multer";
import path from "path";
import fs from "fs/promises";
import parseDuration from "ms";
import upload from "../lib/upload";
import uploadRateLimit from "../middleware/upload-rate-limit";
import { incrementStat, incrementStatFloat, incrementStatFloatWithExpiry, incrementStatWithExpiry } from "../redis/stats.store";

const router = express.Router();
const multer = Multer({
    dest: "/tmp",
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 mb max limit cuz i aint got money
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed!"));
        }
    },
});

// POST /upload
router.post("/upload",
    uploadRateLimit, // rate limit middleware

    multer.single("file"),

    async (req, res) => {
        if (!req.file) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }

        const expires_in = req.body.expires_in;
        const title = req.body.title;

        if (!expires_in) {
            res.status(400).json({ error: "required param: `expires_in` | example values: `1d`, `1d 12h` | max value: `7d` (7 days)" });
            return;
        }

        if (title && title.length > 100) {
            res.status(400).json({ error: "param: `title` | max length: 100" });
            return;
        }

        const durationMs = parseDuration(`${expires_in}`);
        if (!durationMs) {
            res.status(400).json({ error: "invalid param: `expires_in` | example values: `1d`, `1d 12h` | max value: `7d` (7 days)" });
            return;
        }

        if (durationMs > 604800000) {
            res.status(400).json({ error: "param: `expires_in` | max value: `7d` (7 days)" });
            return;
        }

        const expiresAt = new Date(Date.now() + durationMs).toISOString();
        const filePath = path.resolve(req.file.path);

        try {
            const doc = await upload(filePath, expiresAt, title);
            // update stats in redis store
            await incrementStat("total_uploads");
            await incrementStatFloat("total_uploads_size", req.file.size);
            await incrementStatWithExpiry("uploads_today", 86400); // 1 day expiry
            await incrementStatFloatWithExpiry("uploads_size_today", req.file.size, 86400); // 1 day expiry
            await fs.unlink(filePath);

            res
                .status(201)
                .json({
                    id: doc._id,
                    url: `https://${req.hostname}/${doc._id}`,
                    expires_at: expiresAt
                });

        } catch (error) {
            await fs
                .unlink(filePath)
                .catch((err) => {
                    console.error("Could not unlink: ", err);
                });

            console.error(error);
            res.status(500).json({ error: "Upload failed" });
        }
    });

export default router;