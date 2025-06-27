import express from "express";
import { readFileSync } from "fs";
import { join } from "path";

const router = express.Router();
const filePath = join(__dirname, "../pages/upload.html");
const content = readFileSync(filePath, "utf-8");

// GET /upload
router.get("/upload", async (req, res) => {
    res.status(200).send(content);
});

export default router;