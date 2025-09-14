import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if required environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error('NEXT_PUBLIC_SUPABASE_URL is not set')
      return NextResponse.json(
        { error: 'Server configuration error: Supabase URL not set' },
        { status: 500 }
      )
    }
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_SERVICE_ROLE_KEY is not set')
      return NextResponse.json(
        { error: 'Server configuration error: Service role key not set' },
        { status: 500 }
      )
    }

    // Create Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if the oauth_password_data column exists in the profiles table
    const { data, error } = await supabaseAdmin
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'profiles')
      .eq('column_name', 'oauth_password_data')

    if (error) {
      console.error('Error checking column existence:', error)
      return NextResponse.json(
        { error: 'Failed to check column existence: ' + error.message },
        { status: 500 }
      )
    }

    if (data && data.length > 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'oauth_password_data column exists in profiles table',
        exists: true
      })
    } else {
      return NextResponse.json({ 
        success: true, 
        message: 'oauth_password_data column does not exist in profiles table',
        exists: false
      })
    }
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred: ' + (error.message || error.toString()) },
      { status: 500 }
    )
  }
}