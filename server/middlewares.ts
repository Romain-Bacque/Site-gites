import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const checkLogged = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken as string | undefined;
  if (!token) {
    return res.json({
      ok: false,
      status: 401,
      message: "access unauthorized",
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err) => {
    if (err) {
      return res.json({
        ok: false,
        status: 401,
        message: "access unauthorized",
      });
    } else {
      next();
    }
  });
};
