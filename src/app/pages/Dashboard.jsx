import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '@/modules/auth/components/AuthProvider';
import { FiMessageCircle, FiAlertTriangle, FiBriefcase, FiFileText } from 'react-icons/fi';

const DashboardCard = ({ icon, title, description, linkTo }) => (
  <Link 
    to={linkTo}
    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col h-full"
  >
    <div className="flex items-center mb-4">
      <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
        {icon}
      </div>
      <h3 className="text-xl font-semibold ml-3 text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600 flex-grow">{description}</p>
    <span className="mt-4 text-indigo-600 font-medium">Access Now →</span>
  </Link>
);

const Dashboard = () => {
  const { user } = useAuthContext();
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.email}</h1>
        <p className="text-gray-600 mt-2">
          Access all staff tools and resources from your dashboard.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        <DashboardCard
          icon={<FiMessageCircle size={24} />}
          title="Contact Management"
          description="Send messages to the management team for any inquiries or issues."
          linkTo="/contact"
        />
        
        <DashboardCard
          icon={<FiAlertTriangle size={24} />}
          title="Accident Reports"
          description="Report incidents and accidents that occur during operations."
          linkTo="/accident-reports"
        />
        
        <DashboardCard
          icon={<FiBriefcase size={24} />}
          title="Bus Movements"
          description="Record and track bus movement information including schedules."
          linkTo="/bus-movements"
        />
        
        <DashboardCard
          icon={<FiFileText size={24} />}
          title="MIDS Reports"
          description="Submit various types of MIDS reports for operational purposes."
          linkTo="/mids-reports"
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Notifications</h2>
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <p className="text-gray-600 text-center">No new notifications at this time.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;