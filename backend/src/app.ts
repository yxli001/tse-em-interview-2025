import "module-alias/register";
import express from "express";
import cors from "cors";
import env from "./utils/env";
import contactRouter from "./routes/contact";

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: env.FRONTEND_ORIGIN,
    })
);

app.use("/api/contact", contactRouter);

export default app;
