import { createClient } from "@sanity/client";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") dotenv.config();

const sanity = createClient({
    projectId: "qip2n2c0",
    dataset: "production",
    apiVersion: "2025-06-23",
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false,
});

export default sanity;