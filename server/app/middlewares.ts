import csurf from "csurf";
import { Request, Response, NextFunction, CookieOptions } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const csrfCookieConfig: CookieOptions = {
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
};

export const csrfProtection = csurf({
  cookie: csrfCookieConfig,
});

// Vérifie que l'utilisateur est connecté (admin uniquement)
export const checkLogged = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.accessToken;

  if (!token) return res.sendStatus(401);

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err: any, decoded: any) => {
      if (err || !decoded) return res.sendStatus(401);

      const payload = decoded satisfies JwtPayload & {
        role?: string;
        isAdmin?: boolean;
      };

      const isAdmin = payload.isAdmin || payload.role === "admin";

      if (!isAdmin) return res.sendStatus(403);

      next();
    }
  );
};

// Vérifie que l'utilisateur est authentifié (tout utilisateur connecté)
export const checkAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.accessToken;

  if (!token) return res.sendStatus(401);

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err: any, decoded: any) => {
      if (err || !decoded) return res.sendStatus(401);

      // Attach user info to request for use in controller
      (req as any).user = decoded;
      next();
    }
  );
};

// Génère un nouveau token et le renvoie au client
export const createCSRFToken = (req: Request, res: Response): void => {
  const csrfToken = req.csrfToken();

  res.cookie("XSRF-TOKEN", req.csrfToken(), csrfCookieConfig);
  res.status(200).json({ csrfToken });
};
