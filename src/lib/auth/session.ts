import { auth } from "./index";
import { headers } from "next/headers";

export async function getServerSession() {
  try {
    const headerList = await headers();
    const session = await auth.api.getSession({
      headers: headerList,
    });
    return session;
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const session = await getServerSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  return session;
}
