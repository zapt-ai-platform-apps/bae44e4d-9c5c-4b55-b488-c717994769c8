import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';
import { useAuthContext } from '@/modules/auth/components/AuthProvider';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuthContext();
  const location = useLocation();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // If at login screen and no user, show children without layout
  if (!user && location.pathname === '/login') {
    return (
      <div className="min-h-screen bg-gray-100">{children}</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex flex-1 h-full">
        <Sidebar isOpen={isSidebarOpen} />
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div 
            className="max-w-7xl mx-auto" 
            onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;