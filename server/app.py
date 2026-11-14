import os
import sys
from pathlib import Path
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from server.config import PORT, DEBUG, DATABASE_PATH
from server.routes.stats import stats_bp
from server.routes.objects import objects_bp
from server.routes.missions import missions_bp
from server.routes.stories import stories_bp
from server.routes.quiz import quiz_bp

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}, r"/static/*": {"origins": "*"}})
    
    # Register blueprints
    app.register_blueprint(stats_bp, url_prefix="/api")
    app.register_blueprint(objects_bp, url_prefix="/api")
    app.register_blueprint(missions_bp, url_prefix="/api")
    app.register_blueprint(stories_bp, url_prefix="/api")
    app.register_blueprint(quiz_bp, url_prefix="/api")
    
    # Serve offline downloaded NASA media
    @app.route("/static/media/<path:filename>", methods=["GET"])
    def serve_media(filename):
        media_folder = BASE_DIR / "static" / "media"
        return send_from_directory(media_folder, filename, max_age=86400)
    
    @app.route("/api/health", methods=["GET"])
    def health_check():
        db_exists = os.path.exists(DATABASE_PATH)
        return jsonify({
            "status": "online",
            "service": "Echoes of Space REST API",
            "database_ready": db_exists,
            "version": "1.0.0"
        })
        
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Internal server error"}), 500
        
    return app

if __name__ == "__main__":
    app = create_app()
    print(f"🚀 [Echoes of Space API] Listening on http://127.0.0.1:{PORT}")
    app.run(host="0.0.0.0", port=PORT, debug=DEBUG)
