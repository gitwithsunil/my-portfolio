import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const expectedPassword = process.env.VAULT_DELETE_PASSWORD;
  if (!expectedPassword) {
    return NextResponse.json({ error: "Delete password is not configured." }, { status: 503 });
  }

  let password: unknown;
  try {
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (typeof password !== "string") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const expectedHash = createHash("sha256").update(expectedPassword).digest();
  const suppliedHash = createHash("sha256").update(password).digest();
  if (!timingSafeEqual(expectedHash, suppliedHash)) {
    return NextResponse.json({ error: "Password did not match." }, { status: 401 });
  }

  return NextResponse.json({ authorized: true });
}
