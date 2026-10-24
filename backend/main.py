import re
import shutil
import subprocess
import tempfile
from pathlib import Path
from urllib.parse import urlparse

import requests
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from instagrapi import Client
from pydantic import BaseModel, HttpUrl
from starlette.background import BackgroundTask

app = FastAPI(title="Instagram Audio Downloader")


class ExtractRequest(BaseModel):
    url: HttpUrl


def validate_reel_url(url: str) -> str:
    parsed = urlparse(url)

    if parsed.scheme != "https":
        raise HTTPException(400, "Use an HTTPS Instagram URL.")

    if parsed.hostname not in {"instagram.com", "www.instagram.com"}:
        raise HTTPException(400, "Only Instagram URLs are accepted.")

    if not re.match(r"^/(reel|reels|p)/[^/]+/?$", parsed.path):
        raise HTTPException(400, "Please enter a valid Reel URL.")

    return url


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/extract")
def extract_audio(body: ExtractRequest):
    url = validate_reel_url(str(body.url))
    temp_dir = Path(tempfile.mkdtemp(prefix="ig-audio-"))

    try:
        client = Client()
        media_pk = client.media_pk_from_url(url)
        media = client.media_info(media_pk)

        video_url = getattr(media, "video_url", None)

        if not video_url:
            raise HTTPException(
                422,
                "No accessible video was found for this Reel."
            )

        parsed = urlparse(str(video_url))
        hostname = (parsed.hostname or "").lower()

        allowed_domains = (
            "cdninstagram.com",
            "fbcdn.net",
        )

        is_allowed_host = any(
            hostname == domain or hostname.endswith("." + domain)
            for domain in allowed_domains
        )

        if parsed.scheme != "https" or not is_allowed_host:
            print(f"Rejected media hostname: {hostname}")
            raise HTTPException(
                status_code=422,
                detail="Instagram returned an unsupported media URL."
            )

        video_path = temp_dir / "input.mp4"
        audio_path = temp_dir / "audio.mp3"

        with requests.get(
            str(video_url),
            stream=True,
            timeout=(10, 30),
        ) as response:
            response.raise_for_status()

            total = 0
            max_bytes = 100 * 1024 * 1024

            with video_path.open("wb") as output:
                for chunk in response.iter_content(64 * 1024):
                    if not chunk:
                        continue

                    total += len(chunk)

                    if total > max_bytes:
                        raise HTTPException(413, "Video exceeds 100 MB.")

                    output.write(chunk)

        subprocess.run(
            [
                "ffmpeg",
                "-nostdin",
                "-hide_banner",
                "-loglevel", "error",
                "-i", str(video_path),
                "-map", "0:a:0",
                "-vn",
                "-c:a", "libmp3lame",
                "-q:a", "2",
                "-y",
                str(audio_path),
            ],
            check=True,
            capture_output=True,
            timeout=120,
        )

        if not audio_path.exists() or audio_path.stat().st_size == 0:
            raise HTTPException(422, "No audio track was found.")

        return FileResponse(
            path=audio_path,
            media_type="audio/mpeg",
            filename="instagram-audio.mp3",
            background=BackgroundTask(
                shutil.rmtree, temp_dir, ignore_errors=True
            ),
        )

    except HTTPException:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise

    except subprocess.TimeoutExpired:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(504, "Audio conversion timed out.")

    except Exception:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(
            422,
            "Could not retrieve this Reel. It may be unavailable, "
            "or Instagram may require authentication."
        )