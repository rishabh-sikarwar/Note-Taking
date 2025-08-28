import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// We need to add the 'user' property to the Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string };
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // Attach user to the request
    req.user = { userId: decoded.userId };
    next(); // Move on to the next function (our controller)
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
