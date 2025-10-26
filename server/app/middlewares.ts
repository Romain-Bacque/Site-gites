import csurf from "csurf";
import { Request, Response, NextFunction, CookieOptions } from "express";
import jwt from "jsonwebtoken";

const csrfCookieConfig: CookieOptions = {
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
};

export const csrfProtection = csurf({
  cookie: csrfCookieConfig,
});

// Vérifie que l'utilisateur est connecté
export const checkLogged = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.accessToken;

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any) => {
    if (err) return res.sendStatus(401);
    next();
  });
};

// Génère un nouveau token et le renvoie au client
export const createCSRFToken = (req: Request, res: Response): void => {
  const csrfToken = req.csrfToken();

  res.cookie("XSRF-TOKEN", req.csrfToken(), csrfCookieConfig);
  res.status(200).json({ csrfToken });
};
