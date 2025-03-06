import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useState } from "react";

const Navbar = () => {
  const { isAuthenticated, role, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/5 backdrop-blur-lg border-b border-blue-500/20 w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <svg 
              className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors"
              viewBox="0 0 500 500"
              aria-hidden="true"
            >
              <rect width="500" height="31.667" fill="currentColor"/>
              <rect x="0" y="0.5" width="31.667" height="500" fill="currentColor"/>
              <rect x="0" y="471.667" width="500" height="31.667" fill="currentColor"/>
              <rect x="468.333" y="0.5" width="31.667" height="500" fill="currentColor"/>
              <path
                d="M192.216 81.966v159.045H57.819v177.023H235V81.966H192.216z M192.216 375.25h-91.613v-91.455h91.613V375.25z"
                fill="currentColor"
              />
              <path
                d="M305.667 418.333l-40.304-0.667V81.287h40.014"
                fill="currentColor"
              />
              <polyline
                points="305.667 418.333 443 418.333 443 375.25 305 375.25"
                fill="currentColor"
              />
            </svg>
            <span className="text-2xl font-extrabold bg-blue-600 bg-clip-text text-transparent">
              deLib
            </span>
          </Link>

          {/* Hamburger Menu Button (visible on mobile) */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
              />
            </svg>
          </button>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex md:items-center md:gap-6">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 relative before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-0.5 before:bg-blue-600 before:transition-all hover:before:w-full"
              >
                Home
              </Link>
              
              {(isAuthenticated && role === "ROLE_LIBRARIAN") && (
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 relative before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-0.5 before:bg-blue-600 before:transition-all hover:before:w-full"
                >
                  Dashboard
                </Link>
              )}
              
              {(isAuthenticated && role === "ROLE_CLIENT") && (
                <>
                  <Link
                    to="/search"
                    className="text-sm font-medium text-gray-600 hover:text-blue-600 relative before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-0.5 before:bg-blue-600 before:transition-all hover:before:w-full"
                  >
                    Search
                  </Link>
                  <Link
                    to="/account"
                    className="text-sm font-medium text-gray-600 hover:text-blue-600 relative before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-0.5 before:bg-blue-600 before:transition-all hover:before:w-full"
                  >
                    Account
                  </Link>
                </>
              )}
            </div>

            <div className="h-6 w-px bg-gray-200 mx-4" aria-hidden="true" />
            
            <div className="flex items-center gap-4">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-all"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  <span className="text-sm font-medium px-2 py-1 rounded-md bg-blue-50 text-blue-700">
                    {role?.replace("ROLE_", "")}
                  </span>
                  <button
                    onClick={logout}
                    className="text-sm font-medium text-gray-600 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>

        {/* Mobile Menu - shown when hamburger is clicked */}
        <div 
          className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} pb-4`}
        >
          <div className="flex flex-col gap-4 pt-2">
            <Link
              to="/"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>

            {(isAuthenticated && role === "ROLE_LIBRARIAN") && (
              <Link
                to="/dashboard"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}

            {(isAuthenticated && role === "ROLE_CLIENT") && (
              <>
                <Link
                  to="/search"
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Search
                </Link>
                <Link
                  to="/account"
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Account
                </Link>
              </>
            )}

            <div className="h-px w-full bg-gray-200 my-2" />

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 rounded-lg shadow-sm hover:shadow-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <span className="text-sm font-medium px-3 py-2 text-blue-700">
                  {role?.replace("ROLE_", "")}
                </span>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-sm font-medium text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 text-left"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;