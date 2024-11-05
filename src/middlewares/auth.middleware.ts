import { Request, Response, NextFunction } from "express";

const auth = (req: Request, res: Response, next: NextFunction) => {
  const isAuthenticated = req.cookies?.isAuthenticated;

  if (isAuthenticated === "true") {
    return next();
  } else {
    return res.status(401).json({ message: "Akses ditolak. Silakan login." });
  }
};

module.exports = auth;
