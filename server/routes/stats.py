from flask import Blueprint, jsonify
from server.database import get_db

stats_bp = Blueprint("stats", __name__)

@stats_bp.route("/stats", methods=["GET"])
def get_stats():
    conn = get_db()
    cursor = conn.cursor()
    
    # Dynamic DB-computed statistics (NEVER hardcoded)
    total_objects = cursor.execute("SELECT COUNT(*) FROM objects").fetchone()[0]
    total_missions = cursor.execute("SELECT COUNT(*) FROM missions").fetchone()[0]
    moon_objects = cursor.execute("SELECT COUNT(*) FROM objects WHERE celestial_body = 'Moon'").fetchone()[0]
    mars_objects = cursor.execute("SELECT COUNT(*) FROM objects WHERE celestial_body = 'Mars'").fetchone()[0]
    
    still_active = cursor.execute("SELECT COUNT(*) FROM objects WHERE current_status IN ('Still in use', 'Still operating')").fetchone()[0]
    left_behind = cursor.execute("SELECT COUNT(*) FROM objects WHERE current_status = 'Left behind'").fetchone()[0]
    mission_ended = cursor.execute("SELECT COUNT(*) FROM objects WHERE current_status = 'Mission ended'").fetchone()[0]
    
    verified_coords = cursor.execute("SELECT COUNT(*) FROM objects WHERE coords_confidence = 'CONFIRMED'").fetchone()[0]
    unverified_coords = cursor.execute("SELECT COUNT(*) FROM objects WHERE coords_confidence != 'CONFIRMED'").fetchone()[0]
    
    # Distinct categories
    categories_raw = cursor.execute("SELECT category, COUNT(*) as cnt FROM objects GROUP BY category ORDER BY cnt DESC").fetchall()
    categories = [{"category": row["category"], "count": row["cnt"]} for row in categories_raw]
    
    conn.close()
    
    return jsonify({
        "total_objects": total_objects,
        "total_missions": total_missions,
        "moon_objects": moon_objects,
        "mars_objects": mars_objects,
        "status_breakdown": {
            "still_in_use": still_active,
            "left_behind": left_behind,
            "mission_ended": mission_ended
        },
        "verified_coordinates_count": verified_coords,
        "unverified_coordinates_count": unverified_coords,
        "categories": categories
    })
