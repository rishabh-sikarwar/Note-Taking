import { CookieOptions } from "express"; // 1. Import the official type

// 2. Apply the CookieOptions type to our constant
export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 3600000, // 1 hour
};

// 3. The logout options will also use this type
export const logoutCookieOptions: CookieOptions = {
  ...cookieOptions,
  expires: new Date(0),
  maxAge: undefined,
};
