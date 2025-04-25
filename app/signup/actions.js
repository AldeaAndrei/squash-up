"use server";

import bcrypt from "bcrypt";
import { SignupFormSchema } from "../lib/definitions";
import { createSession } from "../lib/session";
import prisma from "../lib/prisma";

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

  const player = await prisma.players.findUnique({
    where: {
      username: formData.get("username"),
    },
    select: {
      username: true,
    },
  });

  console.log(player);

  if (player?.length > 0) errors.username.push("Username-ul exista deja");

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
    const newPlayer = await prisma.players.create({
      data: {
        name,
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });

    const success = await createSession(newPlayer.id.toString());

    if (!success) return { errors: { login: "Ceva nu a mers bine." } };

    return {
      message: "Log In successful!",
      playerId: newPlayer.id.toString(),
      success,
    };
  } catch (error) {
    console.error("Database error:", error);
    return { errors: { signup: "Ceva nu a mers bine." } };
  }
}
