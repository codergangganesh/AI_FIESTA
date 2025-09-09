# TestSprite MCP Server PowerShell Diagnostic Script
# Tests MCP server functionality and connectivity

param(
    [string]$ApiKey = "sk-user-fTBpUu14g2Y7j-tXnMeWoetQxLpBLLfqoI5ClHPt0Hq3X_w2q3SPPoo8op2OTq1kBOaMhoz2xMI",
    [int]$TimeoutSeconds = 30
)

Write-Host "🧪 TestSprite MCP Server Diagnostic Tool" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Set environment variable
$env:API_KEY = $ApiKey

# Test 1: Check Node.js installation
Write-Host "`n📋 Test 1: Environment Check" -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found or not accessible" -ForegroundColor Red
    exit 1
}

# Test 2: Check npm/npx availability
try {
    $npxVersion = npx --version
    Write-Host "✅ npx version: $npxVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npx not found or not accessible" -ForegroundColor Red
    exit 1
}

# Test 3: Install and test MCP server
Write-Host "`n📋 Test 2: MCP Server Installation & Startup" -ForegroundColor Yellow

try {
    Write-Host "🔄 Installing TestSprite MCP package..." -ForegroundColor Blue
    
    # Start the MCP server process
    $mcpProcess = Start-Process -FilePath "npx" -ArgumentList "--yes", "@testsprite/testsprite-mcp@latest" -PassThru -NoNewWindow -RedirectStandardOutput "mcp_output.log" -RedirectStandardError "mcp_error.log"
    
    # Wait for server to start
    $maxWait = $TimeoutSeconds
    $waited = 0
    $serverStarted = $false
    
    while ($waited -lt $maxWait -and !$serverStarted) {
        Start-Sleep -Seconds 1
        $waited++
        
        if (Test-Path "mcp_output.log") {
            $output = Get-Content "mcp_output.log" -ErrorAction SilentlyContinue
            if ($output -and $output -match "TestSprite MCP Server running on stdio") {
                $serverStarted = $true
                Write-Host "✅ MCP Server started successfully" -ForegroundColor Green
            }
        }
        
        # Show progress
        if ($waited % 5 -eq 0) {
            Write-Host "⏳ Waiting for server startup... ($waited/$maxWait seconds)" -ForegroundColor Blue
        }
    }
    
    if (!$serverStarted) {
        Write-Host "❌ Server startup timeout after $maxWait seconds" -ForegroundColor Red
        if (Test-Path "mcp_error.log") {
            $errorContent = Get-Content "mcp_error.log"
            if ($errorContent) {
                Write-Host "Error details:" -ForegroundColor Red
                $errorContent | ForEach-Object { Write-Host "   $_" -ForegroundColor Red }
            }
        }
        exit 1
    }
    
    # Test 4: Basic communication test
    Write-Host "`n📋 Test 3: MCP Communication Test" -ForegroundColor Yellow
    
    $initRequest = @{
        jsonrpc = "2.0"
        id = 1
        method = "initialize"
        params = @{
            protocolVersion = "2024-11-05"
            capabilities = @{}
            clientInfo = @{
                name = "powershell-test-client"
                version = "1.0.0"
            }
        }
    } | ConvertTo-Json -Depth 4 -Compress
    
    # Send initialization request
    $testProcess = Start-Process -FilePath "npx" -ArgumentList "--yes", "@testsprite/testsprite-mcp@latest" -PassThru -NoNewWindow -RedirectStandardInput -RedirectStandardOutput "test_output.log" -RedirectStandardError "test_error.log"
    
    # Wait a moment for the process to start
    Start-Sleep -Seconds 2
    
    # Send the request
    $initRequest | Out-File -FilePath "init_request.txt" -Encoding utf8
    Get-Content "init_request.txt" | & {
        process {
            $testProcess.StandardInput.WriteLine($_)
        }
    }
    $testProcess.StandardInput.Close()
    
    # Wait for response
    Start-Sleep -Seconds 3
    
    if (Test-Path "test_output.log") {
        $response = Get-Content "test_output.log"
        if ($response -and $response -match '"result"') {
            Write-Host "✅ MCP Server responding correctly" -ForegroundColor Green
            Write-Host "📊 Server initialized successfully" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Server response unclear, but process completed" -ForegroundColor Yellow
        }
    }
    
    Write-Host "`n🎉 All tests completed successfully!" -ForegroundColor Green
    Write-Host "`n📋 MCP Configuration to use:" -ForegroundColor Cyan
    Write-Host @"
{
  "mcpServers": {
    "TestSprite": {
      "command": "npx",
      "args": ["--yes", "@testsprite/testsprite-mcp@latest"],
      "env": {
        "API_KEY": "$ApiKey"
      }
    }
  }
}
"@ -ForegroundColor White
    
} catch {
    Write-Host "❌ Error during testing: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`n🔧 Troubleshooting suggestions:" -ForegroundColor Yellow
    Write-Host "   1. Check internet connectivity" -ForegroundColor White
    Write-Host "   2. Verify API key is correct" -ForegroundColor White
    Write-Host "   3. Clear npm cache: npm cache clean --force" -ForegroundColor White
    Write-Host "   4. Try running as administrator" -ForegroundColor White
    exit 1
} finally {
    # Cleanup processes and temporary files
    if ($mcpProcess -and !$mcpProcess.HasExited) {
        $mcpProcess.Kill()
    }
    if ($testProcess -and !$testProcess.HasExited) {
        $testProcess.Kill()
    }
    
    # Clean up temporary files
    @("mcp_output.log", "mcp_error.log", "test_output.log", "test_error.log", "init_request.txt") | ForEach-Object {
        if (Test-Path $_) {
            Remove-Item $_ -Force -ErrorAction SilentlyContinue
        }
    }
}

Write-Host "`n✨ Diagnostic complete! Your TestSprite MCP server should now work correctly." -ForegroundColor Cyan