import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../components/AuthLayout";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  withCredentials: true,
});

const SignupPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("Sending OTP...");
    try {
      await api.post("/auth/send-signup-otp", { email });
      setMessage("An OTP has been sent to your email.");
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP.");
      setMessage("");
    }
  };

  const handleVerifySignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("Verifying...");
    try {
      const response = await api.post("/auth/verify-signup", {
        name,
        email,
        otp,
        dateOfBirth: dob,
      });
      login(response.data.user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed.");
      setMessage("");
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold mb-2">Sign up</h1>
      <p className="text-gray-500 mb-8">Sign up to enjoy the feature of HD</p>

      {/* Login with Google Button */}
      <a
        href={`${
          import.meta.env.VITE_API_URL || "http://localhost:8000/api"
        }/auth/google`}
        className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-md text-gray-700 border border-gray-300 mb-6 bg-white hover:bg-gray-50 transition"
      >
        <img
          src="https://www.svgrepo.com/show/355037/google.svg"
          alt="Google logo"
          className="h-5 w-5"
        />
        Sign up with Google
      </a>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      {step === 1 && (
        <form className="space-y-6" onSubmit={handleSendOTP}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 rounded-md text-white bg-blue-600"
          >
            Get OTP
          </button>
        </form>
      )}

      {step === 2 && (
        <form className="space-y-6" onSubmit={handleVerifySignup}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 rounded-md text-white bg-blue-600"
          >
            Sign Up
          </button>
        </form>
      )}

      {message && (
        <p className="mt-4 text-center text-sm text-green-600">{message}</p>
      )}
      {error && (
        <p className="mt-4 text-center text-sm text-red-600">{error}</p>
      )}

      <p className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-blue-600">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignupPage;
