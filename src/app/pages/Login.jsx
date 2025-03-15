import React from 'react';
import AuthForm from '@/modules/auth/components/AuthForm';

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <img 
            src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=128&height=128"
            alt="Staff Portal Logo"
            className="mx-auto h-16 w-16 mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-900">Staff Portal</h1>
          <p className="text-gray-600 mt-2">Sign in to access your staff portal</p>
        </div>
        
        <AuthForm />
      </div>
    </div>
  );
};

export default Login;