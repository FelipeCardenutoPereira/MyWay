param(
  [Parameter(Mandatory=$false)][string]$RepoUrl = ""
)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw "Git nao encontrado. Instale o Git for Windows primeiro."
}
if (-not (Test-Path ".git")) { git init }
git add .
try { git commit -m "MyWay open source" } catch { Write-Host "Sem novas alteracoes para commit ou identidade Git ainda nao configurada." -ForegroundColor Yellow }
if ($RepoUrl) {
  $origin = git remote get-url origin 2>$null
  if ($LASTEXITCODE -eq 0) { git remote set-url origin $RepoUrl } else { git remote add origin $RepoUrl }
  git branch -M main
  git push -u origin main
} else {
  Write-Host "Repositorio local pronto." -ForegroundColor Green
  Write-Host "Para enviar: .\PUBLICAR-NO-GITHUB.ps1 -RepoUrl 'https://github.com/SEU-USUARIO/SEU-REPO.git'"
}
