import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ContactForm from '../modules/contact/pages/ContactForm';
import { supabase } from '../supabaseClient';

// Mock the react-hook-form
vi.mock('react-hook-form', () => ({
  useForm: () => ({
    register: vi.fn(),
    handleSubmit: (fn) => fn,
    formState: { errors: {} },
    reset: vi.fn()
  })
}));

// Mock useAuth hook
vi.mock('../modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' }
  })
}));

// Mock supabase
vi.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { access_token: 'fake-token' } }
      })
    }
  }
}));

// Mock fetch
global.fetch = vi.fn();

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetch.mockReset();
  });

  it('renders the contact form correctly', () => {
    render(<ContactForm />);
    
    expect(screen.getByText('Contact Form')).toBeInTheDocument();
    expect(screen.getByLabelText('Department')).toBeInTheDocument();
    expect(screen.getByLabelText('Priority')).toBeInTheDocument();
    expect(screen.getByLabelText('Subject')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByText('Send Message')).toBeInTheDocument();
  });

  it('submits the form data correctly', async () => {
    // Mock successful response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, id: 1 })
    });

    render(<ContactForm />);
    
    // Trigger form submission with test data
    const formData = {
      department: 'Management',
      priority: 'High',
      subject: 'Test Subject',
      message: 'This is a test message'
    };
    
    // Submit form
    const submitButton = screen.getByText('Send Message');
    fireEvent.click(submitButton);
    
    // Expect that fetch was called with the right arguments
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer fake-token'
      },
      body: JSON.stringify({
        ...formData,
        staffId: 'test-user-id'
      })
    });
  });

  it('shows an error message on submission failure', async () => {
    // Mock failed response
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Submission failed' })
    });

    render(<ContactForm />);
    
    // Submit form
    const submitButton = screen.getByText('Send Message');
    fireEvent.click(submitButton);
    
    // Expect error message
    expect(await screen.findByText('Submission failed')).toBeInTheDocument();
  });
});