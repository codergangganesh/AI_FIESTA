import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/utils/supabase/server'

export async function DELETE(request: Request) {
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

    const userId = user.id
    const userEmail = user.email

    // Delete all user-related data from custom tables first
    // Delete from user_plans table
    const { error: userPlansError } = await supabaseAdmin
      .from('user_plans')
      .delete()
      .eq('user_id', userId)
    
    if (userPlansError) {
      console.error('Error deleting user plans data:', userPlansError.message)
    }

    // Delete from payments table
    const { error: paymentsError } = await supabaseAdmin
      .from('payments')
      .delete()
      .eq('user_id', userId)
    
    if (paymentsError) {
      console.error('Error deleting payments data:', paymentsError.message)
    }

    // Delete from model_comparisons table
    const { error: modelComparisonsError } = await supabaseAdmin
      .from('model_comparisons')
      .delete()
      .eq('user_id', userId)
    
    if (modelComparisonsError) {
      console.error('Error deleting model comparisons data:', modelComparisonsError.message)
    }

    // Delete from hyperparameter_jobs table
    const { error: hyperparameterJobsError } = await supabaseAdmin
      .from('hyperparameter_jobs')
      .delete()
      .eq('user_id', userId)
    
    if (hyperparameterJobsError) {
      console.error('Error deleting hyperparameter jobs data:', hyperparameterJobsError.message)
    }

    // Delete from explainability_results table
    const { error: explainabilityResultsError } = await supabaseAdmin
      .from('explainability_results')
      .delete()
      .eq('user_id', userId)
    
    if (explainabilityResultsError) {
      console.error('Error deleting explainability results data:', explainabilityResultsError.message)
    }

    // Delete from dataset_analyses table
    const { error: datasetAnalysesError } = await supabaseAdmin
      .from('dataset_analyses')
      .delete()
      .eq('user_id', userId)
    
    if (datasetAnalysesError) {
      console.error('Error deleting dataset analyses data:', datasetAnalysesError.message)
    }

    // Delete from user_settings table
    const { error: userSettingsError } = await supabaseAdmin
      .from('user_settings')
      .delete()
      .eq('user_id', userId)
    
    if (userSettingsError) {
      console.error('Error deleting user settings data:', userSettingsError.message)
    }

    // Delete from notifications table
    const { error: notificationsError } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('user_id', userId)
    
    if (notificationsError) {
      console.error('Error deleting notifications data:', notificationsError.message)
    }

    // Delete from api_usage table
    const { error: apiUsageError } = await supabaseAdmin
      .from('api_usage')
      .delete()
      .eq('user_id', userId)
    
    if (apiUsageError) {
      console.error('Error deleting API usage data:', apiUsageError.message)
    }

    // Delete from billing_history table
    const { error: billingHistoryError } = await supabaseAdmin
      .from('billing_history')
      .delete()
      .eq('user_id', userId)
    
    if (billingHistoryError) {
      console.error('Error deleting billing history data:', billingHistoryError.message)
    }

    // Delete from feedback_messages table (from original schema)
    const { error: feedbackError } = await supabaseAdmin
      .from('feedback_messages')
      .delete()
      .eq('user_id', userId)
    
    if (feedbackError) {
      console.error('Error deleting feedback data:', feedbackError.message)
    }

    // Delete from conversations table (from original schema)
    const { error: conversationsError } = await supabaseAdmin
      .from('conversations')
      .delete()
      .eq('user_id', userId)
    
    if (conversationsError) {
      console.error('Error deleting conversations data:', conversationsError.message)
    }

    // Delete from profiles table (from original schema)
    const { error: profilesError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId)
    
    if (profilesError) {
      console.error('Error deleting profiles data:', profilesError.message)
    }

    // Delete the user using the admin API (this will delete auth data)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    
    if (deleteError) {
      console.error('Error deleting user:', deleteError.message)
      return NextResponse.json(
        { error: 'Failed to delete account: ' + deleteError.message },
        { status: 500 }
      )
    }

    // Return success response with message
    return NextResponse.json({ 
      success: true,
      message: 'Your account has been successfully deleted.'
    })
  } catch (error: any) {
    console.error('Unexpected error in delete account route:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred: ' + (error.message || error.toString()) },
      { status: 500 }
    )
  }
}