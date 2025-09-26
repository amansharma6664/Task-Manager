import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const signToken = (user: { id: string; email: string }) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string };
  } catch (e) {
    return null;
  }
};

