from flask import Blueprint, jsonify, request
from server.database import get_db

objects_bp = Blueprint("objects", __name__)

@objects_bp.route("/objects", methods=["GET"])
def get_objects():
    conn = get_db()
    cursor = conn.cursor()
    
    body = request.args.get("body")
    mission_id = request.args.get("mission_id")
    category = request.args.get("category")
    status = request.args.get("status")
    search = request.args.get("search")
    confidence = request.args.get("confidence")
    
    query = """
        SELECT o.*, m.name as mission_name, m.launch_date as mission_launch_date
        FROM objects o
        JOIN missions m ON o.mission_id = m.id
        WHERE 1=1
    """
    params = []
    
    if body:
        query += " AND o.celestial_body = ?"
        params.append(body)
    if mission_id:
        query += " AND o.mission_id = ?"
        params.append(mission_id)
    if category:
        query += " AND o.category = ?"
        params.append(category)
    if status:
        query += " AND o.current_status = ?"
        params.append(status)
    if confidence:
        query += " AND o.coords_confidence = ?"
        params.append(confidence)
    if search:
        query += " AND (o.name LIKE ? OR o.summary LIKE ? OR o.kid_summary LIKE ? OR o.fun_fact LIKE ?)"
        term = f"%{search}%"
        params.extend([term, term, term, term])
        
    query += " ORDER BY o.year_left ASC, o.name ASC"
    
    rows = cursor.execute(query, params).fetchall()
    objects = [dict(row) for row in rows]
    conn.close()
    
    return jsonify(objects)

@objects_bp.route("/objects/random", methods=["GET"])
def get_random_object():
    conn = get_db()
    cursor = conn.cursor()
    row = cursor.execute("""
        SELECT o.*, m.name as mission_name
        FROM objects o
        JOIN missions m ON o.mission_id = m.id
        ORDER BY RANDOM() LIMIT 1
    """).fetchone()
    conn.close()
    
    if not row:
        return jsonify({"error": "No objects found"}), 404
        
    return jsonify(dict(row))

@objects_bp.route("/objects/<slug>", methods=["GET"])
def get_object_by_slug(slug):
    conn = get_db()
    cursor = conn.cursor()
    
    obj_row = cursor.execute("""
        SELECT o.*, m.name as mission_name, m.launch_date, m.landing_date, m.objective as mission_objective, m.outcome as mission_outcome, m.source_url as mission_source_url
        FROM objects o
        JOIN missions m ON o.mission_id = m.id
        WHERE o.slug = ?
    """, (slug,)).fetchone()
    
    if not obj_row:
        conn.close()
        return jsonify({"error": f"Object with slug '{slug}' not found"}), 404
        
    obj = dict(obj_row)
    object_id = obj["id"]
    
    # Fetch stories
    story_rows = cursor.execute("""
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
    obj["stories"] = [dict(s) for s in story_rows]
    
    # Fetch sources
    source_rows = cursor.execute("""
        SELECT source_name, source_url, source_type
        FROM sources
        WHERE object_id = ?
    """, (object_id,)).fetchall()
    obj["sources"] = [dict(s) for s in source_rows]
    
    # Fetch related quiz question if any
    quiz_rows = cursor.execute("""
        SELECT id, question, kid_question, options, correct_index, explanation, kid_explanation, difficulty
        FROM quiz_questions
        WHERE object_id = ?
    """, (object_id,)).fetchall()
    obj["related_quizzes"] = [dict(q) for q in quiz_rows]
    
    conn.close()
    return jsonify(obj)
