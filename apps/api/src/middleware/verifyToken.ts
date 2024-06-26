import { NextFunction, Request, Response } from "express";
import { verify, TokenExpiredError } from "jsonwebtoken";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token not found" });
    }

    const checkToken = verify(token, process.env.TOKEN_KEY || "secret");
    res.locals.decript = checkToken;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(403).json({ error: "Invalid token" });
  }
};

export const verifyLoginToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token not found" });
    }

    const decoded = verify(token, process.env.TOKEN_KEY || "secret") as { id: number; role: string };
    res.locals.user = { id: decoded.id, role: decoded.role };

    next();
  } catch (error) {
    console.error("Login token verification error:", error);
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ error: "Login token expired" });
    }
    return res.status(403).json({ error: "Invalid login token" });
  }
};