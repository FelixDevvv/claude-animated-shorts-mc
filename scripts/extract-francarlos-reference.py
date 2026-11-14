#!/usr/bin/env python3
"""Extract reusable Francarlos video-reference frames and a contact sheet.

Usage:
  python scripts/extract-francarlos-reference.py input.mp4
"""

from pathlib import Path
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFont


def run(cmd):
    subprocess.run(cmd, check=True)


def main():
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python scripts/extract-francarlos-reference.py input.mp4")

    video = Path(sys.argv[1])
    root = Path(__file__).resolve().parents[1]
    frames_dir = root / "references" / "frames"
    sheets_dir = root / "references" / "sheets"
    frames_dir.mkdir(parents=True, exist_ok=True)
    sheets_dir.mkdir(parents=True, exist_ok=True)

    # 12 evenly distributed points with a small safety margin.
    probe = subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(video)
    ], text=True).strip()
    duration = float(probe)
    times = [3 + i * max(0.1, duration - 6) / 11 for i in range(12)]

    paths = []
    for i, t in enumerate(times, 1):
        out = frames_dir / f"francarlos_{i:02d}.jpg"
        run([
            "ffmpeg", "-y", "-ss", f"{t:.3f}", "-i", str(video),
            "-frames:v", "1", "-vf", "scale=720:1280", "-q:v", "3", str(out)
        ])
        paths.append(out)

    thumb_w, thumb_h = 360, 640
    label_h = 40
    sheet = Image.new("RGB", (thumb_w * 4, (thumb_h + label_h) * 3), "white")

    for i, path in enumerate(paths):
        im = Image.open(path).convert("RGB").resize((thumb_w, thumb_h))
        x = (i % 4) * thumb_w
        y = (i // 4) * (thumb_h + label_h)
        sheet.paste(im, (x, y))
        ImageDraw.Draw(sheet).text(
            (x + 10, y + thumb_h + 10),
            f"Francarlos {i + 1:02d} — {times[i]:.1f}s",
            fill="black",
        )

    sheet.save(sheets_dir / "francarlos_sheet.jpg", quality=88, optimize=True)


if __name__ == "__main__":
    main()
