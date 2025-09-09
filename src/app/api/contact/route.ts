import { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, priority } = await request.json();
    const supabase = createClient();

    // Get user session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Insert contact message into database
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          user_id: user.id,
          name,
          email,
          subject,
          message,
          priority
        }
      ])
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ data }), { status: 201 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: 'Failed to send message' }), { status: 500 });
  }
}