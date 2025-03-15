import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../auth/hooks/useAuth';
import { supabase } from '../../../supabaseClient';
import * as Sentry from '@sentry/browser';

export default function MidReportForm() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  
  const followUpRequired = watch('followUpRequired', false);
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError('');
    
    try {
      console.log('Submitting MID report:', data);
      
      const { data: sessionData } = await supabase.auth.getSession();
      
      const response = await fetch('/api/mid-report', {
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
        throw new Error(errorData.error || 'Failed to submit MID report');
      }
      
      setSubmitSuccess(true);
      reset();
    } catch (error) {
      console.error('Error submitting MID report:', error);
      Sentry.captureException(error);
      setSubmitError(error.message || 'An error occurred while submitting your report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">MID Report Form</h1>
      
      {submitSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          Your MID report has been submitted successfully!
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
            <label htmlFor="midNumber" className="label">MID Number</label>
            <input
              type="text"
              id="midNumber"
              className="input"
              placeholder="e.g. MID-2023-001"
              {...register('midNumber', { required: 'MID number is required' })}
            />
            {errors.midNumber && <p className="error-message">{errors.midNumber.message}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="date" className="label">Date of Incident</label>
            <input
              type="date"
              id="date"
              className="input"
              max={new Date().toISOString().split('T')[0]}
              {...register('date', { required: 'Date is required' })}
            />
            {errors.date && <p className="error-message">{errors.date.message}</p>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="incidentType" className="label">Type of Incident</label>
          <select 
            id="incidentType"
            className="select"
            {...register('incidentType', { required: 'Incident type is required' })}
          >
            <option value="">Select Incident Type</option>
            <option value="Near Miss">Near Miss</option>
            <option value="Passenger Complaint">Passenger Complaint</option>
            <option value="Vehicle Issue">Vehicle Issue</option>
            <option value="Staff Issue">Staff Issue</option>
            <option value="Security Incident">Security Incident</option>
            <option value="Other">Other</option>
          </select>
          {errors.incidentType && <p className="error-message">{errors.incidentType.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="location" className="label">Location</label>
          <input
            type="text"
            id="location"
            className="input"
            {...register('location', { required: 'Location is required' })}
          />
          {errors.location && <p className="error-message">{errors.location.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description" className="label">Description of Incident</label>
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
          <label htmlFor="peopleInvolved" className="label">People Involved</label>
          <textarea
            id="peopleInvolved"
            rows="2"
            className="textarea"
            placeholder="Names and roles of people involved (if applicable)"
            {...register('peopleInvolved')}
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="actionsTaken" className="label">Actions Taken</label>
          <textarea
            id="actionsTaken"
            rows="3"
            className="textarea"
            placeholder="Describe what actions were taken to address the incident"
            {...register('actionsTaken', { required: 'Actions taken is required' })}
          ></textarea>
          {errors.actionsTaken && <p className="error-message">{errors.actionsTaken.message}</p>}
        </div>
        
        <div className="form-group">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="followUpRequired"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              {...register('followUpRequired')}
            />
            <label htmlFor="followUpRequired" className="ml-2 block text-sm text-gray-900">
              Follow-up Required?
            </label>
          </div>
          
          {followUpRequired && (
            <div className="mt-2">
              <label htmlFor="followUpDetails" className="label">Follow-up Details</label>
              <textarea
                id="followUpDetails"
                rows="3"
                className="textarea"
                placeholder="Describe what follow-up actions are needed"
                {...register('followUpDetails', { 
                  required: followUpRequired ? 'Follow-up details are required when follow-up is needed' : false
                })}
              ></textarea>
              {errors.followUpDetails && <p className="error-message">{errors.followUpDetails.message}</p>}
            </div>
          )}
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