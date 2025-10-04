import express from "express";
import cors from "cors";
import { PORT } from "./utils/env.js";
import authRouter from "./auth/auth.routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({ message: "Server is healthy!" });
});

app.use("/api", authRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
