import { Routes, Route, NavLink } from "react-router-dom"; 
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from './components/ProtectedRoute'; 


function App() {
  // Helper function for NavLink classes to keep the JSX clean
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ` +
    (isActive
      ? "bg-white text-blue-600 shadow-md" // Active link style
      : "text-gray-600 hover:bg-white/50"); // Inactive and hover style

  return (
    <>
      <nav className="sticky top-4 z-50 max-w-xs mx-auto bg-white/30 backdrop-blur-md rounded-full shadow-lg p-2 mb-8">
        <div className="flex justify-center items-center space-x-2">
          <NavLink to="/signup" className={getNavLinkClass}>
            Sign Up
          </NavLink>
          <NavLink to="/login" className={getNavLinkClass}>
            Login
          </NavLink>
          <NavLink to="/dashboard" className={getNavLinkClass}>
            Dashboard
          </NavLink>
        </div>
      </nav>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
