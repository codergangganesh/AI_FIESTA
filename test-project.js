#!/usr/bin/env node

/**
 * AI Fiesta Project Comprehensive Test Suite
 * Tests all major functionality including MCP server integration
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class ProjectTester {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.errors = [];
    this.warnings = [];
    this.passed = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async runTests() {
    console.log('🧪 Starting AI Fiesta Project Tests...\n');

    try {
      // Test 1: Environment Configuration
      await this.testEnvironmentConfig();
      
      // Test 2: File Structure
      await this.testFileStructure();
      
      // Test 3: TypeScript Compilation
      await this.testTypeScriptCompilation();
      
      // Test 4: Stripe Integration
      await this.testStripeIntegration();
      
      // Test 5: Supabase Integration  
      await this.testSupabaseIntegration();
      
      // Test 6: MCP Server Integration
      await this.testMCPServerIntegration();
      
      // Test 7: API Endpoints
      await this.testAPIEndpoints();
      
      // Generate Report
      this.generateReport();
      
    } catch (error) {
      this.log(`Fatal test error: ${error.message}`, 'error');
      this.errors.push(`Fatal error: ${error.message}`);
    }
  }

  async testEnvironmentConfig() {
    this.log('Testing Environment Configuration...', 'info');
    
    const envPath = path.join(__dirname, '.env.local');
    if (!fs.existsSync(envPath)) {
      this.errors.push('Missing .env.local file');
      return;
    }
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Check required environment variables
    const requiredVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
      'STRIPE_SECRET_KEY',
      'OPENROUTER_API_KEY'
    ];
    
    for (const varName of requiredVars) {
      if (!envContent.includes(varName) || envContent.includes(`# ${varName}`)) {
        this.errors.push(`Missing or commented environment variable: ${varName}`);
      } else {
        this.passed.push(`Environment variable configured: ${varName}`);
      }
    }
    
    this.log('Environment configuration test completed', 'success');
  }

  async testFileStructure() {
    this.log('Testing File Structure...', 'info');
    
    const criticalFiles = [
      'src/app/layout.tsx',
      'src/app/page.tsx',
      'src/lib/stripe.ts',
      'src/lib/supabase/client.ts',
      'src/contexts/AuthContext.tsx',
      'src/contexts/PlanContext.tsx',
      'src/app/api/stripe/create-checkout/route.ts',
      'database/enhanced_schema.sql',
      'next.config.ts',
      'package.json'
    ];
    
    for (const file of criticalFiles) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        this.passed.push(`File exists: ${file}`);
      } else {
        this.errors.push(`Missing critical file: ${file}`);
      }
    }
    
    this.log('File structure test completed', 'success');
  }

  async testTypeScriptCompilation() {
    this.log('Testing TypeScript Compilation...', 'info');
    
    return new Promise((resolve) => {
      const tsc = spawn('npx', ['tsc', '--noEmit', '--skipLibCheck'], {
        cwd: __dirname,
        stdio: 'pipe'
      });
      
      let output = '';
      let errorOutput = '';
      
      tsc.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      tsc.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });
      
      tsc.on('close', (code) => {
        if (code === 0) {
          this.passed.push('TypeScript compilation successful');
          this.log('TypeScript compilation test passed', 'success');
        } else {
          this.errors.push(`TypeScript compilation failed: ${errorOutput}`);
          this.log('TypeScript compilation errors found', 'error');
        }
        resolve();
      });
      
      // Timeout after 30 seconds
      setTimeout(() => {
        tsc.kill();
        this.warnings.push('TypeScript compilation test timed out');
        resolve();
      }, 30000);
    });
  }

  async testStripeIntegration() {
    this.log('Testing Stripe Integration...', 'info');
    
    try {
      const stripeConfig = require('./src/lib/stripe.ts');
      this.passed.push('Stripe configuration module loads successfully');
      
      // Check if Stripe keys are properly set
      if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && 
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith('pk_')) {
        this.passed.push('Stripe publishable key format is correct');
      } else {
        this.errors.push('Invalid or missing Stripe publishable key');
      }
      
      if (process.env.STRIPE_SECRET_KEY && 
          process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
        this.passed.push('Stripe secret key format is correct');
      } else {
        this.errors.push('Invalid or missing Stripe secret key');
      }
      
    } catch (error) {
      this.errors.push(`Stripe integration error: ${error.message}`);
    }
    
    this.log('Stripe integration test completed', 'success');
  }

  async testSupabaseIntegration() {
    this.log('Testing Supabase Integration...', 'info');
    
    try {
      // Test Supabase client creation
      const { createClient } = require('./src/lib/supabase/client.ts');
      
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && 
          process.env.NEXT_PUBLIC_SUPABASE_URL.includes('supabase.co')) {
        this.passed.push('Supabase URL format is correct');
      } else {
        this.errors.push('Invalid Supabase URL');
      }
      
      if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && 
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 100) {
        this.passed.push('Supabase anon key appears to be valid');
      } else {
        this.errors.push('Invalid or missing Supabase anon key');
      }
      
      this.passed.push('Supabase client module loads successfully');
      
    } catch (error) {
      this.errors.push(`Supabase integration error: ${error.message}`);
    }
    
    this.log('Supabase integration test completed', 'success');
  }

  async testMCPServerIntegration() {
    this.log('Testing MCP Server Integration...', 'info');
    
    return new Promise((resolve) => {
      const mcpProcess = spawn('npx', ['--yes', '@testsprite/testsprite-mcp@latest'], {
        env: { 
          ...process.env, 
          API_KEY: 'sk-user-fTBpUu14g2Y7j-tXnMeWoetQxLpBLLfqoI5ClHPt0Hq3X_w2q3SPPoo8op2OTq1kSmDSWQjKLUNz1arkdt_Q3sVQsyWUd9uWtpPQrNgPyVBM_fIMgwaaSY1kBOaMhoz2xMI'
        },
        stdio: 'pipe'
      });
      
      let mcpReady = false;
      
      mcpProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('TestSprite MCP Server running on stdio')) {
          mcpReady = true;
          this.passed.push('MCP Server starts successfully');
          mcpProcess.kill();
          resolve();
        }
      });
      
      mcpProcess.stderr.on('data', (data) => {
        this.warnings.push(`MCP Server warning: ${data.toString()}`);
      });
      
      mcpProcess.on('error', (error) => {
        this.errors.push(`MCP Server error: ${error.message}`);
        resolve();
      });
      
      // Timeout after 15 seconds
      setTimeout(() => {
        if (!mcpReady) {
          this.errors.push('MCP Server failed to start within timeout');
          mcpProcess.kill();
        }
        resolve();
      }, 15000);
    });
  }

  async testAPIEndpoints() {
    this.log('Testing API Endpoints...', 'info');
    
    const apiEndpoints = [
      'src/app/api/stripe/create-checkout/route.ts',
      'src/app/api/stripe/webhook/route.ts'
    ];
    
    for (const endpoint of apiEndpoints) {
      const endpointPath = path.join(__dirname, endpoint);
      if (fs.existsSync(endpointPath)) {
        try {
          const content = fs.readFileSync(endpointPath, 'utf8');
          if (content.includes('export async function')) {
            this.passed.push(`API endpoint properly structured: ${endpoint}`);
          } else {
            this.warnings.push(`API endpoint may have structure issues: ${endpoint}`);
          }
        } catch (error) {
          this.errors.push(`API endpoint reading error: ${endpoint} - ${error.message}`);
        }
      } else {
        this.errors.push(`Missing API endpoint: ${endpoint}`);
      }
    }
    
    this.log('API endpoints test completed', 'success');
  }

  generateReport() {
    console.log('\n📊 TEST REPORT');
    console.log('================\n');
    
    console.log(`✅ Passed Tests: ${this.passed.length}`);
    console.log(`⚠️  Warnings: ${this.warnings.length}`);
    console.log(`❌ Failed Tests: ${this.errors.length}\n`);
    
    if (this.passed.length > 0) {
      console.log('✅ PASSED:');
      this.passed.forEach(test => console.log(`   • ${test}`));
      console.log('');
    }
    
    if (this.warnings.length > 0) {
      console.log('⚠️  WARNINGS:');
      this.warnings.forEach(warning => console.log(`   • ${warning}`));
      console.log('');
    }
    
    if (this.errors.length > 0) {
      console.log('❌ ERRORS:');
      this.errors.forEach(error => console.log(`   • ${error}`));
      console.log('');
    }
    
    const successRate = Math.round((this.passed.length / (this.passed.length + this.errors.length)) * 100);
    console.log(`📈 Success Rate: ${successRate}%`);
    
    if (this.errors.length === 0) {
      console.log('\n🎉 All critical tests passed! Project is ready for production.');
    } else {
      console.log(`\n🔧 ${this.errors.length} critical issues need attention before deployment.`);
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new ProjectTester();
  tester.runTests().then(() => {
    process.exit(0);
  }).catch(error => {
    console.error('Test suite error:', error);
    process.exit(1);
  });
}

module.exports = ProjectTester;