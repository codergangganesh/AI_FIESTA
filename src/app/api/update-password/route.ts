import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const { newPassword } = await request.json()
    
    if (!newPassword) {
      return NextResponse.json(
        { error: 'New password is required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Create a Supabase client that can read the session from cookies
    const supabase = createServerSupabaseClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('No authenticated user found:', userError?.message || 'No user')
      return NextResponse.json(
        { error: 'Unauthorized: No valid session found' },
        { status: 401 }
      )
    }

    // Update password using Supabase auth
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    })
    
    if (updateError) {
      throw new Error(updateError.message)
    }
    
    // Return success response
    return NextResponse.json({ 
      success: true,
      message: 'Password updated successfully.'
    })
  } catch (error: any) {
    console.error('Unexpected error in update password route:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred: ' + (error.message || error.toString()) },
      { status: 500 }
    )
  }
}