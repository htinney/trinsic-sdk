try {
    Push-Location "$PSScriptRoot/samples"

    & npm ci

    if ($LASTEXITCODE -ne 0) {
        throw "npm ci failed"
    }
    
    Write-Host "Building ui-react Next.js sample project..."

    &npm run build

    if ($LASTEXITCODE -ne 0) {
        throw "npm build failed"
    }

    Write-Host "ui-react Next.js sample project built successfully"
}
catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
    Exit 1
}
finally {
    Pop-Location
} 