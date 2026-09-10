"""Decode supported user uploads into RGB images for model inference."""

from __future__ import annotations

from dataclasses import dataclass
from io import BytesIO
from pathlib import Path

import pymupdf
from PIL import Image, ImageOps, UnidentifiedImageError

SUPPORTED_EXTENSIONS = {".svg", ".png", ".jpg", ".jpeg", ".pdf"}
MAX_DECODED_PIXELS = 25_000_000
MAX_PDF_PAGES = 1
PDF_RENDER_DPI = 150


@dataclass(frozen=True)
class DecodedRaster:
    """A decoded RGB page/image and the source classification used for it."""

    image: Image.Image
    source_type: str


def extension_for_upload(filename: str | None) -> str:
    extension = Path(filename or "").suffix.lower()
    if extension not in SUPPORTED_EXTENSIONS:
        supported = ", ".join(sorted(SUPPORTED_EXTENSIONS))
        raise ValueError(f"unsupported file type; use {supported}")
    return extension


def _validate_dimensions(image: Image.Image) -> None:
    width, height = image.size
    if width <= 0 or height <= 0:
        raise ValueError("image has invalid dimensions")
    if width * height > MAX_DECODED_PIXELS:
        raise ValueError(
            f"decoded image is too large; maximum is {MAX_DECODED_PIXELS:,} pixels"
        )


def _decode_image(raw: bytes) -> Image.Image:
    try:
        with Image.open(BytesIO(raw)) as source:
            _validate_dimensions(source)
            # Correct camera rotation before converting. RGB also composites away
            # palette/alpha modes so inference always receives three channels.
            image = ImageOps.exif_transpose(source).convert("RGB")
            image.load()
            return image.copy()
    except (UnidentifiedImageError, OSError) as exc:
        raise ValueError("invalid or unreadable raster image") from exc


def _decode_pdf(raw: bytes) -> DecodedRaster:
    try:
        document = pymupdf.open(stream=raw, filetype="pdf")
    except (pymupdf.FileDataError, ValueError) as exc:
        raise ValueError("invalid or unreadable PDF") from exc

    try:
        if document.page_count != MAX_PDF_PAGES:
            raise ValueError("PDF uploads must contain exactly one page")
        page = document.load_page(0)
        drawings = page.get_drawings()
        embedded_images = page.get_images(full=True)
        source_type = "vector PDF" if drawings and not embedded_images else "scanned PDF"

        scale = PDF_RENDER_DPI / 72.0
        matrix = pymupdf.Matrix(scale, scale)
        pixmap = page.get_pixmap(matrix=matrix, alpha=False)
        if pixmap.width * pixmap.height > MAX_DECODED_PIXELS:
            raise ValueError(
                f"rendered PDF page is too large; maximum is {MAX_DECODED_PIXELS:,} pixels"
            )
        image = Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples)
        return DecodedRaster(image=image, source_type=source_type)
    finally:
        document.close()


def decode_raster_upload(raw: bytes, extension: str) -> DecodedRaster:
    """Decode PNG/JPEG/PDF bytes into an RGB image.

    SVG is intentionally excluded: its existing XML filtering and CairoSVG path
    must remain the canonical behavior for SVG uploads.
    """
    if extension in {".png", ".jpg", ".jpeg"}:
        return DecodedRaster(image=_decode_image(raw), source_type="raster image")
    if extension == ".pdf":
        return _decode_pdf(raw)
    raise ValueError(f"raster decoder does not handle {extension}")


def encode_preview(image: Image.Image, size: tuple[int, int]) -> str:
    """Resize an RGB image to (W, H) and return a PNG data payload."""
    from base64 import b64encode

    preview = image.resize(size, Image.Resampling.LANCZOS)
    output = BytesIO()
    preview.save(output, format="PNG", optimize=True)
    return b64encode(output.getvalue()).decode("ascii")
