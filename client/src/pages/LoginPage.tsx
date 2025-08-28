import { useState } from "react"; // 1. Import useState
import AuthLayout from "../components/AuthLayout";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  // 2. Add state to track OTP visibility
  const [showOtp, setShowOtp] = useState(false);

  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold mb-2">Sign in</h1>
      <p className="text-gray-500 mb-8">
        Please login to continue to your account.
      </p>

      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            placeholder="jonas_kahnwald@gmail.com"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              OTP
            </label>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
              Resend OTP
            </a>
          </div>
          <div className="relative mt-1">
            <input
              // 3. Change input type based on state
              type={showOtp ? "text" : "password"}
              placeholder="OTP"
              className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {/* 4. Add onClick to toggle state and switch between icons */}
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setShowOtp(!showOtp)}
            >
              {showOtp ? (
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
            name="keep-logged-in"
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
      <p className="mt-8 text-center text-sm text-gray-600">
        Need an account?{" "}
        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
          Create one
        </a>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
