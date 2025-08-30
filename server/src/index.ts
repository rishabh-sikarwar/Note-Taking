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

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware Setup
const allowedOrigins = [
  "http://localhost:5173",
  "https://note-taking-gilt.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins, // Your frontend URL
    credentials: true, // Allows cookies to be sent
  })
);
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
