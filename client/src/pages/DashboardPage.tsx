import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Trash2, Plus } from "lucide-react";
import logo from "../assets/image.png";

// Setup an axios instance for API calls
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

// Define a TypeScript type for our note object to match the backend
type Note = {
  id: string;
  title: string;
  content: string | null;
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Get user and logout function from our AuthContext

  // State to hold the list of notes and the new note's title
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [loading, setLoading] = useState(true);

  // This `useEffect` hook runs once when the component is first rendered
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const response = await api.get("/notes");
        setNotes(response.data);
      } catch (error) {
        console.error("Failed to fetch notes", error);
      } finally {
        setLoading(false);
      }
    };

    // This is the new logic: only fetch notes if the user exists.
    if (user) {
      fetchNotes();
    } else {
      setLoading(false); // If there's no user, we're not loading anything.
    }
  }, [user]); // Re-run this effect if the user state changes.

  // Function to handle creating a new note
  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;

    try {
      const response = await api.post("/notes", { title: newNoteTitle });
      setNotes([response.data, ...notes]); // Add new note to the top of the list
      setNewNoteTitle(""); // Clear the input field
    } catch (error) {
      console.error("Failed to create note", error);
    }
  };

  // Function to handle deleting a note
  const handleDeleteNote = async (noteId: string) => {
    try {
      await api.delete(`/notes/${noteId}`);
      setNotes(notes.filter((note) => note.id !== noteId)); // Remove note from the list
    } catch (error) {
      console.error("Failed to delete note", error);
    }
  };

  // Function to handle user logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src={logo} alt="logo" className="h-8 w-8" />
          <h1 className="text-xl font-semibold ml-3">Dashboard</h1>
        </div>
        <button onClick={handleLogout} className="text-blue-600 font-medium">
          Sign Out
        </button>
      </header>

      <main className="p-6 max-w-3xl mx-auto">
        {/* Welcome Card displays user's email */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-1">
            {" "}
            Welcome, {user?.name || "User"}!
          </h2>
          <p className="text-gray-500">Email:  {user?.email}</p>
        </div>

        {/* Create Note form */}
        <form onSubmit={handleCreateNote} className="flex gap-4 mb-8">
          <input
            type="text"
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            placeholder="Enter a new note title..."
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus size={20} />
            <span className="ml-2 hidden sm:inline">Create</span>
          </button>
        </form>

        {/* Notes List */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Your Notes</h3>
          {loading ? (
            <p className="text-gray-500">Loading notes...</p>
          ) : (
            <div className="space-y-4">
              {notes.length > 0 ? (
                notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
                  >
                    <p className="text-gray-800">{note.title}</p>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">
                  You have no notes yet.
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
