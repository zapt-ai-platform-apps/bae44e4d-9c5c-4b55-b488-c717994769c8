import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiMessageCircle, 
  FiAlertTriangle, 
  FiBriefcase, 
  FiFileText,
  FiUser
} from 'react-icons/fi';

const navItems = [
  { path: '/', icon: <FiHome size={20} />, label: 'Dashboard' },
  { path: '/contact', icon: <FiMessageCircle size={20} />, label: 'Contact Us' },
  { path: '/accident-reports', icon: <FiAlertTriangle size={20} />, label: 'Accident Reports' },
  { path: '/bus-movements', icon: <FiBriefcase size={20} />, label: 'Bus Movements' },
  { path: '/mids-reports', icon: <FiFileText size={20} />, label: 'MIDS Reports' },
  { path: '/profile', icon: <FiUser size={20} />, label: 'Profile' }
];

const Sidebar = ({ isOpen }) => {
  return (
    <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:h-full`}>
      <div className="h-16 flex items-center justify-center border-b border-gray-800">
        <img 
          src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=32&height=32"
          alt="Logo"
          className="h-8 w-8 mr-2"
        />
        <span className="text-xl font-semibold">Staff Portal</span>
      </div>
      
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-indigo-700 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
        <a 
          href="https://www.zapt.ai" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-gray-400 hover:text-white flex items-center justify-center"
        >
          Made on ZAPT
        </a>
      </div>
    </div>
  );
};

export default Sidebar;