import { z } from "zod";
import { registerSchema, loginSchema } from "@fullstack-master/shared";

export const registerValidation = z.object({
    body: registerSchema,
});

export const loginValidation = z.object({
    body: loginSchema,
});
