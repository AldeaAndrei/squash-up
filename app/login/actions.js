"use server";

import bcrypt from "bcrypt";
import { LoginFormSchema } from "../lib/definitions";
import { createSession } from "../lib/session";

export async function login(state, formData) {
  const validationResults = LoginFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validationResults.success) {
    return {
      errors: validationResults.error.flatten().fieldErrors,
      fields: {
        username: formData.get("username"),
        password: formData.get("password"),
      },
    };
  }

  const { username, password } = validationResults.data;

  try {
    const player = await prisma.players.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!player)
      return {
        errors: { login: "Nu exista jucator cu acest nume sau parola" },
      };

    const match = await bcrypt.compare(password, player.password);
    if (!match)
      return {
        errors: { login: "Nu exista jucator cu acest nume sau parola" },
      };

    const success = await createSession(player.id.toString());

    if (!success) return { errors: { login: "Ceva nu a mers bine." } };

    return {
      message: "Log In successful!",
      playerId: player.id.toString(),
      success,
    };
  } catch (error) {
    console.error("Database error:", error);
    return { errors: { login: "Ceva nu a mers bine." } };
  }
}
