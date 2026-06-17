$ErrorActionPreference = "Stop"

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$dockerDir = Join-Path $root "docker"

Push-Location $dockerDir
try {
  docker compose down
  Write-Host "PostgreSQL parado." -ForegroundColor Green
}
finally {
  Pop-Location
}
