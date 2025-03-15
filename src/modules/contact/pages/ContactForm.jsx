import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../auth/hooks/useAuth';
import * as Sentry from '@sentry/browser';

export default function ContactForm() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError('');
    
    try {
      console.log('Submitting contact form:', data);
      
      const { data: sessionData } = await supabase.auth.getSession();
      
      const response = await fetch('/api/contact', {
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
        throw new Error(errorData.error || 'Failed to submit contact form');
      }
      
      setSubmitSuccess(true);
      reset();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      Sentry.captureException(error);
      setSubmitError(error.message || 'An error occurred while submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Contact Form</h1>
      
      {submitSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          Your message has been sent successfully!
        </div>
      )}
      
      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {submitError}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="card">
        <div className="form-group">
          <label htmlFor="department" className="label">Department</label>
          <select 
            id="department"
            className="select"
            {...register('department', { required: 'Department is required' })}
          >
            <option value="">Select Department</option>
            <option value="Management">Management</option>
            <option value="Operations">Operations</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Safety">Safety & Compliance</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          {errors.department && <p className="error-message">{errors.department.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="priority" className="label">Priority</label>
          <select 
            id="priority"
            className="select"
            {...register('priority', { required: 'Priority is required' })}
          >
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
          {errors.priority && <p className="error-message">{errors.priority.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="subject" className="label">Subject</label>
          <input
            type="text"
            id="subject"
            className="input"
            {...register('subject', { 
              required: 'Subject is required',
              maxLength: { value: 100, message: 'Subject cannot exceed 100 characters' }
            })}
          />
          {errors.subject && <p className="error-message">{errors.subject.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="message" className="label">Message</label>
          <textarea
            id="message"
            rows="5"
            className="textarea"
            {...register('message', { 
              required: 'Message is required',
              minLength: { value: 10, message: 'Message must be at least 10 characters' }
            })}
          ></textarea>
          {errors.message && <p className="error-message">{errors.message.message}</p>}
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
                Sending...
              </span>
            ) : 'Send Message'}
          </button>
        </div>
      </form>
    </div>
  );
}