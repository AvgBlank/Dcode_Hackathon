import { Router } from "express";
import { githubOAuthHandler } from "./auth.controller.js";

const authRouter = Router();

authRouter.post("/oauth/github", githubOAuthHandler);

export default authRouter;
