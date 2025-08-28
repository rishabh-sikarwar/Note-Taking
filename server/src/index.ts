import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware Setup
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true, // Allows cookies to be sent
  })
);
app.use(express.json()); // To parse JSON request bodies
app.use(cookieParser()); // To parse cookies from requests

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes' , notesRoutes)

// Simple test route
app.get("/api/health", (req, res) => {
  res.send("Server is healthy!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
