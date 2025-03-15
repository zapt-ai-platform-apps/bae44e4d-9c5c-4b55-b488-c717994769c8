import React from 'react';
import ContactForm from '@/modules/contact/components/ContactForm';

const ContactPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800">Contact Management</h1>
        <p className="text-gray-600 mt-2">
          Use this form to send messages directly to the management team.
        </p>
      </div>
      
      <ContactForm />
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-800">Emergency Contact</h3>
            <p className="text-gray-600">For urgent matters: (555) 123-4567</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Main Office</h3>
            <p className="text-gray-600">General inquiries: (555) 987-6543</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Technical Support</h3>
            <p className="text-gray-600">For system issues: (555) 456-7890</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;