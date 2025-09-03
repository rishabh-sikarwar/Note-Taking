import { CookieOptions } from "express";

// These options will be used everywhere to set a cookie
export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 3600000, // 1 hour
};

// Special options for clearing the cookie on logout
export const logoutCookieOptions: CookieOptions = {
  ...cookieOptions,
  expires: new Date(0),
  maxAge: undefined,
};
