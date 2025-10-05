import type { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    accessToken: string;
  };
}

export async function authenticateUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Get access token from cookie or header
    const accessToken =
      req.cookies?.gh_token ||
      req.headers["authorization"]?.replace("Bearer ", "");

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        error: "No authentication token found",
      });
    }

    // Find user in database by access token
    const user = await prisma.user.findUnique({
      where: { accessToken: accessToken },
    });

    if (!user || !user.accessToken) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired token",
      });
    }

    // Add user to request
    req.user = {
      id: user.id,
      username: user.username,
      accessToken: user.accessToken,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({
      success: false,
      error: "Authentication failed",
    });
  }
}

export function requireAuth() {
  return authenticateUser;
}
