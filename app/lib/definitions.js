import { z } from "zod";

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Numele trebuie sa aiba cel putin 2 caractere." })
    .trim(),
  username: z
    .string()
    .min(2, { message: "Username-ul trebuie sa aiba cel putin 2 caractere." })
    .trim(),
  password: z
    .string()
    .min(8, { message: "Trebuie sa aiba cel putin 8 caractere." })
    .regex(/[a-zA-Z]/, { message: "Trebuie sa contina cel putin o litera." })
    .regex(/[0-9]/, { message: "Trebuie sa contina cel putin un numar." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Trebuie sa contina cel putin un caracter special.",
    })
    .trim(),
});

export const LoginFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username-ul trebuie sa aiba cel putin 2 caractere." })
    .trim(),
  password: z.string().min(1, { message: "Parola nu este valida" }).trim(),
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
