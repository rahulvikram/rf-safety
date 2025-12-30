from inference import InferencePipeline
from supervision.draw.utils import calculate_optimal_line_thickness, calculate_optimal_text_scale
import cv2
import os
import shutil
import uuid

import config

class InferenceService:
    def __init__(self):
        self.frames_dir = os.path.join(config.UPLOAD_FOLDER, "frames")
        self.frame_count = 0

    def sink(self, result, video_frame) -> None:
        os.makedirs(self.frames_dir, exist_ok=True)

        if result.get("label_visualization"):  # Save an frame from the workflow response
            frame = result["label_visualization"].numpy_image
            frame_path = os.path.join(self.frames_dir, f"frame_{self.frame_count:06d}.jpg")
            cv2.imwrite(frame_path, frame)
            self.frame_count += 1
        
        # TODO: Do something with the predictions of each frame
        print(result)
    
    # Dynamically gets the resolution and fps of a video for inference capture
    def get_video_metadata(self, video_path) -> tuple[tuple[int, int], int]:
        cap = cv2.VideoCapture(video_path)

        # Get the first frame to get the resolution, and fps
        ret, frame = cap.read()
        if not ret or frame is None:
            raise ValueError(f"Failed to read frame from video {video_path}")
        fps = cap.get(cv2.CAP_PROP_FPS)
        cap.release()

        height, width = frame.shape[:2]
        return (width, height), fps
    
    # Run the workflow inference
    def run_workflow_inference(self, video_path) -> str:
        resolution, fps = self.get_video_metadata(video_path)

        pipeline = InferencePipeline.init_with_workflow(
            api_key=config.ROBOFLOW_PRIVATE_API_KEY,
            workspace_name=config.ROBOFLOW_WORKSPACE_NAME,
            workflow_id=config.ROBOFLOW_WORKFLOW_ID,
            video_reference=video_path,
            max_fps=30,
            on_prediction=self.sink,
            workflows_parameters={
                "bounding_box_thickness": calculate_optimal_line_thickness(resolution),
                "text_thickness": 1,
                "text_scale": 1.1 * calculate_optimal_text_scale(resolution),
                "confidence": 0.2,
                "class_filter": ["car", "person", "crosswalk", "sign"]
            }
        )

        pipeline.run()
        pipeline.join()

        # Save the compiled video
        output_path = os.path.join(config.UPLOAD_FOLDER, f"inference_{uuid.uuid4()}.mp4")
        self._compile_frames_into_video(output_path, fps, resolution)

        return output_path

    # Compile all frames into a final video
    def _compile_frames_into_video(self, output_path, fps, resolution) -> None:
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        writer = cv2.VideoWriter(output_path, fourcc, fps, resolution)

        # Loop through all saved frames and write them to the video
        for i in range(self.frame_count):
            frame_path = os.path.join(self.frames_dir, f"frame_{i:06d}.jpg")
            frame = cv2.imread(frame_path)
            writer.write(frame)

        # Release the video writer and clear the frames directory
        writer.release()
        shutil.rmtree(self.frames_dir)
        self.frame_count = 0

        print(f"Compiled frames into video at {output_path}")