import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '@/modules/auth/components/AuthProvider';
import * as Sentry from '@sentry/browser';
import { format } from 'date-fns';

const AccidentReportForm = () => {
  const { user, session } = useAuthContext();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const onSubmit = async (data) => {
    try {
      setStatus({ loading: true, success: false, error: null });
      console.log('Submitting accident report:', data);

      const response = await fetch('/api/accidents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit accident report');
      }

      console.log('Accident report submitted successfully:', result);
      setStatus({ loading: false, success: true, error: null });
      reset();
      
      // Reset success state after 5 seconds
      setTimeout(() => {
        setStatus(prev => ({ ...prev, success: false }));
      }, 5000);
    } catch (error) {
      console.error('Error submitting accident report:', error);
      Sentry.captureException(error);
      setStatus({ loading: false, success: false, error: error.message });
    }
  };

  // Set max date to today
  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Accident Report Form</h2>
      
      {status.success && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
          Your accident report has been submitted successfully!
        </div>
      )}
      
      {status.error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          Error: {status.error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="incidentDate" className="block text-gray-700 font-medium mb-2">
              Incident Date & Time*
            </label>
            <input
              id="incidentDate"
              type="datetime-local"
              max={`${today}T23:59`}
              className={`w-full px-4 py-2 border rounded-md box-border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.incidentDate ? 'border-red-500' : 'border-gray-300'}`}
              {...register('incidentDate', { required: 'Incident date is required' })}
            />
            {errors.incidentDate && (
              <p className="mt-1 text-red-500 text-sm">{errors.incidentDate.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
              Location*
            </label>
            <input
              id="location"
              type="text"
              className={`w-full px-4 py-2 border rounded-md box-border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Where did the incident occur?"
              {...register('location', { required: 'Location is required' })}
            />
            {errors.location && (
              <p className="mt-1 text-red-500 text-sm">{errors.location.message}</p>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
            Incident Description*
          </label>
          <textarea
            id="description"
            rows="4"
            className={`w-full px-4 py-2 border rounded-md box-border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Describe what happened in detail..."
            {...register('description', { 
              required: 'Description is required',
              minLength: { value: 20, message: 'Description must be at least 20 characters' }
            })}
          ></textarea>
          {errors.description && (
            <p className="mt-1 text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="involvedParties" className="block text-gray-700 font-medium mb-2">
            Involved Parties*
          </label>
          <textarea
            id="involvedParties"
            rows="3"
            className={`w-full px-4 py-2 border rounded-md box-border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.involvedParties ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="List all people and vehicles involved..."
            {...register('involvedParties', { required: 'Involved parties information is required' })}
          ></textarea>
          {errors.involvedParties && (
            <p className="mt-1 text-red-500 text-sm">{errors.involvedParties.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-center">
            <input
              id="injuries"
              type="checkbox"
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              {...register('injuries')}
            />
            <label htmlFor="injuries" className="ml-2 block text-gray-700">
              Were there any injuries?
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="propertyDamage"
              type="checkbox"
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              {...register('propertyDamage')}
            />
            <label htmlFor="propertyDamage" className="ml-2 block text-gray-700">
              Was there property damage?
            </label>
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="witnessInfo" className="block text-gray-700 font-medium mb-2">
            Witness Information (if any)
          </label>
          <textarea
            id="witnessInfo"
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-md box-border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Names and contact information of any witnesses..."
            {...register('witnessInfo')}
          ></textarea>
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
          ) : 'Submit Accident Report'}
        </button>
      </form>
    </div>
  );
};

export default AccidentReportForm;