import { Router } from "express";
import {
  sendSignupOTP,
  verifySignup,
  sendLoginOTP,
  verifyLoginOTP,
  googleAuth,
  googleAuthCallback,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/send-signup-otp", sendSignupOTP);
router.post("/verify-signup", verifySignup);
router.post("/send-login-otp", sendLoginOTP);
router.post("/verify-login-otp", verifyLoginOTP);

router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);

router.get("/me", protect, getMe);

export default router;
