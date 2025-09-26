"use client";

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import ModernAuthForm from '@/components/auth/ModernAuthForm';
import AuthIllustration from '@/components/auth/AuthIllustration';

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      if (data.session?.user) router.replace('/compare');
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) router.replace('/compare');
    });
    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-violet-950 to-black flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:block">
          <div className="rounded-3xl border border-violet-500/30 bg-black/30 p-8 backdrop-blur-xl">
            <AuthIllustration />
          </div>
        </div>
        <div>
          <div className="rounded-3xl border border-violet-500/30 bg-black/30 p-8 backdrop-blur-xl">
            <Suspense fallback={<div className="text-violet-200">Loading...</div>}>
              <ModernAuthForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}