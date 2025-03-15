import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { supabase } from '../../../supabaseClient';
import * as Sentry from '@sentry/browser';
import { format } from 'date-fns';

export default function ReportsHistory() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('contact');
  const [reports, setReports] = useState({
    contact: [],
    accidents: [],
    busMovements: [],
    mids: []
  });
  
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError('');
      
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session.access_token;
        
        const endpoints = {
          contact: '/api/reports/contact',
          accidents: '/api/reports/accidents',
          busMovements: '/api/reports/bus-movements',
          mids: '/api/reports/mids'
        };
        
        const results = {};
        
        for (const [key, endpoint] of Object.entries(endpoints)) {
          const response = await fetch(endpoint, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            throw new Error(`Failed to fetch ${key} reports`);
          }
          
          const data = await response.json();
          results[key] = data;
        }
        
        setReports(results);
      } catch (error) {
        console.error('Error fetching reports:', error);
        Sentry.captureException(error);
        setError('Failed to load reports. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReports();
  }, [user.id]);
  
  const renderContactTable = () => {
    if (reports.contact.length === 0) {
      return <p className="text-gray-500 italic">No contact messages found.</p>;
    }
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.contact.map((message) => (
              <tr key={message.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(message.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{message.subject}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{message.department}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${message.priority === 'Urgent' ? 'bg-red-100 text-red-800' : 
                    message.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                    message.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'}`}>
                    {message.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  const renderAccidentsTable = () => {
    if (reports.accidents.length === 0) {
      return <p className="text-gray-500 italic">No accident reports found.</p>;
    }
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Injuries</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.accidents.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(report.date), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.time}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{report.location}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{report.driverName}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{report.busNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${report.injuries ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {report.injuries ? 'Yes' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  const renderBusMovementsTable = () => {
    if (reports.busMovements.length === 0) {
      return <p className="text-gray-500 italic">No bus movement records found.</p>;
    }
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.busMovements.map((movement) => (
              <tr key={movement.id}>
                <td className="px-6 py-4 text-sm text-gray-900">{movement.busNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{movement.driverName}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{movement.departureLocation}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{movement.arrivalLocation}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(movement.departureTime), 'MMM d, yyyy h:mm a')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${movement.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    movement.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    movement.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'}`}>
                    {movement.status.replace('_', ' ').charAt(0).toUpperCase() + movement.status.replace('_', ' ').slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  const renderMidsTable = () => {
    if (reports.mids.length === 0) {
      return <p className="text-gray-500 italic">No MID reports found.</p>;
    }
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MID #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Follow Up</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.mids.map((mid) => (
              <tr key={mid.id}>
                <td className="px-6 py-4 text-sm text-gray-900">{mid.midNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(mid.date), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{mid.incidentType}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{mid.location}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${mid.followUpRequired ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {mid.followUpRequired ? 'Required' : 'None'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      );
    }
    
    switch (activeTab) {
      case 'contact':
        return renderContactTable();
      case 'accidents':
        return renderAccidentsTable();
      case 'busMovements':
        return renderBusMovementsTable();
      case 'mids':
        return renderMidsTable();
      default:
        return null;
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports History</h1>
      
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('contact')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'contact'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Contact Messages
          </button>
          <button
            onClick={() => setActiveTab('accidents')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'accidents'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Accident Reports
          </button>
          <button
            onClick={() => setActiveTab('busMovements')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'busMovements'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Bus Movements
          </button>
          <button
            onClick={() => setActiveTab('mids')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'mids'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            MID Reports
          </button>
        </nav>
      </div>
      
      <div className="card">
        {renderContent()}
      </div>
    </div>
  );
}