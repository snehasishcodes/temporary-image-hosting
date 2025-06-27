import express from "express";

import root from "./root";
import get from "./get";
import upload from "./upload";

const router = express.Router();

router.use("/", root, get, upload);

export default router;