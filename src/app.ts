import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") dotenv.config();

import routes from "./routes";

const app = express();

app.set("trust proxy", true);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/", routes);

// 404 Handler
app.use((req, res) => {
    // console.log(res);
    res.status(404).json({ message: "Not Found" });
});

export default app;