"use server";

import bcrypt from "bcrypt";
import { LoginFormSchema } from "../lib/definitions";
import { createSession } from "../lib/session";
import prisma from "@/app/lib/prisma";

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
        errors: { login: "No player found!" },
      };

    const match = await bcrypt.compare(password, player.password);
    if (!match)
      return {
        errors: { login: "No player found!" },
      };

    const success = (await createSession(player.id.toString()))?.success;

    if (!success) return { errors: { login: "Something went wrong!" } };

    return {
      message: "Log In successful!",
      playerId: player.id.toString(),
      success,
    };
  } catch (error) {
    console.error("Database error:", error);
    return { errors: { login: "Something went wrong!" } };
  }
}
