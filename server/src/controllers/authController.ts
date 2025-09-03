import type { Request, Response } from "express";
import prisma from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../utils/mailer.js";
import passport from "passport";
import { cookieOptions , logoutCookieOptions } from "../utils/cookieOptions.js";

// Step 1 for Signup: Send OTP
export const sendSignupOTP = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists." });
    }
    const { otp, otpExpiresAt } = await sendOTPEmail(email);
    const hashedOTP = await bcrypt.hash(otp, 10);

    // Create a temporary verification token instead of a partial user
    await prisma.verificationToken.upsert({
      where: { email },
      update: { token: hashedOTP, expiresAt: otpExpiresAt },
      create: { email, token: hashedOTP, expiresAt: otpExpiresAt },
    });

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending OTP." });
  }
};

// Step 2 for Signup: Verify OTP and Create User
export const verifySignup = async (req: Request, res: Response) => {
  const { name, email, otp, dateOfBirth } = req.body;
  try {
    const tokenRecord = await prisma.verificationToken.findUnique({
      where: { email },
    });
    if (!tokenRecord) {
      return res
        .status(400)
        .json({ message: "Invalid request. Please get an OTP first." });
    }
    if (new Date() > tokenRecord.expiresAt) {
      return res.status(400).json({ message: "OTP has expired." });
    }
    const isOTPValid = await bcrypt.compare(otp, tokenRecord.token);
    if (!isOTPValid) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // Create the user after OTP verification
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        dateOfBirth: new Date(dateOfBirth),
      },
    });

    // Delete the used verification token
    await prisma.verificationToken.delete({ where: { email } });

    // Log the user in
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    res.cookie("token", token, cookieOptions);
    res.status(201).json({
      message: "User created successfully.",
      user: { name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verifying OTP." });
  }
};

// Login functions will also use the new token table
export const sendLoginOTP = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email not found." });
    }
    const { otp, otpExpiresAt } = await sendOTPEmail(email);
    const hashedOTP = await bcrypt.hash(otp, 10);

    await prisma.verificationToken.upsert({
      where: { email },
      update: { token: hashedOTP, expiresAt: otpExpiresAt },
      create: { email, token: hashedOTP, expiresAt: otpExpiresAt },
    });

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending OTP." });
  }
};

export const verifyLoginOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  try {
    const tokenRecord = await prisma.verificationToken.findUnique({
      where: { email },
    });
    if (!tokenRecord) {
      return res
        .status(400)
        .json({ message: "Invalid request. Please get an OTP first." });
    }
    if (new Date() > tokenRecord.expiresAt) {
      return res.status(400).json({ message: "OTP has expired." });
    }
    const isOTPValid = await bcrypt.compare(otp, tokenRecord.token);
    if (!isOTPValid) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await prisma.verificationToken.delete({ where: { email } });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    res.cookie("token", token, cookieOptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during login." });
  }
};

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleAuthCallback = (
  req: Request,
  res: Response,
  next: Function
) => {
  console.log("--- 1. ENTERING GOOGLE CALLBACK CONTROLLER ---");

  passport.authenticate(
    "google",
    {
      session: false,
    },
    (err: any, user: any, info: any) => {
      console.log("--- 2. PASSPORT AUTHENTICATE CUSTOM CALLBACK FIRED ---");

      if (err) {
        console.error("Authentication framework error:", err);
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=auth_framework_error`
        );
      }
      if (!user) {
        console.error("Authentication failed, no user returned by strategy.");
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=auth_failed`
        );
      }

      console.log("--- 3. USER AUTHENTICATED SUCCESSFULLY ---");
      console.log("User object:", user);

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
      });
      console.log("--- 4. JWT CREATED ---");

      res.cookie("token", token, cookieOptions);
      console.log("--- 5. COOKIE HAS BEEN SET ---");

      console.log("--- 6. REDIRECTING TO DASHBOARD ---");
      res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    }
  )(req, res, next);
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const logout = (req: Request, res: Response) => {
  res.cookie("token", "", logoutCookieOptions); // Use the imported logout options
  res.status(200).json({ message: "Logged out successfully" });
};