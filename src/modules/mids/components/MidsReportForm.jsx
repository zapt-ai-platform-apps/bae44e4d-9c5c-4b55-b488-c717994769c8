import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '@/modules/auth/components/AuthProvider';
import * as Sentry from '@sentry/browser';

const MidsReportForm = () => {
  const { user, session } = useAuthContext();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const onSubmit = async (data) => {
    try {
      setStatus({ loading: true, success: false, error: null });
      console.log('Submitting MIDS report:', data);

      const response = await fetch('/api/mids-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit MIDS report');
      }

      console.log('MIDS report submitted successfully:', result);
      setStatus({ loading: false, success: true, error: null });
      reset();
      
      // Reset success state after 5 seconds
      setTimeout(() => {
        setStatus(prev => ({ ...prev, success: false }));
      }, 5000);
    } catch (error) {
      console.error('Error submitting MIDS report:', error);
      Sentry.captureException(error);
      setStatus({ loading: false, success: false, error: error.message });
    }
  };

  const reportTypes = [
    'Incident Report',
    'Hazard Identification',
    'Near Miss Report',
    'Safety Concern',
    'Equipment Failure',
    'Other'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">MIDS Report Form</h2>
      
      {status.success && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
          Your MIDS report has been submitted successfully!
        </div>
      )}
      
      {status.error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          Error: {status.error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="reportType" className="block text-gray-700 font-medium mb-2">
            Report Type*
          </label>
          <select
            id="reportType"
            className={`w-full px-4 py-2 border rounded-md box-border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.reportType ? 'border-red-500' : 'border-gray-300'}`}
            {...register('reportType', { required: 'Report type is required' })}
          >
            <option value="">Select report type</option>
            {reportTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.reportType && (
            <p className="mt-1 text-red-500 text-sm">{errors.reportType.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
            Title*
          </label>
          <input
            id="title"
            type="text"
            className={`w-full px-4 py-2 border rounded-md box-border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Brief title for this report"
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && (
            <p className="mt-1 text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
            Description*
          </label>
          <textarea
            id="description"
            rows="5"
            className={`w-full px-4 py-2 border rounded-md box-border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Provide detailed information about the report..."
            {...register('description', { 
              required: 'Description is required',
              minLength: { value: 20, message: 'Description must be at least 20 characters' }
            })}
          ></textarea>
          {errors.description && (
            <p className="mt-1 text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={status.loading}
          className={`w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors cursor-pointer ${status.loading ? 'opacity-70 cursor-wait' : ''}`}
        >
          {status.loading ? (
            <span className="flex justify-center items-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : 'Submit MIDS Report'}
        </button>
      </form>
    </div>
  );
};

export default MidsReportForm;