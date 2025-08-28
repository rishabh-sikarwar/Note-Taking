import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // 1. Import the useAuth hook
import AuthLayout from "../components/AuthLayout";
import { Eye, EyeOff } from "lucide-react";

// Re-using the axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  withCredentials: true,
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // 2. Get the login function from our context

  // 3. Set up state for form inputs and errors
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // 4. Send login credentials to the backend
      const response = await api.post("/auth/login", { email, password });

      // 5. If login is successful, update the auth context
      // We are passing the user object we expect back from the API
      login(response.data.user);

      // 6. Redirect to the dashboard
      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "An error occurred during login."
      );
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold mb-2">Sign in</h1>
      <p className="text-gray-500 mb-8">
        Please login to continue to your account.
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
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
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              Password (or OTP)
            </label>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
              Resend OTP
            </a>
          </div>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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

        <div className="flex items-center">
          <input
            id="keep-logged-in"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="keep-logged-in"
            className="ml-2 block text-sm text-gray-900"
          >
            Keep me logged in
          </label>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Sign In
        </button>
      </form>

      {error && (
        <p className="mt-4 text-center text-sm text-red-600">{error}</p>
      )}

      <p className="mt-8 text-center text-sm text-gray-600">
        Need an account?{" "}
        <a
          href="/signup"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Create one
        </a>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
