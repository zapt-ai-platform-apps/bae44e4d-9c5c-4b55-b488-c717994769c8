import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '@/modules/auth/components/AuthProvider';
import * as Sentry from '@sentry/browser';

const ContactForm = () => {
  const { user, session } = useAuthContext();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const onSubmit = async (data) => {
    try {
      setStatus({ loading: true, success: false, error: null });
      console.log('Submitting contact form:', data);

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      console.log('Contact form submitted successfully:', result);
      setStatus({ loading: false, success: true, error: null });
      reset();
      
      // Reset success state after 5 seconds
      setTimeout(() => {
        setStatus(prev => ({ ...prev, success: false }));
      }, 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      Sentry.captureException(error);
      setStatus({ loading: false, success: false, error: error.message });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Management</h2>
      
      {status.success && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
          Your message has been sent successfully! We'll respond as soon as possible.
        </div>
      )}
      
      {status.error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          Error: {status.error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
            Subject
          </label>
          <input
            id="subject"
            type="text"
            className={`w-full px-4 py-2 border rounded-md box-border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter the subject of your message"
            {...register('subject', { required: 'Subject is required' })}
          />
          {errors.subject && (
            <p className="mt-1 text-red-500 text-sm">{errors.subject.message}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
            Message
          </label>
          <textarea
            id="message"
            rows="5"
            className={`w-full px-4 py-2 border rounded-md box-border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Type your message here..."
            {...register('message', { 
              required: 'Message is required',
              minLength: { value: 10, message: 'Message must be at least 10 characters' }
            })}
          ></textarea>
          {errors.message && (
            <p className="mt-1 text-red-500 text-sm">{errors.message.message}</p>
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
              Sending...
            </span>
          ) : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;