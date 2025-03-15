import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/modules/auth/components/AuthProvider';
import { FiMenu, FiX, FiBell, FiLogOut } from 'react-icons/fi';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user || location.pathname === '/login') {
    return null;
  }

  return (
    <nav className="bg-indigo-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-white"
            >
              {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            <Link to="/" className="ml-4 font-bold text-xl">Staff Portal</Link>
          </div>
          
          <div className="flex items-center">
            <button className="p-2 mr-2 rounded-full hover:bg-indigo-600 focus:outline-none">
              <FiBell size={20} />
            </button>
            
            <div className="ml-3 relative">
              <div className="flex items-center">
                <span className="hidden md:block mr-3">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-md hover:bg-indigo-600 focus:outline-none flex items-center"
                >
                  <FiLogOut size={20} />
                  <span className="ml-1 hidden md:inline">Sign out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;