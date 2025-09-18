import { NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, rating } = await request.json();

    // Create a Supabase client with the user's cookies
    const supabase = createServerSupabaseClient();

    // Get user session (may be null for unauthenticated users)
    const { data: { user } } = await supabase.auth.getUser();

    // Insert feedback into database
    const { data, error } = await supabase
      .from('feedback_messages')
      .insert([
        {
          user_id: user?.id || null, // Allow null for unauthenticated users
          name,
          email,
          message,
          rating
        }
      ])
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ data }), { status: 201 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: 'Failed to submit feedback' }), { status: 500 });
  }
}