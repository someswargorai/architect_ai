import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const JWT_SECRET: Secret = process.env.JWT_SECRET as Secret;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables");
}

export function signJwt(
  payload: JwtPayload | object,
  expiresIn: SignOptions["expiresIn"] = "7d",
): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyJwt<T extends object = JwtPayload>(token: string): T {
  return jwt.verify(token, JWT_SECRET) as T;
}
