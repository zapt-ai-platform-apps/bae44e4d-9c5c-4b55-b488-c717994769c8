import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { FaBars, FaTimes, FaHome, FaEnvelope, FaCarCrash, FaBus, FaClipboardList, FaHistory } from 'react-icons/fa';

export default function Header() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigation will happen automatically due to auth state change
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-700 text-white' : 'text-white';
  };

  if (!user) {
    // Minimal header for non-authenticated users
    return (
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold tracking-tight">Staff Portal</Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="text-xl font-bold tracking-tight">Staff Portal</Link>
          
          {/* Mobile menu button */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden cursor-pointer focus:outline-none"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}>
              <span className="flex items-center gap-1"><FaHome /> Dashboard</span>
            </Link>
            <Link to="/contact" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/contact')}`}>
              <span className="flex items-center gap-1"><FaEnvelope /> Contact</span>
            </Link>
            <Link to="/accident-report" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/accident-report')}`}>
              <span className="flex items-center gap-1"><FaCarCrash /> Accident Report</span>
            </Link>
            <Link to="/bus-movement" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/bus-movement')}`}>
              <span className="flex items-center gap-1"><FaBus /> Bus Movement</span>
            </Link>
            <Link to="/mid-report" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/mid-report')}`}>
              <span className="flex items-center gap-1"><FaClipboardList /> MID Report</span>
            </Link>
            <Link to="/reports" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/reports')}`}>
              <span className="flex items-center gap-1"><FaHistory /> History</span>
            </Link>
            <button 
              onClick={handleSignOut} 
              className="ml-4 bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
            >
              Sign Out
            </button>
          </nav>
        </div>
      </div>
      
      {/* Mobile navigation menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-700 py-2">
          <div className="container mx-auto px-4">
            <nav className="flex flex-col gap-2">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
                onClick={() => setIsOpen(false)}
              >
                <span className="flex items-center gap-1"><FaHome /> Dashboard</span>
              </Link>
              <Link 
                to="/contact" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/contact')}`}
                onClick={() => setIsOpen(false)}
              >
                <span className="flex items-center gap-1"><FaEnvelope /> Contact</span>
              </Link>
              <Link 
                to="/accident-report" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/accident-report')}`}
                onClick={() => setIsOpen(false)}
              >
                <span className="flex items-center gap-1"><FaCarCrash /> Accident Report</span>
              </Link>
              <Link 
                to="/bus-movement" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/bus-movement')}`}
                onClick={() => setIsOpen(false)}
              >
                <span className="flex items-center gap-1"><FaBus /> Bus Movement</span>
              </Link>
              <Link 
                to="/mid-report" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/mid-report')}`}
                onClick={() => setIsOpen(false)}
              >
                <span className="flex items-center gap-1"><FaClipboardList /> MID Report</span>
              </Link>
              <Link 
                to="/reports" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/reports')}`}
                onClick={() => setIsOpen(false)}
              >
                <span className="flex items-center gap-1"><FaHistory /> History</span>
              </Link>
              <button 
                onClick={handleSignOut} 
                className="px-3 py-2 rounded-md text-sm font-medium text-white bg-red-500 mt-2 cursor-pointer"
              >
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}