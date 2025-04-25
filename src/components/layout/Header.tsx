import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Briefcase as BriefcaseBusiness, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  // Change header background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        isScrolled || isMenuOpen ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:!cursor-pointer">
            <BriefcaseBusiness size={28} className="text-primary-600" />
            <span className="text-xl font-bold text-gray-800">JobGenie</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/jobs"
              className={`font-medium transition-colors hover:text-primary-600 hover:!cursor-pointer ${
                location.pathname === '/jobs' ? 'text-primary-600' : 'text-gray-700'
              }`}
            >
              Browse Jobs
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className={`font-medium transition-colors hover:text-primary-600 hover:!cursor-pointer
                    ${
                    location.pathname === '/profile' ? 'text-primary-600' : 'text-gray-700'
                  }`}
                >
                  My Profile
                </Link>
                
                <Button variant="outline" onClick={logout} className='hover:!cursor-pointer'>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className='hover:!cursor-pointer'>Sign In</Button>
                </Link>
                
                <Link to="/register">
                  <Button variant="primary" className='!text-black hover:!cursor-pointer'>Sign Up</Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              to="/jobs"
              className="block py-2 font-medium hover:text-primary-600"
            >
              Browse Jobs
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="block py-2 font-medium hover:text-primary-600"
                >
                  My Profile
                </Link>
                
                <button
                  onClick={logout}
                  className="block w-full py-2 font-medium text-left hover:text-primary-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-3 pt-2">
                <Link to="/login">
                  <Button variant="outline" fullWidth>Sign In</Button>
                </Link>
                
                <Link to="/register">
                  <Button variant="primary" fullWidth>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;