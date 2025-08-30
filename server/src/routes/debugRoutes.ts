import { Router } from "express";

const router = Router();

// Debug route to check environment variables
router.get('/env', (req, res) => {
  res.json({
    NODE_ENV: process.env.NODE_ENV,
    FRONTEND_URL: process.env.FRONTEND_URL,
    BACKEND_URL: process.env.BACKEND_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? '***SET***' : 'NOT SET',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? '***SET***' : 'NOT SET',
    PORT: process.env.PORT || 8000,
    callbackURL: process.env.NODE_ENV === "production" 
      ? `${process.env.BACKEND_URL}/api/auth/google/callback`
      : `http://localhost:${process.env.PORT || 8000}/api/auth/google/callback`,
  });
});

// Test route to verify server is working
router.get('/test', (req, res) => {
  res.json({
    message: 'Debug route working',
    timestamp: new Date().toISOString(),
    url: req.url,
    method: req.method,
    headers: req.headers
  });
});

export default router;
