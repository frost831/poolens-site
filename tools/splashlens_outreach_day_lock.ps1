param(
  [string]$Date = (Get-Date -Format 'yyyy-MM-dd'),
  [int]$DailyCap = 5,
  [switch]$Release
)

$ErrorActionPreference = 'Stop'

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$outreachDir = Join-Path $repoRoot 'docs\outreach'
$runLog = Join-Path $outreachDir 'splashlens-drip-run-log.md'
$lockRoot = Join-Path $outreachDir '.locks'
$lockPath = Join-Path $lockRoot "splashlens-outreach-$Date.lock"

if (!(Test-Path $lockRoot)) {
  New-Item -ItemType Directory -Path $lockRoot | Out-Null
}

if ($Release) {
  if (Test-Path $lockPath) {
    Remove-Item -LiteralPath $lockPath -Force
    Write-Output "Released SplashLens outreach lock for $Date."
  } else {
    Write-Output "No SplashLens outreach lock existed for $Date."
  }
  exit 0
}

if (!(Test-Path $runLog)) {
  throw "Missing run log: $runLog"
}

$logText = Get-Content -LiteralPath $runLog -Raw
$todayPattern = [Regex]::Escape($Date)
$todayAcceptedSends = ([regex]::Matches($logText, "(?im)^\s*-\s+.*sent id `?19[a-zA-Z0-9]+`?.*$todayPattern|^\s*-\s+.*$todayPattern.*sent id `?19[a-zA-Z0-9]+`?")).Count

# Fallback for the current run-log style where a section header has the date
# and the recipient bullets below carry Gmail ids but not the date.
if ($todayAcceptedSends -eq 0) {
  $sections = [regex]::Matches($logText, "(?ms)^## .*?$todayPattern.*?(?=^## |\z)")
  foreach ($section in $sections) {
    $todayAcceptedSends += ([regex]::Matches($section.Value, "(?im)sent id `?19[a-zA-Z0-9]+`?")).Count
  }
}

$recentHardBounce = $false
$recapPattern = '(?i)known|remain|remains|still|no new|beyond known|blocked because|earliest|window clears|old|prior|previous|fresh seven-day|hygiene|send boundary|send gate|guard|blocker|blocked'
$bouncePattern = '(?i)hard[- ]?bounce|hard[- ]?bounced|delivery failure|550 No Such User|bounce id'
for ($daysBack = 0; $daysBack -le 7; $daysBack++) {
  $checkDate = (Get-Date $Date).AddDays(-1 * $daysBack).ToString('yyyy-MM-dd')
  $freshBounceLines = @([regex]::Split($logText, "`r?`n") | Where-Object {
    ($_ -match $checkDate) -and
    ($_ -match $bouncePattern) -and
    ($_ -notmatch $recapPattern)
  })
  if ($freshBounceLines.Count -gt 0) {
    $recentHardBounce = $true
    break
  }
  if ($recentHardBounce) { break }
}

$problems = @()
if (Test-Path $lockPath) {
  $problems += "Existing same-day lock: $lockPath"
}
if ($todayAcceptedSends -ge $DailyCap) {
  $problems += "Daily cap already consumed: $todayAcceptedSends/$DailyCap accepted sends found in run log for $Date"
}
if ($recentHardBounce) {
  $problems += "Recent hard-bounce/delivery-failure language found in the last 7 days of the run log"
}

if ($problems.Count -gt 0) {
  Write-Output "SplashLens outreach send gate: BLOCKED"
  $problems | ForEach-Object { Write-Output "- $_" }
  exit 2
}

$lockPayload = [ordered]@{
  date = $Date
  created_at = (Get-Date).ToString('o')
  daily_cap = $DailyCap
  sends_found_today = $todayAcceptedSends
  repo = $repoRoot.Path
  note = 'Single-writer lock for SplashLens outreach. Release only after queue and run log are updated.'
} | ConvertTo-Json

New-Item -ItemType File -Path $lockPath -Value $lockPayload -ErrorAction Stop | Out-Null
Write-Output "SplashLens outreach send gate: PASS"
Write-Output "Created lock: $lockPath"
Write-Output "Sends found today: $todayAcceptedSends/$DailyCap"
