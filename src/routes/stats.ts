import express from "express";
import sanity from "../sanity";

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

        res.json({
            current: {
                images: totalFiles,
                size: {
                    mb: totalSizeMB
                }
            }
        });
    } catch (err) {
        console.error("Stats error:", err);
        res.status(500).send("Failed to get stats");
    }
});

export default router;