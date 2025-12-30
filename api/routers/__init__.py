"""Flask blueprints for RF-Safety API."""
from routers.video import video_bp
from routers.inference import inference_bp

__all__ = ["video_bp", "inference_bp"]
