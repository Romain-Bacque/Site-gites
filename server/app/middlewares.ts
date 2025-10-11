import csurf from "csurf";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const csrfProtection = csurf({
  cookie: {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  },
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

  res.cookie("XSRF-TOKEN", req.csrfToken(), {
    secure: process.env.NODE_ENV === "production",
    httpOnly: false,
    sameSite: "none",
  });

  res.status(200).json({ csrfToken });
};
