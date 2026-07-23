# SplashLens Field Clips 01-03

Three publish-ready vertical MP4 demos built from current production screenshots captured from `https://app.splashlens.com/` on 2026-07-23.

## Honesty and privacy notes

- The PartSnap screen is the current live production interface. No identification result, fitment, diagnosis, accuracy, customer, partner, or outcome is represented.
- The Report screen is the current live production interface populated locally with clearly marked `DEMO / TEST` text and synthetic filenames. No customer record was loaded, saved, exported, or shared.
- The narration intentionally removes unsupported time-saved language from the source scripts.
- Every clip includes the reference-aid and verification boundary on its end card.
- Source captures contain no customer names, addresses, serial numbers, invoices, or private service records.
- Audio is locally synthesized with the installed Microsoft Zira Desktop voice. There is no music or third-party audio.

## Deliverables

- `01-can-splashlens-identify-this.mp4` - PartSnap proof-first attempt, 30 seconds.
- `02-proof-missing-before-ordering.mp4` - three-view evidence habit, 30 seconds.
- `03-clear-service-update.mp4` - `DEMO / TEST` report review, 31 seconds.
- Matching `.srt` files provide editable/uploadable companion captions; the same text is burned into the video frames.
- `source-captures/` contains the two live production PNG captures used by the videos.
- `frame-stills/` contains the final 1080x1920 captioned frames assembled into each MP4.
- `verification/` contains contact sheets extracted from the encoded MP4 files.

## Rebuild and export

From this directory in PowerShell:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\build-assets.ps1
```

To rebuild one clip only, use `-Clip 01`, `-Clip 02`, or `-Clip 03`.

The script uses local Windows `System.Drawing`, `System.Speech`, and `ffmpeg`. It renders the captioned PNG frames, synthesizes narration, and exports H.264/AAC MP4 with `+faststart`, `yuv420p`, 1080x1920 pixels, and 30 fps.

Exact single-file verification command:

```powershell
ffprobe -v error -show_entries stream=index,codec_name,codec_type,width,height,r_frame_rate:format=duration,size -of json .\01-can-splashlens-identify-this.mp4
```

Optional platform re-export without changing composition:

```powershell
ffmpeg -i .\01-can-splashlens-identify-this.mp4 -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -profile:v high -level 4.1 -c:a aac -b:a 192k -ar 48000 -movflags +faststart .\01-can-splashlens-identify-this-social.mp4
```

Replace the input and output basename for clips 02 and 03.
