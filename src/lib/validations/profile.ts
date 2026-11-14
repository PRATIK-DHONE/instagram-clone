import { z } from "zod";

export const updateProfileSchema = z.object({
    name: z.string().trim().max(60).optional(),
    bio:  z.string().trim().max(150).optional(),
});