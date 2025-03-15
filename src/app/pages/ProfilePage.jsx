import React from 'react';
import ProfileForm from '@/modules/user/components/ProfileForm';

const ProfilePage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
        <p className="text-gray-600 mt-2">
          View and manage your user profile and account information.
        </p>
      </div>
      
      <ProfileForm />
    </div>
  );
};

export default ProfilePage;