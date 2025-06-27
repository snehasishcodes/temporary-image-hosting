import express from "express";
import { readFileSync } from "fs";
import { join } from "path";

const router = express.Router();
const filePath = join(__dirname, "../pages/home.html");
const content = readFileSync(filePath, "utf-8");

// GET /
router.get("/", async (req, res) => {
    res.status(200).send(content);
});

export default router;