import { z } from "zod";

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "The name must have at least 2 characters." })
    .trim(),
  username: z
    .string()
    .min(2, { message: "The username must have at least 2 characters." })
    .trim(),
  password: z
    .string()
    .min(8, { message: "It must have at least 8 characters." })
    .regex(/[a-zA-Z]/, { message: "It must contain at least one letter." })
    .regex(/[0-9]/, { message: "It must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "It must contain at least one special character.",
    })
    .trim(),
});

export const LoginFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "The username must have at least 2 characters." })
    .trim(),
  password: z.string().min(1, { message: "Password not valid" }).trim(),
});

export const FormState = {
  errors: {
    name: [],
    username: [],
    email: [],
    password: [],
  },
  message: "",
};

export const SessionPayload = {
  playerId: "",
  expiresAt: new Date(),
};
