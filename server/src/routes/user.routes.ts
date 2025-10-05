import { Router } from "express";
import type { Response } from "express";
import { GitHubService } from "../services/github.service.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";

const userRouter = Router();

// Check authentication status
userRouter.get(
  "/auth-check",
  requireAuth(),
  async (req: AuthenticatedRequest, res: Response) => {
    res.json({
      success: true,
      authenticated: true,
      user: {
        id: req.user!.id,
        username: req.user!.username,
      },
    });
  }
);

// Get current user profile
userRouter.get(
  "/profile",
  requireAuth(),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const github = new GitHubService(req.user!.accessToken);

      const [user, repos] = await Promise.all([
        github.getAuthenticatedUser(),
        github.getUserRepositories(),
      ]);

      res.json({
        success: true,
        data: {
          id: user.id,
          login: user.login,
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
          bio: user.bio,
          location: user.location,
          blog: user.blog,
          twitter_username: user.twitter_username,
          public_repos: user.public_repos,
          followers: user.followers,
          following: user.following,
          created_at: user.created_at,
          repositories_count: repos.length,
          maintained_repositories: repos.filter(
            (repo) => repo.owner.login === user.login && !repo.archived
          ).length,
        },
      });
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch user profile",
      });
    }
  }
);

// Get user by username (public profile)
userRouter.get("/profile/:username", async (req, res: Response) => {
  try {
    // For public profiles, we can use a default token or make public API calls
    // This would require a GitHub App token or public access
    const { username } = req.params;

    res.json({
      success: false,
      error: "Public profile viewing not implemented yet",
    });
  } catch (error: any) {
    console.error("Error fetching public profile:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch public profile",
    });
  }
});

// Update user profile (database fields)
userRouter.put(
  "/profile",
  requireAuth(),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { about, twitter, linkedIn, mail, portfolio } = req.body;

      // Update user in database
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();

      const updatedUser = await prisma.user.update({
        where: { id: req.user!.id },
        data: {
          about: about || undefined,
          twitter: twitter || undefined,
          linkedIn: linkedIn || undefined,
          mail: mail || undefined,
          portfolio: portfolio || undefined,
        },
      });

      res.json({
        success: true,
        data: updatedUser,
        message: "Profile updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to update profile",
      });
    }
  }
);

// Share profile - generate shareable link
userRouter.post(
  "/profile/share",
  requireAuth(),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      const shareUrl = `${baseUrl}/profile/${req.user!.username}`;

      res.json({
        success: true,
        data: {
          share_url: shareUrl,
          qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
            shareUrl
          )}`,
        },
      });
    } catch (error: any) {
      console.error("Error generating share link:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to generate share link",
      });
    }
  }
);

export default userRouter;
