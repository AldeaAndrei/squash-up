import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const secretKey = process.env.SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1hr")
    .sign(key);
}

export async function decrypt(session) {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function createSession(playerId) {
  try {
    const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ playerId, expiresAt });

    const cookieStore = await cookies();

    cookieStore.set("session", session, {
      httpOnly: true,
      secure: true,
      expires: expiresAt,
      sameSite: "lax",
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Create session error: " + JSON.stringify(error));
    return { success: false };
  }
}

export async function verifySession() {
  const cookie = cookies().get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.playerId) {
    redirect("/login");
  }

  return { isAuth: true, playerId: Number(session.playerId) };
}

export async function updateSession() {
  const session = cookies().get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  cookies().set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  try {
    (await cookies()).delete("session");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
