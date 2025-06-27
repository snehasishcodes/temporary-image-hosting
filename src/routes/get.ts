import express from "express";
import sanity from "../sanity";
import { pipeline } from "stream";
import { promisify } from "util";
import type { ReadableStream as WebReadableStream } from "stream/web";
import { webStreamToNodeStream } from "../lib/stream";

const router = express.Router();
const streamPipeline = promisify(pipeline);

// GET /:id
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const doc = await sanity.fetch(
            `*[_type == "tempImage" && _id == $id][0]{
              "url": image.asset->url,
              expiresAt,
              "mimeType": image.asset->mimeType
            }`,
            { id }
        );

        if (!doc) {
            res.status(404).send("404 NOT FOUND");
            return;
        }

        const now = new Date();
        const expiresAt = new Date(doc.expiresAt);

        if (expiresAt <= now) {
            res.status(410).send("IMAGE EXPIRED");
            return;
        }

        const response = await fetch(doc.url);

        if (!response.ok || !response.body) {
            res.status(500).send("INTERNAL SERVER ERROR");
            return;
        }

        res.setHeader("Content-Type", doc.mimeType || "image/jpeg");

        const nodeStream = webStreamToNodeStream(response.body as WebReadableStream<Uint8Array>);

        await streamPipeline(nodeStream, res);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

export default router;