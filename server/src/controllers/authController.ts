import type { Request, Response } from "express";
import prisma from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../utils/mailer.js";
import passport from "passport";

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
  // 1. Removed `password` from the inputs
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
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });
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
      // This should not happen if the login OTP was sent, but it's a good safeguard
      return res.status(404).json({ message: "User not found." });
    }

    await prisma.verificationToken.delete({ where: { email } });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });
    res.status(200).json({
      message: "Logged in successfully.",
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during login." });
  }
};

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// Step 2: Google's callback route (UPDATED VERSION)

export const googleAuthCallback = (
  req: Request,
  res: Response,
  next: Function
) => {
  console.log("--- 1. ENTERING GOOGLE CALLBACK CONTROLLER ---"); // Log entry point

  passport.authenticate(
    "google",
    {
      session: false,
    },
    (err: any, user: any, info: any) => {
      console.log("--- 2. PASSPORT AUTHENTICATE CUSTOM CALLBACK FIRED ---"); // Log when passport's callback runs

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

      // Create the JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
      });
      console.log("--- 4. JWT CREATED ---");

      // Set the JWT in an httpOnly cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        sameSite: "lax",
      });
      console.log("--- 5. COOKIE HAS BEEN SET ---");

      // Redirect the user to the frontend dashboard
      console.log("--- 6. REDIRECTING TO DASHBOARD ---");
      res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    }
  )(req, res, next);
};

export const getMe = async (req: Request, res: Response) => {
  try {
    // If the 'protect' middleware passed, it attached the user's ID to req.user
    // We use that ID to find the user in the database.
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      // IMPORTANT: Only select the data you want to send to the frontend.
      // Never send back sensitive information.
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Send the user data back to the frontend
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error." });
  }
};
