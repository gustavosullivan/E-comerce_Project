$ErrorActionPreference = "Stop"

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$dockerDir = Join-Path $root "docker"

Write-Host "Bugiganga API - subindo PostgreSQL..." -ForegroundColor Cyan
Write-Host "Pasta: $dockerDir"

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Host ""
  Write-Host "Docker nao encontrado." -ForegroundColor Red
  Write-Host "Instale Docker Desktop ou crie os bancos manualmente:" -ForegroundColor Yellow
  Write-Host "  CREATE DATABASE db_user;"
  Write-Host "  CREATE DATABASE db_product;"
  Write-Host "  CREATE DATABASE db_currency;"
  exit 1
}

Push-Location $dockerDir
try {
  docker compose up -d
  if ($LASTEXITCODE -ne 0) {
    throw "docker compose falhou"
  }

  Write-Host ""
  Write-Host "PostgreSQL pronto!" -ForegroundColor Green
  Write-Host "Host: localhost:55432"
  Write-Host "Usuario: postgres"
  Write-Host "Senha: 123"
  Write-Host "Bancos: db_user | db_product | db_currency | db_order"
  Write-Host ""
  Write-Host "Proximo passo: suba os microservicos (auth, product, currency...)." -ForegroundColor Cyan
  Write-Host "O Flyway cria tabelas e dados iniciais na primeira execucao de cada servico."
}
finally {
  Pop-Location
}
