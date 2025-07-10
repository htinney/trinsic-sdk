# Check if NPM_TOKEN is set (CI/CD environment)
if ($env:NPM_TOKEN) {
    Write-Host "Setting npm token from environment variable" -ForegroundColor Yellow
    &npm set //registry.npmjs.org/:_authToken "$env:NPM_TOKEN"
    if ($LASTEXITCODE -ne 0) {
        throw "npm set config failed"
    }
} else {
    Write-Host "No NPM_TOKEN found, using existing npm authentication" -ForegroundColor Yellow
    # Check if user is logged in
    $WhoAmI = &npm whoami 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "You are not logged in to npm. Please run 'npm login' first." -ForegroundColor Red
        exit 1
    }
    Write-Host "Logged in as: $WhoAmI" -ForegroundColor Green
}

try {
    Set-Location "$PSScriptRoot/sdk/publish"
    Write-Host "Publishing packages"
    
    $Packages = Get-ChildItem -Filter "htinney-trinsic-react-ui-*.tgz"
    if ($Packages.Count -eq 0) {
        Write-Host "No packages found to publish" -ForegroundColor Yellow
        Write-Host "Looking for files matching: htinney-trinsic-react-ui-*.tgz" -ForegroundColor Yellow
        Write-Host "Available files:" -ForegroundColor Yellow
        Get-ChildItem -Filter "*.tgz" | ForEach-Object { Write-Host "  $($_.Name)" -ForegroundColor Cyan }
        exit 1
    }
    
    foreach ($package in $Packages) {
        Write-Host "Publishing $($package.Name)..." -ForegroundColor Green
        & npm publish $package.FullName --yes --no-git-tag-version --access=public
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Failed to publish $($package.Name)" -ForegroundColor Red
            throw "npm publish failed for $($package.Name)"
        }
        Write-Host "Successfully published $($package.Name)" -ForegroundColor Green
    }
    
    Write-Host "All packages published successfully!" -ForegroundColor Green
}
finally {
    Pop-Location
} 