# FastCompress Pro

Three-step video compression website: Video → Method → Download.

## Deploy on Render
1. Extract this ZIP and upload the project files to a GitHub repository.
2. In Render, choose **New → Blueprint** and connect the repository. Render reads `render.yaml` and builds the Docker service.
3. Wait for deployment, then open the Render URL.

## Features
- Upload MP4, MOV, MKV, WebM and M4V
- High Quality, Balanced and Smaller File presets
- FFmpeg H.264 MP4 output
- Does not force a new frame rate or resolution
- Shows original/output file size and reported FPS

## Important
The project is built but not published to your Render account. A live public service still needs deployment. The `UP TO 100x FASTER` marketing claim is intentionally not used because speed depends on the server and video. Render free instances may sleep or run out of CPU/memory/disk on large videos. Add authentication, rate limits, storage cleanup and persistent job handling before public production use. Re-encoding can reduce visual quality; exact original quality and smaller file size cannot both be guaranteed.
