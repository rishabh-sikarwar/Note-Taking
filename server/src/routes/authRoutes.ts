import { Router } from "express";
import {
  sendSignupOTP,
  verifySignup,
  sendLoginOTP,
  verifyLoginOTP,
  logout,
  getMe
} from "../controllers/authController.js";
import passport from "passport";
import jwt from "jsonwebtoken";

import { protect } from '../middleware/authMiddleware.js'; // Import protect
import { cookieOptions } from "../utils/cookieOptions.js";



const router = Router();

router.post("/send-signup-otp", sendSignupOTP);
router.post("/verify-signup", verifySignup);
router.post("/send-login-otp", sendLoginOTP);
router.post("/verify-login-otp", verifyLoginOTP);

// Route to start the Google OAuth flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// Route for Google to redirect to after authentication
router.get(
  '/google/callback',
  (req, res, next) => {
    const failureRedirect = `${process.env.FRONTEND_URL}/login`;
    passport.authenticate('google', { 
      failureRedirect, 
      session: false 
    })(req, res, next);
  },
  (req, res) => {
    try {
      // On successful authentication, Passport attaches the user to req.user
      const user = req.user as any;
      
      if (!user) {
        console.error('No user found in req.user after Google OAuth');
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=authentication_failed`);
      }
      
      console.log(`Google OAuth successful for user: ${user.email}`);
      
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
      });
      
      res.cookie('token', token, cookieOptions);
      
      // Redirect to the frontend dashboard
      res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    } catch (error) {
      console.error('Error in Google OAuth callback:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
  }
);



// Route to get the currently logged-in user
router.get('/me', protect, getMe);

router.post('/logout', logout);

export default router;
