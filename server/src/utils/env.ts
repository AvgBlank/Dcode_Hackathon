import { z } from "zod/v4";
import { config } from "dotenv";

config(); // Load environment variables

const envSchema = z.object({
  GH_CLIENT_ID: z.string().min(1, "GH_CLIENT_ID is required"),
  GH_CLIENT_SECRET: z.string().min(1, "GH_CLIENT_SECRET is required"),
  GH_REDIRECT_URI: z.url().min(1),
  PORT: z.string().prefault("8000"),
});

const { success, data, error } = envSchema.safeParse(process.env);
if (!success) {
  console.error("❌ Invalid environment variables:", error.issues);
  process.exit(1);
}

export const { GH_CLIENT_ID, GH_CLIENT_SECRET, GH_REDIRECT_URI, PORT } = data;
