import httpx
import numpy as np
from typing import Optional
import io

try:
    from PIL import Image
    import cv2
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False


async def fetch_image(url: str) -> Optional[np.ndarray]:
    """Download an image from a URL and convert to numpy array."""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            if PIL_AVAILABLE:
                img = Image.open(io.BytesIO(response.content)).convert("RGB")
                return np.array(img)
    except Exception:
        return None
    return None


def detect_tampering(image: np.ndarray) -> bool:
    """
    Simple tamper detection using ELA (Error Level Analysis) concept.
    Returns True if tampering is likely detected.
    """
    if not PIL_AVAILABLE or image is None:
        return False
    try:
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        # High variance in Laplacian can indicate splicing/tampering
        return bool(laplacian_var > 5000)
    except Exception:
        return False


def estimate_progress(before: Optional[np.ndarray], after: Optional[np.ndarray]) -> float:
    """
    Estimate construction progress by comparing before/after images.
    Uses structural similarity or pixel difference baseline.
    Returns progress as 0-100.
    """
    if before is None or after is None:
        return 0.0
    try:
        # Resize to same dimensions
        h, w = min(before.shape[0], after.shape[0]), min(before.shape[1], after.shape[1])
        b = cv2.resize(before, (w, h))
        a = cv2.resize(after, (w, h))

        diff = cv2.absdiff(b, a)
        change_ratio = np.mean(diff) / 255.0
        # Map change_ratio to 0-100 progress estimate
        return round(min(change_ratio * 300, 100.0), 2)
    except Exception:
        return 0.0


def compute_similarity(img1: Optional[np.ndarray], img2: Optional[np.ndarray]) -> Optional[float]:
    """Compute normalized cross-correlation between two images."""
    if img1 is None or img2 is None:
        return None
    try:
        h, w = min(img1.shape[0], img2.shape[0]), min(img1.shape[1], img2.shape[1])
        a = cv2.resize(img1, (w, h)).astype(float)
        b = cv2.resize(img2, (w, h)).astype(float)
        numerator = np.sum(a * b)
        denominator = np.sqrt(np.sum(a**2) * np.sum(b**2))
        if denominator == 0:
            return 0.0
        return round(float(numerator / denominator), 4)
    except Exception:
        return None


async def analyze_images(
    ticket_id: str,
    image_url: str,
    proof_url: Optional[str] = None,
) -> dict:
    """
    Main analysis pipeline.
    - Detects tampering in the original image
    - Estimates work progress if proof image provided
    - Computes similarity index
    - Returns ai_score (0-100) based on all signals
    """
    original = await fetch_image(image_url)
    proof = await fetch_image(proof_url) if proof_url else None

    tamper_flag = detect_tampering(original)
    progress_estimate = estimate_progress(original, proof)
    similarity_index = compute_similarity(original, proof)

    # Scoring logic
    base_score = 100.0
    if tamper_flag:
        base_score -= 40
    if proof is None:
        base_score -= 20
    base_score = max(0.0, min(base_score, 100.0))

    return {
        "ticket_id": ticket_id,
        "ai_score": round(base_score, 2),
        "tamper_flag": tamper_flag,
        "progress_estimate": progress_estimate,
        "similarity_index": similarity_index,
        "details": {
            "has_original": original is not None,
            "has_proof": proof is not None,
            "libraries_available": PIL_AVAILABLE,
        },
    }
