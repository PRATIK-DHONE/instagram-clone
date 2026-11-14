import { z } from "zod";

export const createPostSchema = z.object({
  caption: z.string().trim().max(2200, "Caption is too long"),
});