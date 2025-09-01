import type { Request, Response } from "express";
import prisma from "../db.js";

// @desc    Get all notes for a user
// @route   GET /api/notes
export const getNotes = async (req: Request, res: Response) => {
  // FIX: Add a check to ensure req.user exists before using it.
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const notes = await prisma.note.findMany({
      where: {
        authorId: req.user.userId, // TypeScript now knows req.user is defined
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a new note
// @route   POST /api/notes
export const createNote = async (req: Request, res: Response) => {
  const { title, content } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  // Although our middleware protects this, an extra check is good practice.
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        authorId: req.user.userId, // The '!' is no longer needed after the check
      },
    });
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
export const deleteNote = async (req: Request, res: Response) => {
  const { id } = req.params;

  // FIX: Add a check for both req.user and the id from the URL params.
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }
  if (!id) {
    return res.status(400).json({ message: "Note ID is required" });
  }

  try {
    // First, find the note to ensure it belongs to the user
    const note = await prisma.note.findUnique({
      where: { id }, // TypeScript now knows 'id' is a string
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check if the note belongs to the logged-in user
    if (note.authorId !== req.user.userId) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await prisma.note.delete({
      where: { id }, // TypeScript now knows 'id' is a string
    });

    res.json({ message: "Note removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
