from inference import InferencePipeline
from supervision.draw.utils import calculate_optimal_line_thickness, calculate_optimal_text_scale
import cv2
import os
import shutil
import uuid
from typing import Optional, Generator
import json

from config import config_object

class InferenceService:
    def __init__(self):
        self.frames_dir = os.path.join(config_object.UPLOAD_FOLDER, "frames")
        self.frame_count = 0
        self.inference_results = []

    def sink(self, result, video_frame) -> None:
        if result.get("label_visualization"):  # Save a frame from the workflow response
            frame = result["label_visualization"].numpy_image
            frame_path = os.path.join(self.frames_dir, f"frame_{self.frame_count:06d}.jpg")
            cv2.imwrite(frame_path, frame)
            self.frame_count += 1

        # Extract only JSON-serializable data from the result
        serializable_result = {}
        for key, value in result.items():
            # Skip WorkflowImageData and other non-serializable types
            if hasattr(value, 'numpy_image'):  # This is a WorkflowImageData object
                continue
            try:
                # Try to check if it's serializable
                json.dumps(value)
                serializable_result[key] = value
            except (TypeError, ValueError):
                # Skip non-serializable values
                continue  

        self.inference_results.append(serializable_result)
    
    # Dynamically gets the resolution of a video for inference capture
    def get_video_metadata(self, video_path) -> tuple[tuple[int, int], int]:
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)

        # Get the first frame to get the resolution
        ret, frame = cap.read()
        if not ret or frame is None:
            cap.release()
            raise ValueError(f"Failed to read frame from video {video_path}")
        cap.release()

        height, width = frame.shape[:2]
        return (width, height), int(fps) if fps > 0 else 30
    
    # Run the workflow inference
    def run_workflow_inference(self, video_path):
        # Clear the frames directory if it exists before inference
        if os.path.exists(self.frames_dir):
            shutil.rmtree(self.frames_dir)
        # Create the frames directory if it does not exist
        os.makedirs(self.frames_dir, exist_ok=True)
        # Reset frame count before starting inference
        self.frame_count = 0

        resolution, fps = self.get_video_metadata(video_path)
        pipeline = InferencePipeline.init_with_workflow(
            api_key=config_object.ROBOFLOW_PRIVATE_API_KEY,
            workspace_name=config_object.ROBOFLOW_WORKSPACE_NAME,
            workflow_id=config_object.ROBOFLOW_WORKFLOW_ID,
            video_reference=video_path,
            max_fps=fps,
            on_prediction=self.sink,
            workflows_parameters={
                "class_filter": ["road", "car", "stop sign"],
                "confidence": 0.1
            }
        )

        pipeline.start()
        pipeline.join()

        # Save the compiled video
        output_path = os.path.join(config_object.UPLOAD_FOLDER, f"inference_{uuid.uuid4()}.mp4")
        self._compile_frames_into_video(output_path, fps, resolution)

        return output_path, self.inference_results

    # Compile all frames into a final video
    def _compile_frames_into_video(self, output_path, fps, resolution) -> None:
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        writer = cv2.VideoWriter(output_path, fourcc, fps, resolution)

        # Loop through all saved frames and write them to the video
        for i in range(self.frame_count):
            frame_path = os.path.join(self.frames_dir, f"frame_{i:06d}.jpg")
            frame = cv2.imread(frame_path)
            writer.write(frame)

        # Release the video writer and reset the frame count
        writer.release()
        self.frame_count = 0

        print(f"Compiled frames into video at {output_path}")

# Singleton instance
_inference_service: Optional[InferenceService] = None


def get_inference_service() -> InferenceService:
    """Get or create the inference service singleton."""
    global _inference_service
    if _inference_service is None:
        _inference_service = InferenceService()
    return _inference_service
