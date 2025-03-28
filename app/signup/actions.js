"use server";

import bcrypt from "bcrypt";
import sql from "@/db";
import { SignupFormSchema } from "../lib/definitions";
import { createSession } from "../lib/session";

export async function signup(state, formData) {
  const validationResults = SignupFormSchema.safeParse({
    name: formData.get("name"),
    username: formData.get("username"),
    password: formData.get("password"),
  });

  let errors = {
    name: validationResults?.error?.flatten()?.fieldErrors?.name
      ? [...validationResults?.error?.flatten()?.fieldErrors?.name]
      : [],
    username: validationResults?.error?.flatten()?.fieldErrors?.username
      ? [...validationResults?.error?.flatten()?.fieldErrors?.username]
      : [],
    password: validationResults?.error?.flatten()?.fieldErrors?.password
      ? [...validationResults?.error?.flatten()?.fieldErrors?.password]
      : [],
    passwordConfirmation: validationResults?.error?.flatten().fieldErrors
      ?.password
      ? [...validationResults?.error?.flatten()?.fieldErrors?.password]
      : [],
  };

  const usernameDB = await sql`
    SELECT username FROM players WHERE username = ${formData.get("username")}
  `;

  if (usernameDB?.length > 0) errors.username.push("Username-ul exista deja");

  if (formData.get("password") != formData.get("passwordConfirmation"))
    errors.passwordConfirmation.push("Parola este diferita");

  if (!validationResults.success) {
    return {
      errors: errors,
      fields: {
        name: formData.get("name"),
        username: formData.get("username"),
        password: formData.get("password"),
      },
    };
  }

  const { name, username, password } = validationResults.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newPlayerId = await sql`
      INSERT INTO players (name, username, password)
      VALUES (${name}, ${username}, ${hashedPassword})
      RETURNING id;
    `;

    const success = await createSession(newPlayerId[0].id);

    if (!success) return { errors: { login: "Ceva nu a mers bine." } };

    return {
      message: "Log In successful!",
      playerId: newPlayerId[0].id,
      success,
    };
  } catch (error) {
    console.error("Database error:", error);
    return { errors: { signup: "Ceva nu a mers bine." } };
  }
}
