import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

let csrfToken: string | null = null;

export const checkLogged = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.accessToken;

  if (!token) {
    res.sendStatus(401); // Unauthorized if no token is present
    return;
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any) => {
    if (err) {
      res.sendStatus(401); // Unauthorized if token verification fails
    } else {
      next();
    }
  });
};

export const createCSRFToken = (req: Request, res: Response): void => {
  csrfToken = req.csrfToken(); // Generate a new CSRF token

  res.send({ csrfToken });
};

export const checkCSRFToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (
    !csrfToken ||
    !req.headers["x-csrf-token"] ||
    csrfToken !== req.headers["x-csrf-token"]
  ) {
    res.sendStatus(403);
    return;
  }
  next();
};
