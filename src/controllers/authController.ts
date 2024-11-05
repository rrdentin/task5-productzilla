import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const username_initial = process.env.USERNAME_INITIAL || "admin123";
const password_initial = process.env.PASSWORD_INITIAL || "admin123";

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Harus input username dan password" });
  }

  if (username === username_initial && password === password_initial) {
    res.cookie("isAuthenticated", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.json({ message: "Login Berhasil" });
  } else {
    return res
      .status(401)
      .json({ message: "Username atau password tidak valid" });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("isAuthenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.json({ message: "Logout Berhasil" });
};
