import { useState } from "react"; // 1. Import useState
import AuthLayout from "../components/AuthLayout";
import { Eye, EyeOff, Calendar } from "lucide-react"; // Make sure EyeOff is imported

const SignupPage = () => {
  // Your existing state for showing the OTP field after "Get OTP" is clicked
  const [otpFieldVisible, setOtpFieldVisible] = useState(false);
  // 2. Add new state for toggling the OTP text visibility
  const [showOtpText, setShowOtpText] = useState(false);

  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold mb-2">Sign up</h1>
      <p className="text-gray-500 mb-8">Sign up to enjoy the feature of HD</p>

      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Your Name
          </label>
          <input
            type="text"
            placeholder="Jonas Khanwald"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="11 December 1997"
              className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
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

        {otpFieldVisible && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              OTP
            </label>
            <div className="relative">
              <input
                // 3. Change input type based on state
                type={showOtpText ? "text" : "password"}
                placeholder="OTP"
                className="mt-1 block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {/* 4. Add onClick to toggle state and switch between icons */}
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => setShowOtpText(!showOtpText)}
              >
                {showOtpText ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            if (!otpFieldVisible) {
              setOtpFieldVisible(true);
            } else {
              // TODO: Handle final form submission logic here
            }
          }}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {otpFieldVisible ? "Sign up" : "Get OTP"}
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
          Sign in
        </a>
      </p>
    </AuthLayout>
  );
};

export default SignupPage;
