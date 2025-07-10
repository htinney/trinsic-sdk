param(
    [string]$Mode = "status"
)

$SamplesDir = "samples"
$SdkDir = "sdk"
$PackageJsonPath = "$SamplesDir\package.json"

# Check files exist
if (-not (Test-Path $PackageJsonPath)) {
    Write-Error "package.json not found in samples directory"
    exit 1
}

if (-not (Test-Path "$SdkDir\package.json")) {
    Write-Error "SDK package.json not found"
    exit 1
}

# Read SDK version
$SdkJson = Get-Content "$SdkDir\package.json" | ConvertFrom-Json
$SdkVersion = $SdkJson.version

# Read samples package.json
$PackageJson = Get-Content $PackageJsonPath | ConvertFrom-Json
$CurrentDep = $PackageJson.dependencies."@htinney/trinsic-react-ui"

if ($Mode -eq "status") {
    if ($CurrentDep -like "file:*") {
        Write-Host "Mode: LOCAL DEVELOPMENT" -ForegroundColor Green
    } else {
        Write-Host "Mode: DEPLOYMENT" -ForegroundColor Blue
    }
    Write-Host "Current: $CurrentDep" -ForegroundColor Yellow
    Write-Host "SDK Version: $SdkVersion" -ForegroundColor Cyan
}

if ($Mode -eq "local") {
    Write-Host "Switching to local development..." -ForegroundColor Green
    
    # Check if SDK is built
    if (-not (Test-Path "$SdkDir\dist\index.js")) {
        Write-Host "SDK dist files not found. Building SDK..." -ForegroundColor Yellow
        Set-Location $SdkDir
        npm run build
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Failed to build SDK" -ForegroundColor Red
            exit 1
        }
        Set-Location ..
        Write-Host "SDK built successfully" -ForegroundColor Green
    }
    
    # Update package.json
    $Content = Get-Content $PackageJsonPath -Raw
    $NewContent = $Content -replace '("@htinney/trinsic-react-ui":\s*)"[^"]*"', '$1"file:../sdk"'
    $NewContent | Set-Content $PackageJsonPath -NoNewline
    
    # Always remove node_modules for clean install
    if (Test-Path "$SamplesDir\node_modules") {
        Write-Host "Removing node_modules..." -ForegroundColor Yellow
        Remove-Item "$SamplesDir\node_modules" -Recurse -Force
    }
    
    # Install dependencies
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    Set-Location $SamplesDir
    npm install
    Set-Location ..
    
    # Validate that SDK is properly installed and not pointing to source
    $SdkNodeModulesPath = "$SamplesDir\node_modules\@htinney\trinsic-react-ui"
    if (Test-Path $SdkNodeModulesPath) {
        # Check if it's a symlink
        $Item = Get-Item $SdkNodeModulesPath
        if ($Item.LinkType -eq "SymbolicLink") {
            Write-Host "Warning: SDK is symlinked! This means npm link is active." -ForegroundColor Red
            Write-Host "The package is pointing to source files instead of built distribution." -ForegroundColor Red
            Write-Host "This can cause issues with TypeScript compilation." -ForegroundColor Red
            $Continue = Read-Host "Continue anyway? (y/n)"
            if ($Continue -ne "y" -and $Continue -ne "Y") {
                Write-Host "Aborted. Try running 'npm unlink' in the samples directory first." -ForegroundColor Yellow
                exit 1
            }
        } else {
            # Check if it's pointing to the SDK directory (file:../sdk scenario)
            $PackageJsonInNodeModules = "$SdkNodeModulesPath\package.json"
            if (Test-Path $PackageJsonInNodeModules) {
                $NodeModulesPackageJson = Get-Content $PackageJsonInNodeModules | ConvertFrom-Json
                $MainFile = $NodeModulesPackageJson.main
                $MainFilePath = "$SdkNodeModulesPath\$MainFile"
                
                # Check if main file exists and is actually built (not source)
                if (-not (Test-Path $MainFilePath)) {
                    Write-Host "Warning: SDK main file not found at expected path: $MainFile" -ForegroundColor Red
                    Write-Host "This suggests the package is not properly built or installed." -ForegroundColor Red
                    $Continue = Read-Host "Continue anyway? (y/n)"
                    if ($Continue -ne "y" -and $Continue -ne "Y") {
                        Write-Host "Aborted. Try rebuilding the SDK first." -ForegroundColor Yellow
                        exit 1
                    }
                } else {
                    # Check if the main file is actually built JavaScript (not TypeScript source)
                    $MainFileContent = Get-Content $MainFilePath -Raw -ErrorAction SilentlyContinue
                    if ($MainFileContent -and $MainFileContent.Contains("export") -and $MainFileContent.Contains("function") -and -not $MainFileContent.Contains("interface") -and -not $MainFileContent.Contains("type ")) {
                        Write-Host "SDK installation validated - main file is built JavaScript" -ForegroundColor Green
                    } else {
                        Write-Host "Warning: SDK main file appears to be TypeScript source instead of built JavaScript" -ForegroundColor Red
                        Write-Host "This suggests the package is pointing to source files instead of dist files." -ForegroundColor Red
                        $Continue = Read-Host "Continue anyway? (y/n)"
                        if ($Continue -ne "y" -and $Continue -ne "Y") {
                            Write-Host "Aborted. Try rebuilding the SDK first." -ForegroundColor Yellow
                            exit 1
                        }
                    }
                }
            } else {
                Write-Host "Warning: Could not find package.json in SDK node_modules" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "Warning: SDK not found in node_modules" -ForegroundColor Red
    }
    
    Write-Host "Done! Ready for development" -ForegroundColor Green
}

if ($Mode -eq "deploy") {
    Write-Host "Switching to deployment..." -ForegroundColor Blue
    
    # Check if version exists in npm registry
    Write-Host "Checking if version $SdkVersion exists in npm registry..." -ForegroundColor Yellow
    $NpmCheck = npm view "@htinney/trinsic-react-ui@$SdkVersion" --json 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Warning: Version $SdkVersion may not be published to npm registry" -ForegroundColor Red
        Write-Host "This could cause installation issues in production" -ForegroundColor Red
        $Continue = Read-Host "Continue anyway? (y/n)"
        if ($Continue -ne "y" -and $Continue -ne "Y") {
            Write-Host "Aborted" -ForegroundColor Yellow
            exit 1
        }
    } else {
        Write-Host "Version $SdkVersion found in npm registry" -ForegroundColor Green
    }
    
    # Update package.json
    $Content = Get-Content $PackageJsonPath -Raw
    $NewContent = $Content -replace '("@htinney/trinsic-react-ui":\s*)"[^"]*"', "`$1`"$SdkVersion`""
    $NewContent | Set-Content $PackageJsonPath -NoNewline
    
    # Always remove node_modules for clean install
    if (Test-Path "$SamplesDir\node_modules") {
        Write-Host "Removing node_modules..." -ForegroundColor Yellow
        Remove-Item "$SamplesDir\node_modules" -Recurse -Force
    }
    
    # Clear npm cache for this package
    Write-Host "Clearing npm cache..." -ForegroundColor Yellow
    npm cache clean --force
    
    # Install dependencies with clean slate
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    Set-Location $SamplesDir
    npm install --no-package-lock
    npm install
    Set-Location ..
    
    # Force install the specific package from registry
    Write-Host "Forcing registry install of SDK..." -ForegroundColor Yellow
    Set-Location $SamplesDir
    npm install "@htinney/trinsic-react-ui@$SdkVersion" --registry https://registry.npmjs.org/
    Set-Location ..
    
    # VALIDATE NO SYMLINKS OR JUNCTIONS IN DEPLOY MODE
    $SdkNodeModulesPath = "$SamplesDir\node_modules\@htinney\trinsic-react-ui"
    if (Test-Path $SdkNodeModulesPath) {
        $Item = Get-Item $SdkNodeModulesPath
        if ($Item.LinkType -eq "SymbolicLink" -or $Item.LinkType -eq "Junction") {
            Write-Host "ERROR: SDK is linked in DEPLOY mode!" -ForegroundColor Red
            Write-Host "LinkType: $($Item.LinkType)" -ForegroundColor Red
            Write-Host "Target: $($Item.Target)" -ForegroundColor Red
            Write-Host "This should NEVER happen in deployment mode." -ForegroundColor Red
            Write-Host "The package is pointing to source files instead of published version." -ForegroundColor Red
            exit 1
        } else {
            Write-Host "Deployment validation passed - no links found" -ForegroundColor Green
        }
    }
    
    Write-Host "Done! Ready for deployment" -ForegroundColor Green
}

if ($Mode -eq "debug") {
    Write-Host "=== DEBUG MODE ===" -ForegroundColor Magenta
    
    $SdkNodeModulesPath = "$SamplesDir\node_modules\@htinney\trinsic-react-ui"
    Write-Host "Checking path: $SdkNodeModulesPath" -ForegroundColor Yellow
    
    if (Test-Path $SdkNodeModulesPath) {
        $Item = Get-Item $SdkNodeModulesPath
        Write-Host "Item exists: $($Item.FullName)" -ForegroundColor Green
        Write-Host "LinkType: $($Item.LinkType)" -ForegroundColor Cyan
        Write-Host "Target: $($Item.Target)" -ForegroundColor Cyan
        Write-Host "Attributes: $($Item.Attributes)" -ForegroundColor Cyan
        
        # Check npm ls output
        Write-Host "`n=== npm ls output ===" -ForegroundColor Magenta
        Set-Location $SamplesDir
        npm ls @htinney/trinsic-react-ui
        Set-Location ..
        
        # Check package.json
        $PackageJsonInNodeModules = "$SdkNodeModulesPath\package.json"
        if (Test-Path $PackageJsonInNodeModules) {
            Write-Host "`n=== Package.json content ===" -ForegroundColor Magenta
            $NodeModulesPackageJson = Get-Content $PackageJsonInNodeModules | ConvertFrom-Json
            Write-Host "Main: $($NodeModulesPackageJson.main)" -ForegroundColor Cyan
            Write-Host "Version: $($NodeModulesPackageJson.version)" -ForegroundColor Cyan
        }
    } else {
        Write-Host "SDK not found in node_modules!" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Usage:" -ForegroundColor Magenta
Write-Host "  .\setup-dev.ps1 status" -ForegroundColor White
Write-Host "  .\setup-dev.ps1 local" -ForegroundColor White
Write-Host "  .\setup-dev.ps1 deploy" -ForegroundColor White
Write-Host "  .\setup-dev.ps1 debug" -ForegroundColor White 