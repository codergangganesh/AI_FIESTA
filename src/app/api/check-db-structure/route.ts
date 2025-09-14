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

    // Check if the profiles table exists and its structure
    const { data: tableData, error: tableError } = await supabaseAdmin
      .from('pg_tables')
      .select('*')
      .eq('tablename', 'profiles')

    if (tableError) {
      console.error('Error checking profiles table:', tableError)
      return NextResponse.json(
        { error: 'Failed to check profiles table: ' + tableError.message },
        { status: 500 }
      )
    }

    // Check columns in the profiles table
    const { data: columnData, error: columnError } = await supabaseAdmin
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'profiles')

    if (columnError) {
      console.error('Error checking profiles columns:', columnError)
      return NextResponse.json(
        { error: 'Failed to check profiles columns: ' + columnError.message },
        { status: 500 }
      )
    }

    // Check if the rpc function exists
    const { data: rpcData, error: rpcError } = await supabaseAdmin
      .from('pg_proc')
      .select('proname')
      .ilike('proname', '%execute%')

    return NextResponse.json({ 
      success: true, 
      message: 'Database structure check completed',
      tableExists: tableData.length > 0,
      columns: columnData,
      rpcFunctions: rpcData
    })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred: ' + (error.message || error.toString()) },
      { status: 500 }
    )
  }
}