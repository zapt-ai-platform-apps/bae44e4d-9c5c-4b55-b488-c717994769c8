import React from 'react';
import BusMovementForm from '@/modules/bus/components/BusMovementForm';

const BusMovementsPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800">Bus Movement Information</h1>
        <p className="text-gray-600 mt-2">
          Use this form to record and track bus movement information including departure and arrival details.
        </p>
      </div>
      
      <BusMovementForm />
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Bus Movement Guidelines</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-800">Required Information</h3>
            <p className="text-gray-600">Make sure to include accurate bus identification, location details, and timestamps for all movements.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Reporting Schedule</h3>
            <p className="text-gray-600">Bus movement information should be recorded before departure and updated upon arrival.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Special Circumstances</h3>
            <p className="text-gray-600">For any route deviations or delays, add detailed notes explaining the situation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusMovementsPage;