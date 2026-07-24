import { NextRequest } from "next/server";
import { verifyToken, TokenPayload } from "./jwt";
import { UnauthorizedError, ForbiddenError } from "../errors";

export async function getAuthUser(req: NextRequest): Promise<TokenPayload | null> {
  const token =
    req.cookies.get("hms_token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(req: NextRequest): Promise<TokenPayload> {
  const user = await getAuthUser(req);
  if (!user) {
    throw new UnauthorizedError("Authentication required");
  }
  return user;
}

export async function requireAdmin(req: NextRequest): Promise<TokenPayload> {
  const user = await requireAuth(req);
  if (user.role !== "ADMIN") {
    throw new ForbiddenError("Admin access required");
  }
  return user;
}
