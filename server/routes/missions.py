from flask import Blueprint, jsonify, request
from server.database import get_db

missions_bp = Blueprint("missions", __name__)

@missions_bp.route("/missions", methods=["GET"])
def get_missions():
    conn = get_db()
    cursor = conn.cursor()
    
    body = request.args.get("body")
    
    query = "SELECT * FROM missions WHERE 1=1"
    params = []
    
    query += " ORDER BY launch_date ASC"
    rows = cursor.execute(query, params).fetchall()
    
    missions = []
    for r in rows:
        m = dict(r)
        # Fetch objects left behind by this mission
        obj_query = "SELECT id, name, slug, celestial_body, category, current_status, coords_confidence, image_url, summary, kid_summary FROM objects WHERE mission_id = ?"
        obj_params = [m["id"]]
        if body:
            obj_query += " AND celestial_body = ?"
            obj_params.append(body)
            
        objs = cursor.execute(obj_query, obj_params).fetchall()
        m["objects_left_behind"] = [dict(o) for o in objs]
        
        # If filtering by body, only include missions with matching objects
        if not body or len(m["objects_left_behind"]) > 0:
            missions.append(m)
            
    conn.close()
    return jsonify(missions)

@missions_bp.route("/missions/<id>", methods=["GET"])
def get_mission_by_id(id):
    conn = get_db()
    cursor = conn.cursor()
    row = cursor.execute("SELECT * FROM missions WHERE id = ?", (id,)).fetchone()
    
    if not row:
        conn.close()
        return jsonify({"error": "Mission not found"}), 404
        
    m = dict(row)
    objs = cursor.execute("SELECT * FROM objects WHERE mission_id = ?", (id,)).fetchall()
    m["objects_left_behind"] = [dict(o) for o in objs]
    conn.close()
    
    return jsonify(m)
