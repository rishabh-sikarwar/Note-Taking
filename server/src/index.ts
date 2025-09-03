import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import authRoutes from "./routes/authRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import "./config/passport.js"; // Ensure passport strategies are configured

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware Setup
const allowedOrigins = [
  "http://localhost:5173",
  "https://note-taking-gilt.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Initialize Passport.js (without sessions)
app.use(passport.initialize());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// Simple test route
app.get("/api/health", (req, res) => {
  res.send("Server is healthy!");
});

app.get("/api/version", (req, res) => {
  res.json({ version: "1.1.0" });
});

// Start the server
const HOST = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";
app.listen(PORT, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
