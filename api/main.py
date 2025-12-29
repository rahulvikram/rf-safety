"""Flask entry point for RF-Safety API."""
import os
from flask import Flask, jsonify
from flask_cors import CORS

from routers.video import video_bp

def create_app() -> Flask:
    """Create and configure the Flask application."""
    app = Flask(__name__)
    
    # Configuration
    app.config["DEBUG"] = os.getenv("DEBUG", "false").lower() == "true"
    app.config["MAX_CONTENT_LENGTH"] = 500 * 1024 * 1024  # 500MB max upload
    
    # Configure CORS
    CORS(
        app,
        origins=["http://localhost:3000", "http://localhost:5173"],
        supports_credentials=True,
    )
    
    # Register blueprints
    app.register_blueprint(video_bp, url_prefix="/api/video")
    
    # Health check routes
    @app.route("/", methods=["GET"])
    def root():
        """Root endpoint - API health check."""
        return jsonify({
            "status": "healthy",
            "app": "RF-Safety API",
            "version": "1.0.0",
        })
    
    @app.route("/health", methods=["GET"])
    def health_check():
        """Health check endpoint."""
        return jsonify({"status": "ok"})
    
    print("RF-Safety API starting up...")
    
    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        debug=app.config["DEBUG"],
    )

