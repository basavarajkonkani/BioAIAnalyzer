import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="text-sm text-gray-400">
            © {currentYear} BioAI Analyzer. All rights reserved.
          </div>

          {/* Links */}
          <div className="flex space-x-6">
            <Link
              to="/about"
              className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
            >
              About
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://biopython.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
            >
              Biopython
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
