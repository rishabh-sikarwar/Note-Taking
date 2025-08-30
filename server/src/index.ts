import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import debugRoutes from "./routes/debugRoutes.js";

import passport from "passport";
import "./config/passport.js";

// Load environment variables
dotenv.config();

// Log startup information
console.log('='.repeat(50));
console.log('🚀 Starting Note Taking API Server');
console.log('='.repeat(50));
console.log('Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('BACKEND_URL:', process.env.BACKEND_URL);
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('='.repeat(50));

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware Setup
const allowedOrigins = [
  "http://localhost:5173",
  "https://note-taking-gilt.vercel.app",
];

// Add dynamic origin handling for production
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    const msg = `The CORS policy for this site does not allow access from the specified origin: ${origin}`;
    return callback(new Error(msg), false);
  },
  credentials: true, // Allows cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
};

app.use(cors(corsOptions));
app.use(express.json()); // To parse JSON request bodies
app.use(cookieParser()); // To parse cookies from requests
app.use(passport.initialize()); // Initialize Passport.js

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/debug', debugRoutes);

// Simple test route
app.get("/api/health", (req, res) => {
  res.send("Server is healthy!");
});

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
const server = app.listen(PORT, HOST, () => {
  console.log('✅ Server successfully started!');
  console.log(`🌐 Server is running on http://${HOST}:${PORT}`);
  console.log(`📱 Health check: http://${HOST}:${PORT}/api/health`);
  console.log('='.repeat(50));
});

server.on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  } else {
    console.error('❌ Server error:', error);
  }
  process.exit(1);
});
