#!/usr/bin/env bash
set -euo pipefail

# Generate high-contrast portal logo assets (SVG -> PNG/ICO) for site UI + favicon.
# Requires ImageMagick `convert` available at /opt/homebrew/bin/convert (checked below).

command -v convert >/dev/null 2>&1 || { echo "ImageMagick 'convert' is required" >&2; exit 1; }

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="${SCRIPT_DIR%/scripts}"
cd "$ROOT_DIR"

SRC_DARK="public/media/logo-portal/portal-dark.svg"
SRC_TRANSPARENT="public/media/logo-portal/portal-transparent.svg"
OUT_DIR="public/media/favicon-formats"
BRAND_DIR="public/media/logo-portal"

mkdir -p "$OUT_DIR" "$BRAND_DIR"

sizes=(512 256 192 180 128 64 48 32 16)

render_pngs() {
  local src="$1" prefix="$2"
  for size in "${sizes[@]}"; do
    convert "$src" -resize "${size}x${size}" "$BRAND_DIR/${prefix}-${size}.png"
  done
}

render_pngs "$SRC_DARK" "portal-dark"
render_pngs "$SRC_TRANSPARENT" "portal-transparent"

# Multi-size ICO for favicons (transparent version for flexibility across themes)
convert \
  "$BRAND_DIR/portal-transparent-16.png" \
  "$BRAND_DIR/portal-transparent-32.png" \
  "$BRAND_DIR/portal-transparent-48.png" \
  "$BRAND_DIR/portal-transparent-64.png" \
  "$OUT_DIR/favicon.ico"

# Key favicon sizes (transparent variant for broad contrast)
cp "$BRAND_DIR/portal-transparent-32.png" "$OUT_DIR/favicon-32x32.png"
cp "$BRAND_DIR/portal-transparent-16.png" "$OUT_DIR/favicon-16x16.png"
cp "$BRAND_DIR/portal-transparent-180.png" "$OUT_DIR/apple-touch-icon.png"
cp "$BRAND_DIR/portal-transparent-192.png" "$OUT_DIR/android-chrome-192x192.png"
cp "$BRAND_DIR/portal-transparent-512.png" "$OUT_DIR/android-chrome-512x512.png"

# Keep a dark-card preview for UI spots needing a filled background
template_dark_card="$BRAND_DIR/portal-dark-512.png"
ln -sf "$(basename "$template_dark_card")" "$BRAND_DIR/portal-dark-card.png"

echo "Generated portal icons in $OUT_DIR and $BRAND_DIR" >&2
