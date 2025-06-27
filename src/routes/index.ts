import express from "express";

import root from "./root";
import form from "./form";
import get from "./get";
import upload from "./upload";

const router = express.Router();

router.use("/", root, form, get, upload);

export default router;