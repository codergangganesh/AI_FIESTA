# Simple TestSprite MCP Server Test
param(
    [string]$ApiKey = "sk-user-fTBpUu14g2Y7j-tXnMeWoetQxLpBLLfqoI5ClHPt0Hq3X_w2q3SPPoo8op2OTq1kSmDSWQjKLUNz1arkdt_Q3sVQsyWUd9uWtpPQrNgPyVBM_fIMgwaaSY1kBOaMhoz2xMI"
)

Write-Host "Testing TestSprite MCP Server..." -ForegroundColor Cyan

# Set environment
$env:API_KEY = $ApiKey

# Test installation and basic functionality
try {
    Write-Host "Installing and starting MCP server..." -ForegroundColor Yellow
    
    $output = & npx --yes "@testsprite/testsprite-mcp@latest" 2>&1 | Out-String
    
    if ($output -match "TestSprite MCP Server running on stdio") {
        Write-Host "SUCCESS: MCP Server is working correctly!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Your MCP configuration should be:" -ForegroundColor Cyan
        Write-Host '{' -ForegroundColor White
        Write-Host '  "mcpServers": {' -ForegroundColor White
        Write-Host '    "TestSprite": {' -ForegroundColor White
        Write-Host '      "command": "npx",' -ForegroundColor White
        Write-Host '      "args": ["--yes", "@testsprite/testsprite-mcp@latest"],' -ForegroundColor White
        Write-Host '      "env": {' -ForegroundColor White
        Write-Host "        `"API_KEY`": `"$ApiKey`"" -ForegroundColor White
        Write-Host '      }' -ForegroundColor White
        Write-Host '    }' -ForegroundColor White
        Write-Host '  }' -ForegroundColor White
        Write-Host '}' -ForegroundColor White
    } else {
        Write-Host "Warning: Unexpected output, but server may still work" -ForegroundColor Yellow
        Write-Host "Output: $output" -ForegroundColor Gray
    }
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Test completed!" -ForegroundColor Green