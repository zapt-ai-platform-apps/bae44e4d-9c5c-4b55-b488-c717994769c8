import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { FaEnvelope, FaCarCrash, FaBus, FaClipboardList, FaHistory } from 'react-icons/fa';

export default function Dashboard() {
  const { user } = useAuth();
  
  const actions = [
    {
      id: 1,
      title: 'Contact Management',
      description: 'Send a message to management or other departments',
      icon: <FaEnvelope className="h-6 w-6" />,
      path: '/contact',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 2,
      title: 'Accident Report',
      description: 'File a report for an accident or incident',
      icon: <FaCarCrash className="h-6 w-6" />,
      path: '/accident-report',
      color: 'bg-red-100 text-red-600'
    },
    {
      id: 3,
      title: 'Bus Movement',
      description: 'Log bus departure, arrivals, and route information',
      icon: <FaBus className="h-6 w-6" />,
      path: '/bus-movement',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 4,
      title: 'MID Report',
      description: 'Submit a Minor Incident Detail report',
      icon: <FaClipboardList className="h-6 w-6" />,
      path: '/mid-report',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 5,
      title: 'View History',
      description: 'Access your submitted reports and messages',
      icon: <FaHistory className="h-6 w-6" />,
      path: '/reports',
      color: 'bg-gray-100 text-gray-600'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.email}</h1>
        <p className="text-gray-600 mt-2">What would you like to do today?</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action) => (
          <Link key={action.id} to={action.path} className="block">
            <div className="card hover:shadow-lg transition-shadow duration-200">
              <div className={`rounded-lg p-3 inline-block ${action.color} mb-4`}>
                {action.icon}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{action.title}</h2>
              <p className="text-gray-600">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}