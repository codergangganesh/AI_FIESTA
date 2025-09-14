'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: { message: string } }>;
  signUp: (email: string, password: string) => Promise<{ error?: { message: string } }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: { message: 'Not implemented' } }),
  signUp: async () => ({ error: { message: 'Not implemented' } }),
  signOut: async () => {},
  signInWithGoogle: async () => {},
  signInWithGithub: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Error getting user:', error);
          // Handle network errors specifically
          if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            console.error('Network connectivity issue detected. Please check your internet connection and Supabase configuration.');
          }
        }
        setUser(user);
      } catch (error: any) {
        console.error('Unexpected error getting user:', error);
        // Handle network errors specifically
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          console.error('Network connectivity issue detected. Please check your internet connection and Supabase configuration.');
        }
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
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}