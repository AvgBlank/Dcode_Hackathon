import { Router } from "express";
import userRouter from "./user.routes.js";
import repositoriesRouter from "./repositories.routes.js";
import analyticsRouter from "./analytics.routes.js";
import triageRouter from "./triage.routes.js";
import settingsRouter from "./settings.routes.js";
import historyRouter from "./history.routes.js";

const apiRouter = Router();

// Mount all route modules
apiRouter.use("/user", userRouter);
apiRouter.use("/repositories", repositoriesRouter);
apiRouter.use("/analytics", analyticsRouter);
apiRouter.use("/triage", triageRouter);
apiRouter.use("/settings", settingsRouter);
apiRouter.use("/history", historyRouter);

// Health check endpoint
apiRouter.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});

export default apiRouter;
