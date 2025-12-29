"""Video upload & streaming service."""
import time
import cv2
import numpy as np
from typing import Optional, Generator


class VideoService:
    """Service for video file upload and streaming."""
    
    def __init__(self):
        self._cap: Optional[cv2.VideoCapture] = None
        self._current_source: Optional[str] = None
        self._current_frame: Optional[np.ndarray] = None
        self._frame_count: int = 0
        self._is_streaming: bool = False
        self._fps: float = 30.0
    
    @property
    def is_streaming(self) -> bool:
        """Check if video is currently streaming."""
        return self._is_streaming and self._cap is not None
    
    @property
    def current_source(self) -> Optional[str]:
        """Get current video file path."""
        return self._current_source
    
    @property
    def frame_count(self) -> int:
        """Get total frames processed."""
        return self._frame_count
    
    @property
    def current_frame(self) -> Optional[np.ndarray]:
        """Get the current video frame."""
        return self._current_frame
    
    def set_source(self, filepath: str) -> None:
        """
        Set the video source from an uploaded file.
        
        Args:
            filepath: Path to the uploaded video file
        """
        # Stop existing stream if any
        self.stop()
        
        # Open video file with OpenCV
        self._cap = cv2.VideoCapture(filepath)
        
        if not self._cap.isOpened():
            self._cap = None
            raise ValueError(f"Failed to open video file: {filepath}")
        
        # Get video FPS (default to 30 if not available)
        self._fps = self._cap.get(cv2.CAP_PROP_FPS) or 30.0
        
        self._current_source = filepath
        self._is_streaming = True
        self._frame_count = 0
        
        # Read first frame to verify
        ret, frame = self._cap.read()
        if not ret or frame is None:
            self.stop()
            raise ValueError("Failed to read from video file")
        
        self._current_frame = frame
    
    def stop(self) -> None:
        """Stop the video stream and release resources."""
        if self._cap is not None:
            self._cap.release()
            self._cap = None
        
        self._is_streaming = False
        self._current_source = None
        self._current_frame = None
        self._frame_count = 0
    
    def read_frame(self) -> Optional[np.ndarray]:
        """Read the next frame from the video file."""
        if not self.is_streaming or self._cap is None:
            return None
        
        ret, frame = self._cap.read()
        
        if not ret or frame is None:
            # End of video - loop back to start
            self._cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            ret, frame = self._cap.read()
            if not ret or frame is None:
                return None
        
        self._current_frame = frame
        self._frame_count += 1
        
        return frame
    
    def get_current_frame_jpeg(self) -> bytes:
        """Get current frame encoded as JPEG."""
        if self._current_frame is None:
            raise ValueError("No frame available")
        
        _, buffer = cv2.imencode(".jpg", self._current_frame)
        return buffer.tobytes()
    
    def generate_frames(self) -> Generator[bytes, None, None]:
        """
        Generate MJPEG frames for streaming.
        
        Yields:
            JPEG encoded frame bytes with MJPEG boundary headers
        """
        while self.is_streaming:
            frame = self.read_frame()
            
            if frame is None:
                time.sleep(0.01)
                continue
            
            # Encode frame as JPEG
            _, buffer = cv2.imencode(".jpg", frame)
            frame_bytes = buffer.tobytes()
            
            # Yield with MJPEG boundary
            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n"
            )
            
            # Control frame rate based on video FPS
            time.sleep(1.0 / self._fps)


# Singleton instance
_video_service: Optional[VideoService] = None


def get_video_service() -> VideoService:
    """Get or create the video service singleton."""
    global _video_service
    if _video_service is None:
        _video_service = VideoService()
    return _video_service
