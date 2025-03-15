import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '@/modules/auth/components/AuthProvider';
import * as Sentry from '@sentry/browser';
import { format } from 'date-fns';

const BusMovementForm = () => {
  const { user, session } = useAuthContext();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const onSubmit = async (data) => {
    try {
      setStatus({ loading: true, success: false, error: null });
      console.log('Submitting bus movement information:', data);

      const response = await fetch('/api/bus-movements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit bus movement information');
      }

      console.log('Bus movement information submitted successfully:', result);
      setStatus({ loading: false, success: true, error: null });
      reset();
      
      // Reset success state after 5 seconds
      setTimeout(() => {
        setStatus(prev => ({ ...prev, success: false }));
      }, 5000);
    } catch (error) {
      console.error('Error submitting bus movement information:', error);
      Sentry.captureException(error);
      setStatus({ loading: false, success: false, error: error.message });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Bus Movement Information</h2>
      
      {status.success && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
          Bus movement information has been recorded successfully!
        </div>
      )}
      
      {status.error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          Error: {status.error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="busId" className="block text-gray-700 font-medium mb-2">
            Bus ID / Registration Number*
          </label>
          <input
            id="busId"
            type="text"
            className={`w-full px-4 py-2 border rounded-md box-border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.busId ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter bus ID or registration number"
            {...register('busId', { required: 'Bus ID is required' })}
          />
          {errors.busId && (
            <p className="mt-1 text-red-500 text-sm">{errors.busId.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label htmlFor="departureLocation" className="block text-gray-700 font-medium mb-2">
              Departure Location*
            </label>
            <input
              id="departureLocation"
              type="text"
              className={`w-full px-4 py-2 border rounded-md box-border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.departureLocation ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter departure location"
              {...register('departureLocation', { required: 'Departure location is required' })}
            />
            {errors.departureLocation && (
              <p className="mt-1 text-red-500 text-sm">{errors.departureLocation.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="departureTime" className="block text-gray-700 font-medium mb-2">
              Departure Time*
            </label>
            <input
              id="departureTime"
              type="datetime-local"
              className={`w-full px-4 py-2 border rounded-md box-border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.departureTime ? 'border-red-500' : 'border-gray-300'}`}
              {...register('departureTime', { required: 'Departure time is required' })}
            />
            {errors.departureTime && (
              <p className="mt-1 text-red-500 text-sm">{errors.departureTime.message}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label htmlFor="arrivalLocation" className="block text-gray-700 font-medium mb-2">
              Arrival Location*
            </label>
            <input
              id="arrivalLocation"
              type="text"
              className={`w-full px-4 py-2 border rounded-md box-border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.arrivalLocation ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter arrival location"
              {...register('arrivalLocation', { required: 'Arrival location is required' })}
            />
            {errors.arrivalLocation && (
              <p className="mt-1 text-red-500 text-sm">{errors.arrivalLocation.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="arrivalTime" className="block text-gray-700 font-medium mb-2">
              Arrival Time (if completed)
            </label>
            <input
              id="arrivalTime"
              type="datetime-local"
              className="w-full px-4 py-2 border border-gray-300 rounded-md box-border focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register('arrivalTime')}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="passengers" className="block text-gray-700 font-medium mb-2">
            Number of Passengers
          </label>
          <input
            id="passengers"
            type="number"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-md box-border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter number of passengers"
            {...register('passengers', { valueAsNumber: true })}
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="notes" className="block text-gray-700 font-medium mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-md box-border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Any additional information..."
            {...register('notes')}
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
          ) : 'Submit Bus Movement Information'}
        </button>
      </form>
    </div>
  );
};

export default BusMovementForm;