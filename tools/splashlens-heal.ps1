param(
  [switch]$WriteReport = $true
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$reportDir = Join-Path $root "docs\ops"
$reportPath = Join-Path $reportDir "splashlens-heal-report-latest.md"
$stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz"
$cacheBust = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$failures = New-Object System.Collections.Generic.List[string]
$rows = New-Object System.Collections.Generic.List[object]

function Add-Check {
  param(
    [string]$Surface,
    [string]$Check,
    [string]$Result,
    [string]$Evidence
  )
  $script:rows.Add([pscustomobject]@{
    Surface = $Surface
    Check = $Check
    Result = $Result
    Evidence = $Evidence
  })
  if ($Result -eq "fail") {
    $script:failures.Add("$Surface - $Check - $Evidence")
  }
}

function Get-Head {
  param([string]$Url)
  $raw = curl.exe -s -D - -o NUL --max-redirs 0 $Url
  $status = (($raw | Select-String -Pattern "^HTTP/" | Select-Object -First 1).Line -split " ")[1]
  $locationMatch = $raw | Select-String -Pattern "^Location:" | Select-Object -First 1
  $modeMatch = $raw | Select-String -Pattern "^X-Splashlens-Checkout-Mode:" | Select-Object -First 1
  return [pscustomobject]@{
    Raw = $raw
    Status = [int]$status
    Location = if ($locationMatch) { ($locationMatch.Line -replace "^Location:\s*", "").Trim() } else { "" }
    Mode = if ($modeMatch) { ($modeMatch.Line -replace "^X-Splashlens-Checkout-Mode:\s*", "").Trim() } else { "" }
  }
}

function Get-Body {
  param([string]$Url)
  return (curl.exe -s -L -H "Cache-Control: no-cache" -H "Accept-Encoding: identity" $Url) -join "`n"
}

function Test-HttpStatus {
  param([string]$Url, [int]$Expected, [string]$Surface, [string]$Check)
  $head = Get-Head $Url
  Add-Check $Surface $Check ($(if ($head.Status -eq $Expected) { "pass" } else { "fail" })) "$Url returned $($head.Status), expected $Expected"
}

Test-HttpStatus "https://splashlens.com/?heal=$cacheBust" 200 "Marketing" "homepage HTTP 200"
Test-HttpStatus "https://app.splashlens.com/?heal=$cacheBust" 200 "App" "app shell HTTP 200"
Test-HttpStatus "https://splashlens.com/pricing?heal=$cacheBust" 404 "Marketing" "/pricing returns 404"
Test-HttpStatus "https://splashlens.com/signup?heal=$cacheBust" 404 "Marketing" "/signup returns 404"
Test-HttpStatus "https://splashlens.com/docs/outreach/splashlens-drip-queue.csv?heal=$cacheBust" 404 "Marketing" "internal docs are blocked"

foreach ($plan in @("monthly", "yearly")) {
  $head = Get-Head "https://app.splashlens.com/api/checkout?plan=$plan"
  $ok = $head.Status -eq 302 -and $head.Location -like "https://buy.stripe.com/*" -and $head.Mode -match "payment_link|stripe_checkout"
  Add-Check "Payments" "$plan checkout redirects" ($(if ($ok) { "pass" } else { "fail" })) "status=$($head.Status); mode=$($head.Mode); location=$($head.Location)"
}

$restore = Get-Head "https://app.splashlens.com/api/restore-entitlement"
Add-Check "Payments" "restore endpoint is function JSON" ($(if ($restore.Status -eq 200) { "pass" } else { "fail" })) "GET returned $($restore.Status)"

foreach ($url in @(
  "https://splashlens.com/sitemap.xml",
  "https://splashlens.com/pseo-sitemap.xml",
  "https://splashlens.com/seo-hub-sitemap.xml",
  "https://splashlens.com/category-hub-sitemap.xml"
)) {
  $body = Get-Body $url
  $ok = $body.TrimStart().StartsWith("<?xml") -and $body.Contains("<urlset")
  Add-Check "SEO" "sitemap readable XML" ($(if ($ok) { "pass" } else { "fail" })) "$url length=$($body.Length)"
}

$badPhrases = @(
  "PartSnap is the hook",
  "The moat is the workflow",
  "Best initial ad format",
  "Monetization comes later",
  "Cost Right Now",
  "Illustrative use case"
)

foreach ($url in @(
  "https://splashlens.com/?heal=$cacheBust",
  "https://splashlens.com/partsnap.html?heal=$cacheBust",
  "https://splashlens.com/partners.html?heal=$cacheBust"
)) {
  $body = Get-Body $url
  $hits = @()
  foreach ($phrase in $badPhrases) {
    if ($body.ToLowerInvariant().Contains($phrase.ToLowerInvariant())) { $hits += $phrase }
  }
  Add-Check "Trust copy" "no internal or fake-scenario phrase leak" ($(if ($hits.Count -eq 0) { "pass" } else { "fail" })) "$url hits=$($hits -join ', ')"
}

$siteBody = Get-Body "https://splashlens.com/?heal=$cacheBust"
Add-Check "Trust copy" "PoolPro proof above fold copy exists" ($(if ($siteBody.Contains("PoolPro Magazine covered the SplashLens launch")) { "pass" } else { "fail" })) "homepage PoolPro proof phrase"
Add-Check "Trust copy" "consistent pricing phrase exists" ($(if ($siteBody.Contains("Core tools free forever. PartSnap Pro for unlimited scans.")) { "pass" } else { "fail" })) "homepage pricing phrase"
Add-Check "SEO" "OG image uses SplashLens asset" ($(if ($siteBody.Contains("https://splashlens.com/qa-splashlens-public-site-2026-05-27.png")) { "pass" } else { "fail" })) "og/screenshot asset"

$appJs = Get-Body "https://app.splashlens.com/js/app.js?heal=$cacheBust"
Add-Check "App restore" "restore UI shipped" ($(if ($appJs.Contains("Restore Pro from checkout email") -and $appJs.Contains("PARTSNAP_RESTORE_ENDPOINT")) { "pass" } else { "fail" })) "app.js restore strings"

if ($WriteReport) {
  New-Item -ItemType Directory -Path $reportDir -Force | Out-Null
  $lines = @()
  $lines += "# SplashLens Heal Report"
  $lines += ""
  $lines += "Generated: $stamp"
  $lines += ""
  $lines += "Result: $(if ($failures.Count -eq 0) { 'PASS' } else { 'FAIL' })"
  $lines += ""
  $lines += "| Surface | Check | Result | Evidence |"
  $lines += "|---|---|---|---|"
  foreach ($row in $rows) {
    $lines += "| $($row.Surface) | $($row.Check) | $($row.Result) | $($row.Evidence -replace '\|','/') |"
  }
  if ($failures.Count -gt 0) {
    $lines += ""
    $lines += "## Failures"
    foreach ($failure in $failures) { $lines += "- $failure" }
  }
  Set-Content -Path $reportPath -Value ($lines -join "`n") -Encoding UTF8
}

$rows | Format-Table -AutoSize | Out-String -Width 240

if ($failures.Count -gt 0) {
  Write-Error "SplashLens heal checks failed: $($failures -join '; ')"
}
