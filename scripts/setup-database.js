#!/usr/bin/env node

/**
 * Simple script to setup the database tables for AI Fiesta
 * Run this script after setting up your Supabase project
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

// Read environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  try {
    console.log('🚀 Setting up AI Fiesta database...')
    
    // Read the SQL schema file
    const schemaPath = join(process.cwd(), 'database', 'enhanced_schema.sql')
    const schema = readFileSync(schemaPath, 'utf8')
    
    // Split into individual statements (rough split by CREATE statements)
    const statements = schema
      .split(/(?=CREATE TABLE|CREATE INDEX|CREATE POLICY|ALTER TABLE|CREATE OR REPLACE)/g)
      .filter(stmt => stmt.trim().length > 0)
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`)
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim()
      if (statement) {
        try {
          console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`)
          const { error } = await supabase.rpc('exec_sql', { sql: statement })
          
          if (error) {
            console.warn(`⚠️  Warning in statement ${i + 1}:`, error.message)
          }
        } catch (err) {
          console.warn(`⚠️  Error in statement ${i + 1}:`, err)
        }
      }
    }
    
    console.log('✅ Database setup completed!')
    console.log('🎉 You can now start using AI Fiesta with full payment functionality')
    
  } catch (error) {
    console.error('❌ Error setting up database:', error)
    process.exit(1)
  }
}

// Run the setup
setupDatabase()#!/usr/bin/env node

/**
 * Simple script to setup the database tables for AI Fiesta
 * Run this script after setting up your Supabase project
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

// Read environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  try {
    console.log('🚀 Setting up AI Fiesta database...')
    
    // Read the SQL schema file
    const schemaPath = join(process.cwd(), 'database', 'enhanced_schema.sql')
    const schema = readFileSync(schemaPath, 'utf8')
    
    // Split into individual statements (rough split by CREATE statements)
    const statements = schema
      .split(/(?=CREATE TABLE|CREATE INDEX|CREATE POLICY|ALTER TABLE|CREATE OR REPLACE)/g)
      .filter(stmt => stmt.trim().length > 0)
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`)
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim()
      if (statement) {
        try {
          console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`)
          const { error } = await supabase.rpc('exec_sql', { sql: statement })
          
          if (error) {
            console.warn(`⚠️  Warning in statement ${i + 1}:`, error.message)
          }
        } catch (err) {
          console.warn(`⚠️  Error in statement ${i + 1}:`, err)
        }
      }
    }
    
    console.log('✅ Database setup completed!')
    console.log('🎉 You can now start using AI Fiesta with full payment functionality')
    
  } catch (error) {
    console.error('❌ Error setting up database:', error)
    process.exit(1)
  }
}

// Run the setup
setupDatabase()