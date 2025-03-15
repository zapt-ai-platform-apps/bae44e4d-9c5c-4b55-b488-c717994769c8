import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../auth/hooks/useAuth';
import { supabase } from '../../../supabaseClient';
import * as Sentry from '@sentry/browser';

export default function AccidentReportForm() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  
  const injuries = watch('injuries', false);
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError('');
    
    try {
      console.log('Submitting accident report:', data);
      
      const { data: sessionData } = await supabase.auth.getSession();
      
      const response = await fetch('/api/accident-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData.session.access_token}`
        },
        body: JSON.stringify({
          ...data,
          staffId: user.id
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit accident report');
      }
      
      setSubmitSuccess(true);
      reset();
    } catch (error) {
      console.error('Error submitting accident report:', error);
      Sentry.captureException(error);
      setSubmitError(error.message || 'An error occurred while submitting your report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Accident Report Form</h1>
      
      {submitSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          Your accident report has been submitted successfully!
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
            <label htmlFor="date" className="label">Date of Accident</label>
            <input
              type="date"
              id="date"
              className="input"
              max={new Date().toISOString().split('T')[0]}
              {...register('date', { required: 'Date is required' })}
            />
            {errors.date && <p className="error-message">{errors.date.message}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="time" className="label">Time of Accident</label>
            <input
              type="time"
              id="time"
              className="input"
              {...register('time', { required: 'Time is required' })}
            />
            {errors.time && <p className="error-message">{errors.time.message}</p>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="location" className="label">Location of Accident</label>
          <input
            type="text"
            id="location"
            className="input"
            {...register('location', { required: 'Location is required' })}
          />
          {errors.location && <p className="error-message">{errors.location.message}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
        </div>
        
        <div className="form-group">
          <label htmlFor="description" className="label">Description of Accident</label>
          <textarea
            id="description"
            rows="4"
            className="textarea"
            {...register('description', { 
              required: 'Description is required',
              minLength: { value: 10, message: 'Description must be at least 10 characters' }
            })}
          ></textarea>
          {errors.description && <p className="error-message">{errors.description.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="vehiclesInvolved" className="label">Vehicles Involved</label>
          <input
            type="text"
            id="vehiclesInvolved"
            className="input"
            placeholder="e.g. Company bus, Toyota Camry, etc."
            {...register('vehiclesInvolved', { required: 'Vehicles involved is required' })}
          />
          {errors.vehiclesInvolved && <p className="error-message">{errors.vehiclesInvolved.message}</p>}
        </div>
        
        <div className="form-group">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="injuries"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              {...register('injuries')}
            />
            <label htmlFor="injuries" className="ml-2 block text-sm text-gray-900">
              Were there any injuries?
            </label>
          </div>
          
          {injuries && (
            <div className="mt-2">
              <label htmlFor="injuryDetails" className="label">Injury Details</label>
              <textarea
                id="injuryDetails"
                rows="3"
                className="textarea"
                {...register('injuryDetails', { 
                  required: injuries ? 'Injury details are required when injuries are reported' : false
                })}
              ></textarea>
              {errors.injuryDetails && <p className="error-message">{errors.injuryDetails.message}</p>}
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="witnesses" className="label">Witnesses (if any)</label>
          <textarea
            id="witnesses"
            rows="2"
            className="textarea"
            placeholder="Names and contact information of witnesses"
            {...register('witnesses')}
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
            ) : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
  );
}