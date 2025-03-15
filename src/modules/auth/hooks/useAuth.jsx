import { useContext } from 'react';
import { AuthContext } from '../AuthProvider';
import { supabase } from '../../../supabaseClient';
import * as Sentry from '@sentry/browser';

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      Sentry.captureException(error);
      throw error;
    }
  };
  
  return {
    ...context,
    signOut,
  };
}