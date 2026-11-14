from flask import Blueprint, jsonify, request
from server.database import get_db

stories_bp = Blueprint("stories", __name__)

@stories_bp.route("/stories/<object_id>", methods=["GET"])
def get_object_stories(object_id):
    conn = get_db()
    cursor = conn.cursor()
    
    rows = cursor.execute("""
        SELECT stage, title, body, kid_body
        FROM stories
        WHERE object_id = ?
        ORDER BY CASE stage
            WHEN 'intro' THEN 1
            WHEN 'before' THEN 2
            WHEN 'journey' THEN 3
            WHEN 'purpose' THEN 4
            WHEN 'final_moment' THEN 5
            WHEN 'after' THEN 6
            WHEN 'legacy' THEN 7
            ELSE 8
        END
    """, (object_id,)).fetchall()
    
    conn.close()
    return jsonify([dict(r) for r in rows])
