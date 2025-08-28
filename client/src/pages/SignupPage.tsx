import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // For redirection
import axios from "axios"; // For API calls
import AuthLayout from "../components/AuthLayout";
import { Eye, EyeOff, Calendar } from "lucide-react";

// Configure axios to send cookies with requests
const api = axios.create({
  baseURL: "http://localhost:8000/api", // Your backend URL
  withCredentials: true,
});

const SignupPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate(); // Hook for navigation

  // State for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // We'll treat OTP as a password

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      // Send data to the backend signup endpoint
      const response = await api.post("/auth/signup", {
        name,
        email,
        password,
        // Note: Your backend doesn't handle 'name' or 'dob' yet,
        // but we can send them. We're mainly focused on email/password.
      });

      login(response.data.user);

      setMessage(response.data.message);
      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "An error occurred during sign up."
      );
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold mb-2">Sign up</h1>
      <p className="text-gray-500 mb-8">Sign up to enjoy the feature of HD</p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Your Name
          </label>
          <input
            type="text"
            placeholder="Jonas Khanwald"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* We'll skip the Date of Birth field for now to match the backend */}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            placeholder="jonas_kahnwald@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password (or OTP)
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Sign up
        </button>
      </form>

      {/* Display success or error messages */}
      {message && (
        <p className="mt-4 text-center text-sm text-green-600">{message}</p>
      )}
      {error && (
        <p className="mt-4 text-center text-sm text-red-600">{error}</p>
      )}
    </AuthLayout>
  );
};

export default SignupPage;
