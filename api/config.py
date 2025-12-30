"""Environment & settings configuration."""
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Application configuration loaded from environment variables."""

    # Roboflow API
    ROBOFLOW_PRIVATE_API_KEY: str = os.getenv("ROBOFLOW_PRIVATE_API_KEY", "")
    ROBOFLOW_PUBLIC_API_KEY: str = os.getenv("ROBOFLOW_PUBLIC_API_KEY", "")
    ROBOFLOW_WORKSPACE_NAME: str = os.getenv("ROBOFLOW_WORKSPACE_NAME", "")
    ROBOFLOW_WORKFLOW_ID: str = os.getenv("ROBOFLOW_WORKFLOW_ID", "")

    # Upload settings
    MAX_CONTENT_LENGTH: int = 500 * 1024 * 1024  # 500MB
    UPLOAD_FOLDER: str = os.path.join(os.path.dirname(__file__), "uploads")

config = Config()

