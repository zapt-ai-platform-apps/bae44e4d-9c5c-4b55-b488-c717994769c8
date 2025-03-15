import React from 'react';
import AccidentReportForm from '@/modules/accident/components/AccidentReportForm';

const AccidentReportsPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800">Accident Reports</h1>
        <p className="text-gray-600 mt-2">
          Use this form to report any accidents or incidents that occur during operations.
        </p>
      </div>
      
      <AccidentReportForm />
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Important Information</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-800">When to Submit a Report</h3>
            <p className="text-gray-600">Submit an accident report as soon as possible after an incident occurs, ideally within 24 hours.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Required Documentation</h3>
            <p className="text-gray-600">If possible, take photos of the incident scene and any damage. Collect contact information from all involved parties.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Follow-up Process</h3>
            <p className="text-gray-600">After submission, management will review your report and may contact you for additional information.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccidentReportsPage;