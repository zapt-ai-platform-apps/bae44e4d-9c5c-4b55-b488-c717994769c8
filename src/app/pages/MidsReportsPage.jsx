import React from 'react';
import MidsReportForm from '@/modules/mids/components/MidsReportForm';

const MidsReportsPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800">MIDS Reports</h1>
        <p className="text-gray-600 mt-2">
          Submit various types of MIDS (Management Information and Decision Support) reports.
        </p>
      </div>
      
      <MidsReportForm />
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">MIDS Report Types</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-800">Incident Reports</h3>
            <p className="text-gray-600">Report minor incidents that don't qualify as accidents but should be documented.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Hazard Identification</h3>
            <p className="text-gray-600">Report potential hazards that could lead to accidents or incidents.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Near Miss Reports</h3>
            <p className="text-gray-600">Document situations where an accident was narrowly avoided.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Safety Concerns</h3>
            <p className="text-gray-600">Report any safety concerns related to equipment, procedures, or personnel.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Equipment Failure</h3>
            <p className="text-gray-600">Document any equipment malfunctions or failures.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MidsReportsPage;