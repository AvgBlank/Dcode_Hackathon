import { Router } from "express";
import type { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";

const settingsRouter = Router();
const prisma = new PrismaClient();

// Get user settings/preferences
settingsRouter.get(
  "/",
  requireAuth(),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          username: user.username,
          about: user.about,
          twitter: user.twitter,
          linkedIn: user.linkedIn,
          mail: user.mail,
          portfolio: user.portfolio,
          has_github_token: !!user.accessToken,
          created_at: user.created,
        },
      });
    } catch (error: any) {
      console.error("Error fetching settings:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch settings",
      });
    }
  }
);

// Update user settings
settingsRouter.put(
  "/",
  requireAuth(),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { name, about, twitter, linkedIn, mail, portfolio } = req.body;

      const updatedUser = await prisma.user.update({
        where: { id: req.user!.id },
        data: {
          name: name || undefined,
          about: about || undefined,
          twitter: twitter || undefined,
          linkedIn: linkedIn || undefined,
          mail: mail || undefined,
          portfolio: portfolio || undefined,
        },
      });

      res.json({
        success: true,
        data: {
          id: updatedUser.id,
          name: updatedUser.name,
          username: updatedUser.username,
          about: updatedUser.about,
          twitter: updatedUser.twitter,
          linkedIn: updatedUser.linkedIn,
          mail: updatedUser.mail,
          portfolio: updatedUser.portfolio,
        },
        message: "Settings updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating settings:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update settings",
      });
    }
  }
);

// Update GitHub token
settingsRouter.put(
  "/github-token",
  requireAuth(),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { accessToken } = req.body;

      if (!accessToken) {
        return res.status(400).json({
          success: false,
          error: "Access token is required",
        });
      }

      // Validate token by making a test API call
      try {
        const response = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        });

        if (!response.ok) {
          throw new Error("Invalid GitHub token");
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: "Invalid GitHub access token",
        });
      }

      await prisma.user.update({
        where: { id: req.user!.id },
        data: { accessToken },
      });

      res.json({
        success: true,
        message: "GitHub token updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating GitHub token:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update GitHub token",
      });
    }
  }
);

// Disconnect GitHub
settingsRouter.delete(
  "/github-token",
  requireAuth(),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      await prisma.user.update({
        where: { id: req.user!.id },
        data: { accessToken: null },
      });

      res.json({
        success: true,
        message: "GitHub account disconnected successfully",
      });
    } catch (error: any) {
      console.error("Error disconnecting GitHub:", error);
      res.status(500).json({
        success: false,
        error: "Failed to disconnect GitHub account",
      });
    }
  }
);

export default settingsRouter;
