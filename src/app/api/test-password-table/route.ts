import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/utils/supabase/server'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    
    // Test if we can access the profiles table and specifically the oauth_password_data column
    const { data, error } = await supabase
      .from('profiles')
      .select('id, oauth_password_data')
      .limit(1)
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        tableExists: false
      })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Profiles table exists and is accessible',
      tableExists: true,
      rowCount: data?.length || 0
    })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      tableExists: false
    })
  }
}