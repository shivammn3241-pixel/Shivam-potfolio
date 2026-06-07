# ==========================================================================
# Shivam Sharma Portfolio - Auto Startup Script
# Silently launches local Python web server and SSH tunnel in the background
# ==========================================================================

$ProjectDir = "c:\Users\Dhrow Sharma\OneDrive\Desktop\shivam sharma porfolio"

# 1. Clean up any existing Python server or SSH processes to prevent port conflicts
Get-Process -Name "python" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*http.server*" } | Stop-Process -Force
Get-Process -Name "ssh" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*localhost.run*" } | Stop-Process -Force

# 2. Start local Python development server on port 8000 in Hidden mode
Start-Process -FilePath "python" -ArgumentList "-m http.server 8000" -WorkingDirectory $ProjectDir -WindowStyle Hidden

# 3. Start SSH Tunnel to localhost.run in Hidden mode
Start-Process -FilePath "ssh" -ArgumentList "-T -o StrictHostKeyChecking=no -R 80:localhost:8000 nokey@localhost.run" -WorkingDirectory $ProjectDir -WindowStyle Hidden

Write-Output "Shivam Sharma Portfolio background services initialized successfully."
