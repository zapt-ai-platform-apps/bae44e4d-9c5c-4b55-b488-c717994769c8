import React from 'react';
import { useAuthContext } from '@/modules/auth/components/AuthProvider';

const ProfileForm = () => {
  const { user, signOut } = useAuthContext();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h2>
      
      <div className="mb-6">
        <div className="flex flex-col space-y-4">
          <div>
            <span className="block text-sm font-medium text-gray-500">Email</span>
            <span className="block text-lg font-medium text-gray-800">{user.email}</span>
          </div>
          
          <div>
            <span className="block text-sm font-medium text-gray-500">User ID</span>
            <span className="block text-lg font-medium text-gray-800">{user.id}</span>
          </div>
          
          <div>
            <span className="block text-sm font-medium text-gray-500">Last Sign In</span>
            <span className="block text-lg font-medium text-gray-800">
              {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <button
          onClick={signOut}
          className="py-2 px-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfileForm;