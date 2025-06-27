import express from "express";
import sanity from "../sanity";

const router = express.Router();

// GET /:id
router.post("/cron", async (req, res) => {
    const token = req.headers["authorization"];
    if (!token || token !== process.env.SECRET_AUTH_TOKEN) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    try {
        const now = new Date().toISOString();

        // Get all expired tempImage docs
        const expiredDocs = await sanity.fetch(
            `*[_type == "tempImage" && defined(expiresAt) && expiresAt < $now]{
                _id,
                title,
                image {
                    asset->{_id}
                }
            }`,
            { now }
        );

        for (const doc of expiredDocs) {
            const docId = doc._id;
            const assetId = doc.image?.asset?._id;

            console.log(`Deleting tempImage: ${docId} (${doc.title})`);

            if (assetId) {
                try {
                    console.log(`Deleting asset: ${assetId}`);
                    await sanity.delete(assetId);
                } catch (err) {
                    console.error(`Failed to delete asset ${assetId}:`, err);
                }
            }

            try {
                await sanity.delete(docId);
                console.log(`Deleted document: ${docId}`);
            } catch (err) {
                console.error(`Failed to delete document ${docId}:`, err);
            }
        }

        res.status(200).json({
            message: "Expired tempImage documents deleted successfully",
            count: expiredDocs.length,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

export default router;