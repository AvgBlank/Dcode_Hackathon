import type { Request, Response } from "express";
import { z } from "zod";
import {
  GH_CLIENT_ID,
  GH_CLIENT_SECRET,
  GH_REDIRECT_URI,
} from "../utils/env.js";
import axios from "axios";
import { fetchGithub } from "../utils/githubFetch.js";
import prisma from "../lib/prisma.js";

const bodySchema = z.object({
  code: z.string().min(1),
});

export const githubOAuthHandler = async (req: Request, res: Response) => {
  const { error, success, data } = bodySchema.safeParse(req.body);
  if (!success) {
    return res
      .status(400)
      .json({ error: "Invalid request", details: error.issues });
  }
  const { code } = data;

  const response = await axios.get(
    "https://github.com/login/oauth/access_token",
    {
      params: {
        client_id: GH_CLIENT_ID,
        client_secret: GH_CLIENT_SECRET,
        redirect_uri: GH_REDIRECT_URI,
        code,
      },
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "application/json",
      },
    }
  );

  const access_token = response.data.access_token;

  const ghUser = await fetchGithub(access_token, "/user");

  const prismaUser = await prisma.user.findFirst({
    where: { id: ghUser.id },
  });

  if (!prismaUser) {
    await prisma.user.create({
      data: {
        id: ghUser.id,
        name: ghUser.name,
        username: ghUser.login,
        accessToken: access_token,
        created: ghUser.created_at,
      },
    });
  } else {
    await prisma.user.update({
      where: { id: ghUser.id },
      data: { accessToken: access_token },
    });
  }

  res.cookie("gh_token", access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    domain: process.env.NODE_ENV === "production" ? undefined : "localhost",
  });

  return res.status(200).json({ message: "OAuth successful" });
};
