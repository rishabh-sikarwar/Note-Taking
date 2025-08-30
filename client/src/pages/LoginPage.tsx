  import { useState } from "react";
  import { useAuth } from "../context/AuthContext";
  import { useNavigate, Link } from "react-router-dom";
  import axios from "axios";
  import AuthLayout from "../components/AuthLayout";

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
    withCredentials: true,
  });

  const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSendOTP = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setMessage("Sending OTP...");
      try {
        await api.post("/auth/send-login-otp", { email });
        setMessage("An OTP has been sent to your email.");
        setStep(2);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to send OTP.");
        setMessage("");
      }
    };

    const handleVerifyLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setMessage("Verifying...");
      try {
        const response = await api.post("/auth/verify-login-otp", { email, otp });
        login(response.data.user);
        navigate("/dashboard");
      } catch (err: any) {
        setError(err.response?.data?.message || "Login failed.");
        setMessage("");
      }
    };

    return (
      <AuthLayout>
        <h1 className="text-3xl font-bold mb-2">Sign in</h1>
        <p className="text-gray-500 mb-8">
          Please login to continue to your account.
        </p>

        {step === 1 && (
          <form className="space-y-6" onSubmit={handleSendOTP}>
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
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-6" onSubmit={handleVerifyLogin}>
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
              Sign In
            </button>
          </form>
        )}

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <a
          href={`${
            import.meta.env.VITE_API_URL || "http://localhost:8000/api"
          }/auth/google`}
          className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
            <path
              fill="#4285F4"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
            <path
              fill="#34A853"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8V44c5.268,0,10.046-1.947,13.611-5.657C41.053,34.046,44,29.268,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
            <path
              fill="#FBBC05"
              d="M24,44c5.166,0,9.86-1.977,13.2-5.166l-5.657-5.657C30.046,35.053,27.268,36,24,36c-5.223,0-9.651-3.343-11.303-8H4.341C6.229,36.136,14.5,44,24,44z"
            ></path>
            <path
              fill="#EA4335"
              d="M4.341,28H12.7c-1.649-4.657-1.649-10.343,0-15H4.341C2.371,16.206,2,20,2,24S2.371,31.794,4.341,28z"
            ></path>
          </svg>
          Sign in with Google
        </a>

        {message && (
          <p className="mt-4 text-center text-sm text-green-600">{message}</p>
        )}
        {error && (
          <p className="mt-4 text-center text-sm text-red-600">{error}</p>
        )}

        <p className="mt-8 text-center text-sm text-gray-600">
          Need an account?{" "}
          <Link to="/signup" className="font-medium text-blue-600">
            Create one
          </Link>
        </p>
      </AuthLayout>
    );
  };

  export default LoginPage;
