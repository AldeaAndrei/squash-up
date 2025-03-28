"use server";

import bcrypt from "bcrypt";
import sql from "@/db";
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
    const player = await sql`
        SELECT id, password FROM players WHERE username=${username};
    `;

    if (!player || player.length === 0)
      return {
        errors: { login: "Nu exista jucator cu acest nume sau parola" },
      };

    const match = await bcrypt.compare(password, player[0].password);
    if (!match)
      return {
        errors: { login: "Nu exista jucator cu acest nume sau parola" },
      };

    const success = await createSession(player[0].id);

    if (!success) return { errors: { login: "Ceva nu a mers bine." } };

    return {
      message: "Log In successful!",
      playerId: player[0].id,
      success,
    };
  } catch (error) {
    console.error("Database error:", error);
    return { errors: { login: "Ceva nu a mers bine." } };
  }
}
