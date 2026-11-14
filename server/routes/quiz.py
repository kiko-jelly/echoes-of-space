import json
from flask import Blueprint, jsonify, request
from server.database import get_db

quiz_bp = Blueprint("quiz", __name__)

@quiz_bp.route("/quiz", methods=["GET"])
def get_quiz_questions():
    conn = get_db()
    cursor = conn.cursor()
    
    difficulty = request.args.get("difficulty")
    limit = int(request.args.get("limit", 10))
    
    query = """
        SELECT q.*, o.name as object_name, o.slug as object_slug
        FROM quiz_questions q
        LEFT JOIN objects o ON q.object_id = o.id
        WHERE 1=1
    """
    params = []
    
    if difficulty and difficulty != "all":
        query += " AND q.difficulty = ?"
        params.append(difficulty)
        
    query += " ORDER BY RANDOM() LIMIT ?"
    params.append(limit)
    
    rows = cursor.execute(query, params).fetchall()
    
    questions = []
    for r in rows:
        item = dict(r)
        try:
            item["options"] = json.loads(item["options"])
        except Exception:
            item["options"] = []
        questions.append(item)
        
    conn.close()
    return jsonify(questions)

@quiz_bp.route("/badges", methods=["GET"])
def get_badges():
    conn = get_db()
    cursor = conn.cursor()
    rows = cursor.execute("SELECT * FROM badges ORDER BY id ASC").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])
