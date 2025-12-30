"""Inference endpoints for running Roboflow workflow on videos."""
import os
from flask import Blueprint, jsonify, request, Response, send_file

from services.inference_service import get_inference_service
from services.video_service import get_video_service

inference_bp = Blueprint("inference", __name__)


@inference_bp.route("/run", methods=["POST"])
def run_inference():
    """
    Run Roboflow workflow inference on the currently uploaded video.
    
    Returns:
        JSON with inference status and output video path
    """
    video_service = get_video_service()
    
    if not video_service.current_source:
        return jsonify({"error": "No video uploaded. Please upload a video first."}), 400
    
    video_path = video_service.current_source
    
    # Stop the current stream while processing
    video_service.stop()
    
    try:
        # Run the workflow inference on the user uploaded video and set the output source
        inference_service = get_inference_service()
        output_path = inference_service.run_workflow_inference(video_path)
        video_service.set_source(output_path)
        
        return jsonify({
            "status": "completed",
            "output_path": output_path,
            "is_streaming": True,
            "message": "Inference completed. Streaming processed video.",
        })
    except Exception as e:
        return jsonify({"error": f"Inference failed: {str(e)}"}), 500