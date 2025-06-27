import express from "express";
import sanity from "../sanity";
import redisClient from "../redis";

const router = express.Router();

// GET /stats
router.get("/stats", async (_req, res) => {
    try {
        const stats = await sanity.fetch(
            `{
                "totalFiles": count(*[_type == "tempImage"]),
                "totalSize": sum(*[_type == "tempImage"].image.asset->size)
            }`
        );

        const totalFiles = stats.totalFiles || 0;
        const totalSizeBytes = stats.totalSize || 0;
        const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);

        const totalUploads = await redisClient.get("total_uploads");
        const totalUploadsSize = await redisClient.get("total_uploads_size");
        const uploadsToday = await redisClient.get("uploads_today");
        const uploadsTodaySize = await redisClient.get("uploads_today_size");

        res.json({
            current: {
                images: totalFiles,
                size: {
                    mb: totalSizeMB
                }
            },
            total: {
                uploads: totalUploads ? parseInt(totalUploads) : 0,
                size: {
                    mb: totalUploadsSize ? (parseFloat(totalUploadsSize) / (1024 * 1024)).toFixed(2) : "0.00"
                }
            },
            today: {
                uploads: uploadsToday ? parseInt(uploadsToday) : 0,
                size: {
                    mb: uploadsTodaySize ? (parseFloat(uploadsTodaySize) / (1024 * 1024)).toFixed(2) : "0.00"
                }
            }
        });
    } catch (err) {
        console.error("Stats error:", err);
        res.status(500).send("Failed to get stats");
    }
});

export default router;