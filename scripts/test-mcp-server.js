#!/usr/bin/env node

/**
 * TestSprite MCP Server Diagnostic Tool
 * Tests the MCP server initialization and basic functionality
 */

const { spawn } = require('child_process');
const { performance } = require('perf_hooks');

class MCPTester {
  constructor() {
    this.apiKey = process.env.API_KEY || 'sk-user-fTBpUu14g2Y7j-tXnMeWoetQxLpBLLfqoI5ClHPt0Hq3X_w2q3SPPoo8op2OTq1kSmDSWQjKLUNz1arkdt_Q3sVQsyWUd9uWtpPQrNgPyVBM_fIMgwaaSY1kBOaMhoz2xMI';
    this.timeout = 30000; // 30 seconds timeout
  }

  async testMCPServer() {
    console.log('🧪 Starting TestSprite MCP Server Diagnostic...\n');
    
    const startTime = performance.now();
    
    try {
      // Test 1: Server startup
      console.log('📋 Test 1: Server Startup');
      const serverProcess = await this.startServer();
      console.log('✅ Server started successfully');
      
      // Test 2: Initialize connection
      console.log('\n📋 Test 2: Server Initialization');
      const initResult = await this.testInitialize(serverProcess);
      console.log('✅ Server initialization successful');
      console.log(`📊 Server capabilities: ${JSON.stringify(initResult.capabilities, null, 2)}`);
      
      // Test 3: List available tools
      console.log('\n📋 Test 3: Tool Discovery');
      const tools = await this.listTools(serverProcess);
      console.log(`✅ Found ${tools.length} available tools`);
      tools.forEach(tool => {
        console.log(`   🔧 ${tool.name}: ${tool.description}`);
      });
      
      // Cleanup
      serverProcess.kill();
      
      const endTime = performance.now();
      console.log(`\n🎉 All tests passed! Total time: ${Math.round(endTime - startTime)}ms`);
      
      return true;
    } catch (error) {
      console.error('❌ Test failed:', error.message);
      console.error('\n🔧 Troubleshooting tips:');
      console.error('   1. Ensure stable internet connection');
      console.error('   2. Check if API_KEY is valid');
      console.error('   3. Try running: npm cache clean --force');
      console.error('   4. Verify Node.js version (>= 16.0.0)');
      
      return false;
    }
  }

  startServer() {
    return new Promise((resolve, reject) => {
      const serverProcess = spawn('npx', ['--yes', '@testsprite/testsprite-mcp@latest'], {
        env: { ...process.env, API_KEY: this.apiKey },
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let serverReady = false;
      const timeout = setTimeout(() => {
        if (!serverReady) {
          serverProcess.kill();
          reject(new Error('Server startup timeout'));
        }
      }, this.timeout);

      serverProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('TestSprite MCP Server running on stdio')) {
          serverReady = true;
          clearTimeout(timeout);
          resolve(serverProcess);
        }
      });

      serverProcess.stderr.on('data', (data) => {
        console.error('Server error:', data.toString());
      });

      serverProcess.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

  testInitialize(serverProcess) {
    return new Promise((resolve, reject) => {
      const request = {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: {
            name: 'mcp-diagnostic-tool',
            version: '1.0.0'
          }
        }
      };

      let responseReceived = false;
      const timeout = setTimeout(() => {
        if (!responseReceived) {
          reject(new Error('Initialize request timeout'));
        }
      }, 10000);

      serverProcess.stdout.on('data', (data) => {
        try {
          const response = JSON.parse(data.toString());
          if (response.id === 1 && response.result) {
            responseReceived = true;
            clearTimeout(timeout);
            resolve(response.result);
          }
        } catch (e) {
          // Ignore parsing errors for non-JSON output
        }
      });

      serverProcess.stdin.write(JSON.stringify(request) + '\n');
    });
  }

  listTools(serverProcess) {
    return new Promise((resolve, reject) => {
      const request = {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list',
        params: {}
      };

      let responseReceived = false;
      const timeout = setTimeout(() => {
        if (!responseReceived) {
          reject(new Error('List tools request timeout'));
        }
      }, 10000);

      serverProcess.stdout.on('data', (data) => {
        try {
          const response = JSON.parse(data.toString());
          if (response.id === 2 && response.result) {
            responseReceived = true;
            clearTimeout(timeout);
            resolve(response.result.tools || []);
          }
        } catch (e) {
          // Ignore parsing errors for non-JSON output
        }
      });

      serverProcess.stdin.write(JSON.stringify(request) + '\n');
    });
  }
}

// Run the test if called directly
if (require.main === module) {
  const tester = new MCPTester();
  tester.testMCPServer().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = MCPTester;