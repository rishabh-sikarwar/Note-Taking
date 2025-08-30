import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// The 'user' property is now properly typed via our types/index.ts file

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    // Attach user to the request
    req.user = { id: decoded.id };
    next(); // Move on to the next function (our controller)
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
