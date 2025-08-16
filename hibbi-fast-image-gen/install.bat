@echo off
echo Installing HIBBI Fast Image Generator dependencies...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

echo Installing npm dependencies...
npm install

if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ✅ Installation completed successfully!
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo To set up Stable Diffusion for real image generation:
echo   See setup-stable-diffusion.md
echo.
pause