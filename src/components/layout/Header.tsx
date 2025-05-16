import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Briefcase as BriefcaseBusiness, User, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { useAuth } from '../../context/AuthContext';
import { cn } from '@/lib/utils';

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
      className={cn(
        "fixed top-0 left-0 right-0 z-30",
        "backdrop-blur-md transition-all duration-300",
        isScrolled ? "bg-white/90 shadow-sm" : "bg-transparent",
        "border-b border-gray-200",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 transition-transform hover:scale-105"
          >
            <BriefcaseBusiness size={28} className="text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              JobGenie
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/jobs"
              className={cn(
                "font-medium transition-all duration-200",
                "hover:text-primary hover:underline hover:underline-offset-4",
                location.pathname === '/jobs' ? 'text-primary' : 'text-gray-700'
              )}
            >
              Browse Jobs
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/resume/latex"
                  className={cn(
                    "font-medium transition-all duration-200",
                    "hover:text-primary hover:underline hover:underline-offset-4",
                    location.pathname === '/resume/latex' ? 'text-primary' : 'text-gray-700'
                  )}
                >
                  <div className="flex items-center space-x-2">
                    <FileText size={18} />
                    <span>LaTeX Resume</span>
                  </div>
                </Link>

                <Link
                  to="/profile"
                  className={cn(
                    "font-medium transition-all duration-200",
                    "hover:text-primary hover:underline hover:underline-offset-4",
                    location.pathname === '/profile' ? 'text-primary' : 'text-gray-700'
                  )}
                >
                  <div className="flex items-center space-x-2">
                    <User size={18} />
                    <span>My Profile</span>
                  </div>
                </Link>
                
                <Button
                  variant="outline"
                  onClick={logout}
                  className="hover:bg-destructive/10"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link to="/login">Sign In</Link>
                </Button>
                
                <Button asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[385px]">
              <SheetHeader>
                <SheetTitle>
                  <div className="flex items-center space-x-2">
                    <BriefcaseBusiness size={24} className="text-primary" />
                    <span className="text-xl font-bold">JobGenie</span>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-8">
                <Link
                  to="/jobs"
                  className={cn(
                    "text-lg font-medium py-2 transition-colors",
                    "hover:text-primary",
                    location.pathname === '/jobs' && "text-primary"
                  )}
                >
                  Browse Jobs
                </Link>
                
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/resume/latex"
                      className={cn(
                        "text-lg font-medium py-2 transition-colors",
                        "hover:text-primary",
                        location.pathname === '/resume/latex' && "text-primary"
                      )}
                    >
                      <div className="flex items-center space-x-2">
                        <FileText size={18} />
                        <span>LaTeX Resume</span>
                      </div>
                    </Link>

                    <Link
                      to="/profile"
                      className={cn(
                        "text-lg font-medium py-2 transition-colors",
                        "hover:text-primary",
                        location.pathname === '/profile' && "text-primary"
                      )}
                    >
                      <div className="flex items-center space-x-2">
                        <User size={18} />
                        <span>My Profile</span>
                      </div>
                    </Link>
                    
                    <Button
                      variant="outline"
                      onClick={logout}
                      className="w-full mt-4"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-3 mt-4">
                    <Button asChild variant="outline">
                      <Link to="/login" className="w-full">Sign In</Link>
                    </Button>
                    <Button asChild>
                      <Link to="/register" className="w-full">Sign Up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;