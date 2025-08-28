import React from "react";
import logo from "../assets/image.png";
import bgImage from "../assets/bg-image.jpg";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row p-6 border-2">
      {/* Left Section: Form */}
      {/* --- The classes on this line are updated --- */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center flex-grow p-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center mb-10 self-start">
            <img src={logo} alt="Logo" className="h-8 w-8" />
            <span className="ml-2 text-xl font-bold">HD</span>
          </div>
          {/* Form content */}
          {children}
        </div>
      </div>

      {/* Right Section: Image (This part is already correct) */}
      <div className="hidden md:block md:w-1/2 rounded-lg overflow-hidden shadow-lg">
        <img
          src={bgImage}
          alt="Background"
          className="w-full h-screen object-cover"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
