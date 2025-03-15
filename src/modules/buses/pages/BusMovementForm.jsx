import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../auth/hooks/useAuth';
import { supabase } from '../../../supabaseClient';
import * as Sentry from '@sentry/browser';

export default function BusMovementForm() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      status: 'scheduled'
    }
  });
  
  const status = watch('status');
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError('');
    
    try {
      console.log('Submitting bus movement data:', data);
      
      // Parse datetime strings to ISO format
      const departureTime = new Date(data.departureDate + 'T' + data.departureTime).toISOString();
      
      let arrivalTime = null;
      if (data.status === 'completed' && data.arrivalDate && data.arrivalTime) {
        arrivalTime = new Date(data.arrivalDate + 'T' + data.arrivalTime).toISOString();
      }
      
      const { data: sessionData } = await supabase.auth.getSession();
      
      const response = await fetch('/api/bus-movement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData.session.access_token}`
        },
        body: JSON.stringify({
          busNumber: data.busNumber,
          driverName: data.driverName,
          departureLocation: data.departureLocation,
          arrivalLocation: data.arrivalLocation,
          departureTime,
          arrivalTime,
          status: data.status,
          passengerCount: data.passengerCount ? parseInt(data.passengerCount) : null,
          notes: data.notes,
          staffId: user.id
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit bus movement data');
      }
      
      setSubmitSuccess(true);
      reset();
    } catch (error) {
      console.error('Error submitting bus movement data:', error);
      Sentry.captureException(error);
      setSubmitError(error.message || 'An error occurred while submitting your data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Bus Movement Form</h1>
      
      {submitSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          Bus movement data has been submitted successfully!
        </div>
      )}
      
      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {submitError}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="form-group">
            <label htmlFor="busNumber" className="label">Bus Number/ID</label>
            <input
              type="text"
              id="busNumber"
              className="input"
              {...register('busNumber', { required: 'Bus number is required' })}
            />
            {errors.busNumber && <p className="error-message">{errors.busNumber.message}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="driverName" className="label">Driver's Name</label>
            <input
              type="text"
              id="driverName"
              className="input"
              {...register('driverName', { required: 'Driver name is required' })}
            />
            {errors.driverName && <p className="error-message">{errors.driverName.message}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="form-group">
            <label htmlFor="departureLocation" className="label">Departure Location</label>
            <input
              type="text"
              id="departureLocation"
              className="input"
              {...register('departureLocation', { required: 'Departure location is required' })}
            />
            {errors.departureLocation && <p className="error-message">{errors.departureLocation.message}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="arrivalLocation" className="label">Arrival Location</label>
            <input
              type="text"
              id="arrivalLocation"
              className="input"
              {...register('arrivalLocation', { required: 'Arrival location is required' })}
            />
            {errors.arrivalLocation && <p className="error-message">{errors.arrivalLocation.message}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="form-group">
            <label htmlFor="departureDate" className="label">Departure Date</label>
            <input
              type="date"
              id="departureDate"
              className="input"
              {...register('departureDate', { required: 'Departure date is required' })}
            />
            {errors.departureDate && <p className="error-message">{errors.departureDate.message}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="departureTime" className="label">Departure Time</label>
            <input
              type="time"
              id="departureTime"
              className="input"
              {...register('departureTime', { required: 'Departure time is required' })}
            />
            {errors.departureTime && <p className="error-message">{errors.departureTime.message}</p>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="status" className="label">Status</label>
          <select 
            id="status"
            className="select"
            {...register('status', { required: 'Status is required' })}
          >
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        {status === 'completed' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="form-group">
              <label htmlFor="arrivalDate" className="label">Arrival Date</label>
              <input
                type="date"
                id="arrivalDate"
                className="input"
                {...register('arrivalDate', { 
                  required: status === 'completed' ? 'Arrival date is required for completed trips' : false
                })}
              />
              {errors.arrivalDate && <p className="error-message">{errors.arrivalDate.message}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="arrivalTime" className="label">Arrival Time</label>
              <input
                type="time"
                id="arrivalTime"
                className="input"
                {...register('arrivalTime', { 
                  required: status === 'completed' ? 'Arrival time is required for completed trips' : false
                })}
              />
              {errors.arrivalTime && <p className="error-message">{errors.arrivalTime.message}</p>}
            </div>
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="passengerCount" className="label">Passenger Count</label>
          <input
            type="number"
            id="passengerCount"
            className="input"
            min="0"
            {...register('passengerCount')}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="notes" className="label">Notes</label>
          <textarea
            id="notes"
            rows="3"
            className="textarea"
            placeholder="Any additional information about this trip"
            {...register('notes')}
          ></textarea>
        </div>
        
        <div className="mt-6">
          <button 
            type="submit" 
            className="btn btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}