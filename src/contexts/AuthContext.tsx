'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import DeleteAccountSuccessDialog from '@/components/auth/DeleteAccountSuccessDialog';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: { message: string } }>;
  signUp: (email: string, password: string) => Promise<{ error?: { message: string } }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  deleteAccount: (password: string) => Promise<{ error?: { message: string } }>;
  showDeleteSuccess: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: { message: 'Not implemented' } }),
  signUp: async () => ({ error: { message: 'Not implemented' } }),
  signOut: async () => {},
  signInWithGoogle: async () => {},
  signInWithGithub: async () => {},
  deleteAccount: async () => ({ error: { message: 'Not implemented' } }),
  showDeleteSuccess: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const supabase = createClient();

  // Define deleteAccount inside AuthProvider to have access to supabase client
  const deleteAccount = async (password: string) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (!user) {
        if (userError) {
          console.error('Error getting user:', userError);
        }
        return { error: new Error('User not authenticated') };
      }

      // First, delete all user data from the database
      const { error: deleteDataError } = await supabase
        .from('conversations')
        .delete()
        .eq('user_id', user.id);

      if (deleteDataError) {
        console.error('Error deleting user data:', deleteDataError);
        return { error: deleteDataError };
      }

      // For password verification, we'll sign in first to verify the password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password,
      });

      if (signInError) {
        console.error('Password verification failed:', signInError);
        return { error: new Error('Incorrect password') };
      }

      // First delete the password data from oauth_user_passwords table
      const { error: deletePasswordError } = await supabase
        .from('oauth_user_passwords')
        .delete()
        .eq('user_id', user.id);

      if (deletePasswordError) {
        console.error('Error deleting password data:', deletePasswordError);
        return { error: deletePasswordError };
      }

      // Now update the profiles table to mark as deleted
      // First try updating the deleted_at field
      const { error: updateDeletedAtError } = await supabase
        .from('profiles')
        .update({
          deleted_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateDeletedAtError) {
        console.error('Error updating deleted_at field:', updateDeletedAtError);
        return { error: updateDeletedAtError };
      }

      // Then update the email to avoid conflicts
      const { error: updateEmailError } = await supabase
        .from('profiles')
        .update({
          email: `${user.email}_deleted_${Date.now()}`
        })
        .eq('id', user.id);

      if (updateEmailError) {
        console.error('Error updating email:', updateEmailError);
        return { error: updateEmailError };
      }

      // Sign out the user
      await signOut();
      
      // Show success popup
      setShowDeleteSuccess(true);
      
      // Hide success popup and redirect after 3 seconds
      setTimeout(() => {
        setShowDeleteSuccess(false);
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }, 3000);
      
      return {};
    } catch (error) {
      console.error('Unexpected error during account deletion:', error);
      return { error: error instanceof Error ? error : new Error('Unknown error') };
    }
  };

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          // Handle AuthSessionMissingError specifically
          if (error.message.includes('Auth session missing')) {
            console.log('No active session found during initial load');
            setUser(null);
          } else {
            console.error('Error getting user:', error);
            // Handle network errors specifically
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
              console.error('Network connectivity issue detected. Please check your internet connection and Supabase configuration.');
            }
          }
        } else {
          setUser(user);
        }
      } catch (error: any) {
        console.error('Unexpected error getting user:', error);
        // Handle network errors specifically
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          console.error('Network connectivity issue detected. Please check your internet connection and Supabase configuration.');
        }
        // Set user to null in case of any error
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log('Auth state changed:', _event, session?.user?.email);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { error };
      }
      
      // Refresh user state
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      return {};
    } catch (error) {
      return { error: { message: 'An unexpected error occurred during sign in' } };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        return { error };
      }
      
      // For sign up, we don't automatically set the user state
      // The user needs to verify their email and then sign in
      // We'll return success but the user will remain null until they sign in
      return {};
    } catch (error) {
      return { error: { message: 'An unexpected error occurred during sign up' } };
    }
  };

  const signOut = async () => {
    try {
      // First check if there's a user/session before attempting to sign out
      const { data: { user }, error: getUserError } = await supabase.auth.getUser();
      
      // Only attempt to sign out if there's an active user and no error getting user
      if (user && !getUserError) {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          console.error('Supabase sign out error:', signOutError);
        }
      } else if (getUserError && !getUserError.message.includes('Auth session missing')) {
        // Log unexpected errors but ignore AuthSessionMissingError
        console.error('Error getting user for sign out:', getUserError);
      }
      
      // Always clear the user state regardless of Supabase response
      setUser(null);
      
      // Clear chat sessions from localStorage
      localStorage.removeItem('aiFiestaChatSessions');
    } catch (error: any) {
      console.error('Unexpected error during sign out:', error);
      
      // Specifically handle AuthSessionMissingError
      if (error?.message?.includes('Auth session missing')) {
        console.log('No active session found, proceeding with local logout');
      }
      
      // Even if there's an error, clear the user state
      setUser(null);
      
      // Clear chat sessions from localStorage
      localStorage.removeItem('aiFiestaChatSessions');
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Initiating Google sign in...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        console.error('Google sign-in error:', error);
        throw error;
      }
      
      console.log('Google sign-in data:', data);
      
      // The browser will be redirected to Google OAuth page
      // After authentication, Google will redirect back to the callback URL
      if (data?.url) {
        console.log('Redirecting to Google OAuth page...');
        window.location.href = data.url;
      } else {
        throw new Error('No redirect URL provided by Supabase');
      }
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      throw error;
    }
  };

  const signInWithGithub = async () => {
    try {
      console.log('Initiating GitHub sign in...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        console.error('GitHub sign-in error:', error);
        throw error;
      }
      
      console.log('GitHub sign-in data:', data);
      
      // The browser will be redirected to GitHub OAuth page
      // After authentication, GitHub will redirect back to the callback URL
      if (data?.url) {
        console.log('Redirecting to GitHub OAuth page...');
        window.location.href = data.url;
      } else {
        throw new Error('No redirect URL provided by Supabase');
      }
    } catch (error) {
      console.error('Error during GitHub sign-in:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithGithub,
    deleteAccount,
    showDeleteSuccess,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {showDeleteSuccess && <DeleteAccountSuccessDialog isOpen={showDeleteSuccess} />}
    </AuthContext.Provider>
  );
}
