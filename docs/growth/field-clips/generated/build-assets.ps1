[CmdletBinding()]
param(
    [ValidateSet('all', '01', '02', '03')]
    [string]$Clip = 'all'
)

$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$CaptureDir = Join-Path $Root 'source-captures'
$FrameDir = Join-Path $Root 'frame-stills'
$BuildDir = Join-Path $Root '_build'

New-Item -ItemType Directory -Force -Path $FrameDir, $BuildDir | Out-Null
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Speech

$Colors = @{
    Ink = [Drawing.Color]::FromArgb(245, 7, 21, 33)
    Shade = [Drawing.Color]::FromArgb(194, 6, 19, 29)
    Aqua = [Drawing.Color]::FromArgb(255, 119, 226, 208)
    Orange = [Drawing.Color]::FromArgb(255, 255, 179, 107)
    White = [Drawing.Color]::White
}

function New-Font {
    param([float]$Size, [Drawing.FontStyle]$Style = [Drawing.FontStyle]::Regular)
    return New-Object Drawing.Font('Segoe UI', $Size, $Style, [Drawing.GraphicsUnit]::Pixel)
}

function Draw-TextBlock {
    param(
        [Drawing.Graphics]$Graphics,
        [string]$Text,
        [Drawing.RectangleF]$Bounds,
        [float]$Size,
        [Drawing.Color]$Color,
        [Drawing.FontStyle]$Style = [Drawing.FontStyle]::Regular,
        [Drawing.StringAlignment]$Alignment = [Drawing.StringAlignment]::Center
    )

    $font = New-Font -Size $Size -Style $Style
    $brush = New-Object Drawing.SolidBrush($Color)
    $format = New-Object Drawing.StringFormat
    try {
        $format.Alignment = $Alignment
        $format.LineAlignment = [Drawing.StringAlignment]::Center
        $format.Trimming = [Drawing.StringTrimming]::Word
        $Graphics.DrawString($Text, $font, $brush, $Bounds, $format)
    }
    finally {
        $format.Dispose()
        $brush.Dispose()
        $font.Dispose()
    }
}

function Fill-Box {
    param(
        [Drawing.Graphics]$Graphics,
        [Drawing.RectangleF]$Bounds,
        [Drawing.Color]$Color
    )
    $brush = New-Object Drawing.SolidBrush($Color)
    try { $Graphics.FillRectangle($brush, $Bounds) } finally { $brush.Dispose() }
}

function New-Frame {
    param(
        [hashtable]$Spec,
        [string]$Output
    )

    $sourcePath = Join-Path $CaptureDir $Spec.Source
    $source = [Drawing.Image]::FromFile($sourcePath)
    $bitmap = New-Object Drawing.Bitmap(1080, 1920, [Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $graphics = [Drawing.Graphics]::FromImage($bitmap)
    try {
        $graphics.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.TextRenderingHint = [Drawing.Text.TextRenderingHint]::ClearTypeGridFit
        $graphics.DrawImage($source, 0, 0, 1080, 1920)

        if ($Spec.Dark) {
            Fill-Box -Graphics $graphics -Bounds ([Drawing.RectangleF]::new(0, 0, 1080, 1920)) -Color $Colors.Shade
        }

        if ($Spec.Live) {
            Fill-Box -Graphics $graphics -Bounds ([Drawing.RectangleF]::new(56, 58, 300, 72)) -Color $Colors.Ink
            Draw-TextBlock -Graphics $graphics -Text 'LIVE PRODUCT' -Bounds ([Drawing.RectangleF]::new(68, 58, 276, 72)) -Size 32 -Color $Colors.Aqua -Style Bold
        }

        if ($Spec.Demo) {
            Fill-Box -Graphics $graphics -Bounds ([Drawing.RectangleF]::new(724, 58, 300, 72)) -Color $Colors.Ink
            Draw-TextBlock -Graphics $graphics -Text 'DEMO / TEST' -Bounds ([Drawing.RectangleF]::new(736, 58, 276, 72)) -Size 32 -Color $Colors.White -Style Bold
        }

        if ($Spec.Title) {
            $titleTop = if ($Spec.TitleTop) { [float]$Spec.TitleTop } else { 575 }
            $titleSize = if ($Spec.TitleSize) { [float]$Spec.TitleSize } else { 74 }
            $titleLines = @($Spec.Title)
            for ($i = 0; $i -lt $titleLines.Count; $i++) {
                $titleColor = if ($i -eq 1) { if ($Spec.Orange) { $Colors.Orange } else { $Colors.Aqua } } else { $Colors.White }
                Draw-TextBlock -Graphics $graphics -Text $titleLines[$i] -Bounds ([Drawing.RectangleF]::new(60, $titleTop + ($i * 100), 960, 100)) -Size $titleSize -Color $titleColor -Style Bold
            }
        }

        if ($Spec.Steps) {
            Fill-Box -Graphics $graphics -Bounds ([Drawing.RectangleF]::new(75, 390, 930, 760)) -Color $Colors.Ink
            for ($i = 0; $i -lt $Spec.Steps.Count; $i++) {
                $y = 470 + ($i * 205)
                Draw-TextBlock -Graphics $graphics -Text ([string]($i + 1)) -Bounds ([Drawing.RectangleF]::new(115, $y, 90, 100)) -Size 62 -Color $Colors.Aqua -Style Bold
                Draw-TextBlock -Graphics $graphics -Text $Spec.Steps[$i] -Bounds ([Drawing.RectangleF]::new(225, $y, 710, 100)) -Size 52 -Color $Colors.White -Style Bold -Alignment Near
            }
        }

        if ($Spec.Callout) {
            $calloutTop = if ($Spec.CalloutTop) { [float]$Spec.CalloutTop } else { 1260 }
            Fill-Box -Graphics $graphics -Bounds ([Drawing.RectangleF]::new(55, $calloutTop, 970, 245)) -Color $Colors.Ink
            Fill-Box -Graphics $graphics -Bounds ([Drawing.RectangleF]::new(55, $calloutTop, 10, 245)) -Color $Colors.Aqua
            Draw-TextBlock -Graphics $graphics -Text $Spec.Callout -Bounds ([Drawing.RectangleF]::new(95, $calloutTop + 24, 890, 90)) -Size 49 -Color $Colors.White -Style Bold
            if ($Spec.CalloutSub) {
                $subColor = if ($Spec.Orange) { $Colors.Orange } else { $Colors.Aqua }
                Draw-TextBlock -Graphics $graphics -Text $Spec.CalloutSub -Bounds ([Drawing.RectangleF]::new(95, $calloutTop + 115, 890, 85)) -Size 37 -Color $subColor
            }
        }

        if ($Spec.Cta) {
            Draw-TextBlock -Graphics $graphics -Text $Spec.Cta -Bounds ([Drawing.RectangleF]::new(60, 865, 960, 100)) -Size 54 -Color $Colors.White -Style Bold
        }

        if ($Spec.Disclosure) {
            Fill-Box -Graphics $graphics -Bounds ([Drawing.RectangleF]::new(55, 1030, 970, 390)) -Color $Colors.Ink
            Draw-TextBlock -Graphics $graphics -Text 'VERIFY BEFORE ACTING' -Bounds ([Drawing.RectangleF]::new(90, 1065, 900, 85)) -Size 46 -Color $Colors.Aqua -Style Bold
            Draw-TextBlock -Graphics $graphics -Text "Reference aid only. Verify the model, manual,`nmanufacturer guidance, and qualified judgment." -Bounds ([Drawing.RectangleF]::new(90, 1150, 900, 190)) -Size 34 -Color $Colors.White
        }

        Fill-Box -Graphics $graphics -Bounds ([Drawing.RectangleF]::new(55, 1610, 970, 240)) -Color $Colors.Ink
        Fill-Box -Graphics $graphics -Bounds ([Drawing.RectangleF]::new(55, 1610, 970, 7)) -Color $Colors.Aqua
        Draw-TextBlock -Graphics $graphics -Text $Spec.Caption -Bounds ([Drawing.RectangleF]::new(95, 1635, 890, 185)) -Size 41 -Color $Colors.White -Style Bold

        $bitmap.Save($Output, [Drawing.Imaging.ImageFormat]::Png)
    }
    finally {
        $graphics.Dispose()
        $bitmap.Dispose()
        $source.Dispose()
    }
}

function Invoke-FFmpeg {
    param([string[]]$Arguments)
    & ffmpeg -hide_banner -loglevel error -y @Arguments
    if ($LASTEXITCODE -ne 0) { throw "ffmpeg failed with exit code $LASTEXITCODE" }
}

function New-Narration {
    param([string]$Text, [string]$Output)
    $speaker = New-Object System.Speech.Synthesis.SpeechSynthesizer
    try {
        $speaker.SelectVoice('Microsoft Zira Desktop')
        $speaker.Rate = -1
        $speaker.Volume = 100
        $speaker.SetOutputToWaveFile($Output)
        $speaker.Speak($Text)
    }
    finally { $speaker.Dispose() }
}

function New-VideoScene {
    param([string]$Source, [double]$Duration, [string]$Output)
    $fadeOut = [Math]::Max(0, $Duration - 0.25).ToString('0.00', [Globalization.CultureInfo]::InvariantCulture)
    $filter = "scale=1080:1920:flags=lanczos,format=yuv420p,fade=t=in:st=0:d=0.2,fade=t=out:st=${fadeOut}:d=0.25"
    Invoke-FFmpeg -Arguments @('-loop', '1', '-i', $Source, '-t', $Duration.ToString([Globalization.CultureInfo]::InvariantCulture), '-vf', $filter, '-r', '30', '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-tune', 'stillimage', '-crf', '18', '-pix_fmt', 'yuv420p', $Output)
}

function New-Clip {
    param([string]$Slug, [array]$Frames, [string]$Narration, [double]$Duration)
    $sceneFiles = @()
    for ($i = 0; $i -lt $Frames.Count; $i++) {
        $frame = $Frames[$i]
        $framePath = Join-Path $FrameDir ("{0}-{1:00}.png" -f $Slug, ($i + 1))
        New-Frame -Spec $frame -Output $framePath
        $scenePath = Join-Path $BuildDir ("{0}-scene-{1:00}.mp4" -f $Slug, ($i + 1))
        New-VideoScene -Source $framePath -Duration $frame.Duration -Output $scenePath
        $sceneFiles += $scenePath
    }

    $concatPath = Join-Path $BuildDir "$Slug-concat.txt"
    $sceneFiles | ForEach-Object { "file '$($_.Replace("'", "''"))'" } | Set-Content -LiteralPath $concatPath -Encoding ascii
    $basePath = Join-Path $BuildDir "$Slug-base.mp4"
    Invoke-FFmpeg -Arguments @('-f', 'concat', '-safe', '0', '-i', $concatPath, '-c', 'copy', $basePath)

    $wavePath = Join-Path $BuildDir "$Slug-narration.wav"
    New-Narration -Text $Narration -Output $wavePath
    Invoke-FFmpeg -Arguments @('-i', $basePath, '-i', $wavePath, '-af', 'apad', '-t', $Duration.ToString([Globalization.CultureInfo]::InvariantCulture), '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', (Join-Path $Root "$Slug.mp4"))
}

$Part = 'live-partsnap-entry-538x957.png'
$Report = 'live-report-demo-review-538x957.png'

$Clip1 = @(
    @{ Source=$Part; Duration=4.5; Dark=$true; Demo=$true; Title=@('CAN SPLASHLENS','IDENTIFY THIS?'); Caption="Found a loose part?`nStart with proof, not a guess." },
    @{ Source=$Part; Duration=7.5; Live=$true; Demo=$true; Callout='1  FULL PART   2  LABEL / MARKING'; Caption="In PartSnap, capture the full part,`nthen the label or molded marking." },
    @{ Source=$Part; Duration=6.0; Live=$true; Demo=$true; Callout='VISIBLE CLUES'; CalloutSub='Organize what is present and what to check next.'; Caption="SplashLens can organize visible clues`nand suggest what to check next." },
    @{ Source=$Part; Duration=6.0; Live=$true; Demo=$true; Orange=$true; Callout='POSSIBLE MATCH'; CalloutSub='VERIFY BEFORE ORDERING'; Caption="Treat any match as possible until you verify the model,`nmanual, manufacturer guidance, and fitment." },
    @{ Source=$Part; Duration=6.0; Dark=$true; Live=$true; Title=@('NEXT PROOF.','NOT A CONFIDENT GUESS.'); TitleTop=500; TitleSize=60; Cta='splashlens.com'; Disclosure=$true; Caption='Try the workflow at splashlens.com.' }
)

$Clip2 = @(
    @{ Source=$Part; Duration=4.5; Dark=$true; Demo=$true; Orange=$true; Title=@('WOULD YOU ORDER','FROM ONE PHOTO?'); Caption='Would you order from one tight close-up?' },
    @{ Source=$Part; Duration=9.5; Dark=$true; Live=$true; Demo=$true; Steps=@('FULL ASSEMBLY','LABEL / MARKINGS','CONNECTION + SCALE'); Caption="Start with the full assembly, the label or markings,`nand the connection with a size reference." },
    @{ Source=$Part; Duration=7.5; Live=$true; Demo=$true; Callout='KEEP THE CLUES TOGETHER'; CalloutSub='Compare against the model and manual.'; Caption="SplashLens keeps those clues together for comparison`nagainst the model and manual." },
    @{ Source=$Report; Duration=4.0; Live=$true; Demo=$true; Callout='PACKAGE THE EVIDENCE'; CalloutSub='SEND PROOF, NOT A GUESS.'; Caption="Or send a cleaner request to a parts counter.`nSend proof, not a guess." },
    @{ Source=$Part; Duration=4.5; Dark=$true; Live=$true; Title=@('TEST THE PROOF','WORKFLOW FREE'); TitleTop=500; TitleSize=66; Cta='splashlens.com'; Disclosure=$true; Caption='Test the workflow at splashlens.com.' }
)

$Clip3 = @(
    @{ Source=$Report; Duration=4.5; Dark=$true; Demo=$true; Title=@('A CLEARER','SERVICE UPDATE'); Caption='Here is a DEMO / TEST service note.' },
    @{ Source=$Report; Duration=8.5; Live=$true; Demo=$true; Callout='OBSERVATION + PROOF'; CalloutSub='No fitment or diagnosis confirmed.'; Caption="Record what you observed and attach`nnon-sensitive photo names or proof notes." },
    @{ Source=$Report; Duration=8.5; Live=$true; Demo=$true; Callout='CUSTOMER-SAFE SUMMARY'; CalloutSub='Keep missing proof visible.'; Caption="Draft a customer-safe summary`nwhile the visit is still fresh." },
    @{ Source=$Report; Duration=5.0; Live=$true; Demo=$true; Callout='REVIEW. CORRECT. SHARE.'; CalloutSub='You own the final wording.'; Caption="Review the wording, correct anything unclear,`nand keep missing proof visible." },
    @{ Source=$Report; Duration=4.5; Dark=$true; Live=$true; Demo=$true; Title=@('YOU OWN THE','FINAL HANDOFF.'); TitleTop=520; TitleSize=64; Cta='splashlens.com'; Disclosure=$true; Caption='You own the final handoff. SplashLens is a reference aid.' }
)

if ($Clip -in @('all', '01')) {
    New-Clip -Slug '01-can-splashlens-identify-this' -Frames $Clip1 -Duration 30.0 -Narration 'Found a loose part? Start with proof, not a guess. In PartSnap, capture the full part, then the label or molded marking. SplashLens can organize visible clues and suggest what to check next. Treat any match as possible until you verify the model, manual, manufacturer guidance, and fitment. Try the workflow at splashlens.com.'
}
if ($Clip -in @('all', '02')) {
    New-Clip -Slug '02-proof-missing-before-ordering' -Frames $Clip2 -Duration 30.0 -Narration 'Would you order from one tight close-up? Start with three views: the full assembly, the label or molded markings, and the connection with a size reference. SplashLens keeps those clues together so you can compare them against the model and manual, or send a cleaner request to a parts counter. Send proof, not a guess. Test the workflow at splashlens.com.'
}
if ($Clip -in @('all', '03')) {
    New-Clip -Slug '03-clear-service-update' -Frames $Clip3 -Duration 31.0 -Narration 'Here is a demo test service note. Record what you observed, attach non-sensitive photo names or proof notes, then draft a customer-safe summary while the visit is still fresh. Before sharing, review the wording, correct anything that is unclear, and make sure missing proof stays visible. You remain responsible for the final handoff. SplashLens is a reference aid.'
}

Write-Host "Built SplashLens field clip selection: $Clip"
