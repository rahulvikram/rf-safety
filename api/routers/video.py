"""Video streaming endpoints."""
import os
import uuid
from flask import Blueprint, jsonify, request, Response, current_app
from werkzeug.utils import secure_filename

from ..services.video_service import get_video_service

video_bp = Blueprint("video", __name__)

# Allowed video extensions
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv', 'webm'}

def allowed_file(filename: str) -> bool:
    """Check if file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@video_bp.route("/upload", methods=["POST"])
def upload_video():
    """
    Upload a video file for processing.
    
    Request: multipart/form-data with 'file' field containing the video
    
    Returns:
        JSON with upload status and video_id
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if not allowed_file(file.filename):
        return jsonify({
            "error": f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        }), 400
    
    try:
        # Generate unique filename
        filename = secure_filename(file.filename)
        video_id = str(uuid.uuid4())
        ext = filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{video_id}.{ext}"
        
        # Ensure uploads directory exists
        upload_dir = os.path.join(os.path.dirname(__file__), '..', 'uploads')
        os.makedirs(upload_dir, exist_ok=True)
        
        # Save the file
        filepath = os.path.join(upload_dir, unique_filename)
        file.save(filepath)
        
        # Start streaming from the uploaded file
        service = get_video_service()
        service.set_source(filepath)
        
        return jsonify({
            "status": "uploaded",
            "video_id": video_id,
            "filename": unique_filename,
            "is_streaming": True,
        })
    except Exception as e:
        return jsonify({"error": f"Failed to upload video: {str(e)}"}), 500

@video_bp.route("/stream", methods=["GET"])
def stream_video():
    """
    Stream video frames as MJPEG.
    
    Returns a continuous stream of JPEG frames for display in browser.
    """
    service = get_video_service()
    
    if not service.is_streaming:
        return jsonify({"error": "No active video stream"}), 400
    
    return Response(
        service.generate_frames(),
        mimetype="multipart/x-mixed-replace; boundary=frame",
    )


@video_bp.route("/frame", methods=["GET"])
def get_current_frame():
    """Get the current video frame as a JPEG image."""
    service = get_video_service()
    
    if not service.is_streaming:
        return jsonify({"error": "No active video stream"}), 400
    
    try:
        frame_bytes = service.get_current_frame_jpeg()
        return Response(frame_bytes, mimetype="image/jpeg")
    except Exception as e:
        return jsonify({"error": f"Failed to get frame: {str(e)}"}), 500


@video_bp.route("/status", methods=["GET"])
def get_video_status():
    """Get current video stream status."""
    service = get_video_service()
    return jsonify({
        "is_streaming": service.is_streaming,
        "source_url": service.current_source,
        "frame_count": service.frame_count,
    })

