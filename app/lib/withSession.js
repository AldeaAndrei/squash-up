import { cookies } from "next/headers";
import { decrypt } from "./session";

export async function withSession(handler) {
  return async function (req, ...args) {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return new Response("Unauthorized (no session cookie)", { status: 401 });
    }

    const session = await decrypt(sessionCookie);

    if (!session?.playerId) {
      return new Response("Unauthorized (invalid session)", { status: 401 });
    }

    // Attach session to the request
    req.session = session;

    return handler(req, ...args);
  };
}
