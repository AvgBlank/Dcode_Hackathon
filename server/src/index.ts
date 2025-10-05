import express from "express";
import cors from "cors";
import { FRONTEND_URL, PORT } from "./utils/env.js";
import authRouter from "./auth/auth.routes.js";
import apiRouter from "./routes/index.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: [FRONTEND_URL],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({ message: "Server is healthy!" });
});

// Auth routes
app.use("/api/auth", authRouter);

// Main API routes
app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
