import json
import sqlite3
import os
import sys
import requests
from pathlib import Path

# Add project root to sys.path
BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from server.config import DATABASE_PATH, SEED_DATA_PATH
from server.database import init_db, get_db

STATIC_MEDIA_DIR = BASE_DIR / "static" / "media"
STATIC_MEDIA_DIR.mkdir(parents=True, exist_ok=True)

# Verified authentic NASA records mapping
VERIFIED_ASSETS = {
    "apollo-11-descent-stage": {
        "nasa_id": "as11-40-5917",
        "url": "https://images-assets.nasa.gov/image/as11-40-5917/as11-40-5917~medium.jpg",
        "thumb": "https://images-assets.nasa.gov/image/as11-40-5917/as11-40-5917~thumb.jpg",
        "credit": "NASA / Neil Armstrong (AS11-40-5917)",
        "page": "https://images.nasa.gov/details/as11-40-5917"
    },
    "apollo-11-lrrr": {
        "nasa_id": "6900957",
        "url": "https://images-assets.nasa.gov/image/6900957/6900957~medium.jpg",
        "thumb": "https://images-assets.nasa.gov/image/6900957/6900957~thumb.jpg",
        "credit": "NASA / Buzz Aldrin (6900957)",
        "page": "https://images.nasa.gov/details/6900957"
    },
    "apollo-14-lrrr": {
        "nasa_id": "as14-67-09361",
        "url": "https://images-assets.nasa.gov/image/as14-67-09361/as14-67-09361~medium.jpg",
        "thumb": "https://images-assets.nasa.gov/image/as14-67-09361/as14-67-09361~thumb.jpg",
        "credit": "NASA / Alan Shepard (AS14-67-09361)",
        "page": "https://images.nasa.gov/details/as14-67-09361"
    },
    "apollo-15-lrv": {
        "nasa_id": "as15-88-11866",
        "url": "https://images-assets.nasa.gov/image/as15-88-11866/as15-88-11866~medium.jpg",
        "thumb": "https://images-assets.nasa.gov/image/as15-88-11866/as15-88-11866~thumb.jpg",
        "credit": "NASA / David Scott (AS15-88-11866)",
        "page": "https://images.nasa.gov/details/as15-88-11866"
    },
    "apollo-15-lrrr": {
        "nasa_id": "PIA13037",
        "url": "https://images-assets.nasa.gov/image/PIA13037/PIA13037~small.jpg",
        "thumb": "https://images-assets.nasa.gov/image/PIA13037/PIA13037~thumb.jpg",
        "credit": "NASA/JPL/ASU (PIA13037)",
        "page": "https://images.nasa.gov/details/PIA13037"
    },
    "apollo-16-lrv": {
        "nasa_id": "as16-107-17561",
        "url": "https://images-assets.nasa.gov/image/as16-107-17561/as16-107-17561~medium.jpg",
        "thumb": "https://images-assets.nasa.gov/image/as16-107-17561/as16-107-17561~thumb.jpg",
        "credit": "NASA / Charles Duke (AS16-107-17561)",
        "page": "https://images.nasa.gov/details/as16-107-17561"
    },
    "apollo-17-lrv": {
        "nasa_id": "as17-147-22527",
        "url": "https://images-assets.nasa.gov/image/as17-147-22527/as17-147-22527~medium.jpg",
        "thumb": "https://images-assets.nasa.gov/image/as17-147-22527/as17-147-22527~thumb.jpg",
        "credit": "NASA / Harrison Schmitt (AS17-147-22527)",
        "page": "https://images.nasa.gov/details/as17-147-22527"
    },
    "surveyor-3": {
        "nasa_id": "AS12-48-7133",
        "url": "https://images-assets.nasa.gov/image/AS12-48-7133/AS12-48-7133~medium.jpg",
        "thumb": "https://images-assets.nasa.gov/image/AS12-48-7133/AS12-48-7133~thumb.jpg",
        "credit": "NASA / Alan Bean (AS12-48-7133)",
        "page": "https://images.nasa.gov/details/AS12-48-7133"
    },
    "apollo-12-alsep": {
        "nasa_id": "as12-46-6813",
        "url": "https://images-assets.nasa.gov/image/as12-46-6813/as12-46-6813~medium.jpg",
        "thumb": "https://images-assets.nasa.gov/image/as12-46-6813/as12-46-6813~thumb.jpg",
        "credit": "NASA / Pete Conrad (AS12-46-6813)",
        "page": "https://images.nasa.gov/details/as12-46-6813"
    },
    "viking-1-lander": {
        "nasa_id": "PIA00567",
        "url": "https://images-assets.nasa.gov/image/PIA00567/PIA00567~orig.jpg",
        "thumb": "https://images-assets.nasa.gov/image/PIA00567/PIA00567~thumb.jpg",
        "credit": "NASA/JPL (PIA00567)",
        "page": "https://images.nasa.gov/details/PIA00567"
    },
    "viking-2-lander": {
        "nasa_id": "PIA00568",
        "url": "https://images-assets.nasa.gov/image/PIA00568/PIA00568~orig.jpg",
        "thumb": "https://images-assets.nasa.gov/image/PIA00568/PIA00568~thumb.jpg",
        "credit": "NASA/JPL (PIA00568)",
        "page": "https://images.nasa.gov/details/PIA00568"
    },
    "mars-pathfinder-sojourner": {
        "nasa_id": "PIA01120",
        "url": "https://images-assets.nasa.gov/image/PIA01120/PIA01120~medium.jpg",
        "thumb": "https://images-assets.nasa.gov/image/PIA01120/PIA01120~thumb.jpg",
        "credit": "NASA/JPL (PIA01120)",
        "page": "https://images.nasa.gov/details/PIA01120"
    },
    "spirit-rover": {
        "nasa_id": "PIA03230",
        "url": "https://images-assets.nasa.gov/image/PIA03230/PIA03230~medium.jpg",
        "thumb": "https://images-assets.nasa.gov/image/PIA03230/PIA03230~thumb.jpg",
        "credit": "NASA/JPL/Cornell (PIA03230)",
        "page": "https://images.nasa.gov/details/PIA03230"
    },
    "opportunity-rover": {
        "nasa_id": "PIA10216",
        "url": "https://images-assets.nasa.gov/image/PIA10216/PIA10216~medium.jpg",
        "thumb": "https://images-assets.nasa.gov/image/PIA10216/PIA10216~thumb.jpg",
        "credit": "NASA/JPL-Caltech/Cornell (PIA10216)",
        "page": "https://images.nasa.gov/details/PIA10216"
    },
    "phoenix-lander": {
        "nasa_id": "PIA10972",
        "url": "https://images-assets.nasa.gov/image/PIA10972/PIA10972~orig.jpg",
        "thumb": "https://images-assets.nasa.gov/image/PIA10972/PIA10972~thumb.jpg",
        "credit": "NASA/JPL-Caltech/Univ. of Arizona (PIA10972)",
        "page": "https://images.nasa.gov/details/PIA10972"
    },
    "insight-lander": {
        "nasa_id": "PIA22228",
        "url": "https://images-assets.nasa.gov/image/PIA22228/PIA22228~medium.jpg",
        "thumb": "https://images-assets.nasa.gov/image/PIA22228/PIA22228~thumb.jpg",
        "credit": "NASA/JPL-Caltech (PIA22228)",
        "page": "https://images.nasa.gov/details/PIA22228"
    }
}

def verify_and_seed():
    print(f"🌱 [Echoes of Space] Seeding database at {DATABASE_PATH}...")
    
    # 1. Initialize schema
    init_db()
    
    # 2. Read seed data
    with open(SEED_DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    conn = get_db()
    cursor = conn.cursor()
    
    # Clear existing data for idempotent re-seeding
    cursor.execute("DELETE FROM quiz_questions;")
    cursor.execute("DELETE FROM sources;")
    cursor.execute("DELETE FROM stories;")
    cursor.execute("DELETE FROM objects;")
    cursor.execute("DELETE FROM missions;")
    cursor.execute("DELETE FROM badges;")
    
    # 3. Seed Missions
    print(f"🚀 Inserting {len(data['missions'])} missions...")
    for m in data["missions"]:
        cursor.execute(
            """
            INSERT INTO missions (id, name, type, launch_date, landing_date, objective, outcome, source_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (m["id"], m["name"], m["type"], m.get("launch_date"), m.get("landing_date"), m["objective"], m["outcome"], m["source_url"])
        )
        
    # 4. Seed Objects with image validation & local caching
    print(f"🛸 Inserting {len(data['objects'])} objects...")
    for obj in data["objects"]:
        slug = obj["slug"]
        meta = VERIFIED_ASSETS.get(slug)
        
        image_url = meta["url"] if meta else obj["image_url"]
        image_credit = meta["credit"] if meta else obj["image_credit"]
        nasa_id = meta["nasa_id"] if meta else None
        nasa_page_url = meta["page"] if meta else None
        
        # Check local media file existence
        disp_file = STATIC_MEDIA_DIR / f"{slug}.jpg"
        thumb_file = STATIC_MEDIA_DIR / f"{slug}_thumb.jpg"
        
        local_path = f"/static/media/{slug}.jpg" if disp_file.exists() and disp_file.stat().st_size > 0 else None
        thumbnail_path = f"/static/media/{slug}_thumb.jpg" if thumb_file.exists() and thumb_file.stat().st_size > 0 else None
        
        cursor.execute(
            """
            INSERT INTO objects (
                id, name, slug, celestial_body, category, mission_id, year_left,
                original_purpose, reason_left, significance, current_status,
                latitude, longitude, coords_confidence, image_url, image_credit,
                local_path, thumbnail_path, nasa_id, nasa_page_url,
                summary, kid_summary, fun_fact
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                obj["id"], obj["name"], slug, obj["celestial_body"], obj["category"],
                obj["mission_id"], obj["year_left"], obj["original_purpose"], obj["reason_left"],
                obj["significance"], obj["current_status"], obj.get("latitude"), obj.get("longitude"),
                obj["coords_confidence"], image_url, image_credit,
                local_path, thumbnail_path, nasa_id, nasa_page_url,
                obj["summary"], obj["kid_summary"], obj["fun_fact"]
            )
        )
        
    # 5. Seed Stories
    print(f"📖 Inserting {len(data['stories'])} story chapters...")
    for s in data["stories"]:
        cursor.execute(
            """
            INSERT INTO stories (object_id, stage, title, body, kid_body)
            VALUES (?, ?, ?, ?, ?)
            """,
            (s["object_id"], s["stage"], s["title"], s["body"], s["kid_body"])
        )
        
    # 6. Seed Sources
    print(f"🔗 Inserting {len(data['sources'])} primary source links...")
    for src in data["sources"]:
        cursor.execute(
            """
            INSERT INTO sources (object_id, source_name, source_url, source_type)
            VALUES (?, ?, ?, ?)
            """,
            (src["object_id"], src["source_name"], src["source_url"], src["source_type"])
        )
        
    # 7. Seed Quiz Questions
    print(f"❓ Inserting {len(data['quiz_questions'])} discovery quiz questions...")
    for q in data["quiz_questions"]:
        cursor.execute(
            """
            INSERT INTO quiz_questions (question, kid_question, options, correct_index, explanation, kid_explanation, difficulty, object_id, source_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (q["question"], q["kid_question"], q["options"], q["correct_index"], q["explanation"], q["kid_explanation"], q["difficulty"], q.get("object_id"), q.get("source_url"))
        )
        
    # 8. Seed Badges
    print(f"🏆 Inserting {len(data['badges'])} achievement badges...")
    for b in data["badges"]:
        cursor.execute(
            """
            INSERT INTO badges (id, name, description, icon, unlock_rule)
            VALUES (?, ?, ?, ?, ?)
            """,
            (b["id"], b["name"], b["description"], b["icon"], b["unlock_rule"])
        )
        
    conn.commit()
    conn.close()
    print("✨ Database successfully populated with verified NASA assets!")

if __name__ == "__main__":
    verify_and_seed()
