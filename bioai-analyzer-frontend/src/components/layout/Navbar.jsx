import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-dark text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-primary-500 hover:text-primary-400 transition-colors">
              BioAI Analyzer
            </Link>
          </div>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex md:items-center md:space-x-6">
              <Link
                to="/dashboard"
                className="text-white hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/history"
                className="text-white hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                History
              </Link>
              <Link
                to="/about"
                className="text-white hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About
              </Link>

              {/* User Info and Logout */}
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-700">
                <span className="text-sm text-gray-300">
                  {user?.name || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          {isAuthenticated && (
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                <span className="sr-only">Open main menu</span>
                {/* Hamburger icon */}
                {!isMobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isAuthenticated && isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              onClick={closeMobileMenu}
              className="text-white hover:bg-gray-700 hover:text-primary-400 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/history"
              onClick={closeMobileMenu}
              className="text-white hover:bg-gray-700 hover:text-primary-400 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              History
            </Link>
            <Link
              to="/about"
              onClick={closeMobileMenu}
              className="text-white hover:bg-gray-700 hover:text-primary-400 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              About
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="px-5">
              <div className="text-sm text-gray-300 mb-3">
                {user?.name || user?.email}
              </div>
              <button
                onClick={handleLogout}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
