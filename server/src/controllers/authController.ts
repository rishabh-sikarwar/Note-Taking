import type { Request, Response } from "express";
import prisma from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../utils/mailer.js";
import { cookieOptions, logoutCookieOptions } from "../utils/cookieOptions.js";



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
        const tokenRecord = await prisma.verificationToken.findUnique({ where: { email } });
        if (!tokenRecord) {
            return res.status(400).json({ message: 'Invalid request. Please get an OTP first.' });
        }
        if (new Date() > tokenRecord.expiresAt) {
            return res.status(400).json({ message: 'OTP has expired.' });
        }
        const isOTPValid = await bcrypt.compare(otp, tokenRecord.token);
        if (!isOTPValid) {
            return res.status(400).json({ message: 'Invalid OTP.' });
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
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        res.cookie('token', token, cookieOptions);
        res.status(201).json({ message: 'User created successfully.', user: { name: newUser.name, email: newUser.email } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error verifying OTP.' });
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
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    res.cookie("token", token, cookieOptions);
    res
      .status(200)
      .json({
        message: "Logged in successfully.",
        user: { name: user.name, email: user.email },
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during login." });
  }
};


export const getMe = async (req: Request, res: Response) => {
  if (!req.user) {
    // This check is theoretically redundant due to the protect middleware, but good for safety
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { name: true, email: true }, // Only send non-sensitive data
    });

    if (!user) {
      // This can happen if the user was deleted but the token is still valid
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in getMe controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const logout = (req: Request, res: Response) => {
  res.cookie("token", "", logoutCookieOptions);
  res.status(200).json({ message: "Logged out successfully" });
};