import sqlite3
import requests
import os

db_path = 'server/data/echoes.db'
if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
    exit(1)

conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row
rows = conn.execute('SELECT id, name, slug, image_url, image_credit FROM objects').fetchall()

print(f"Total objects in DB: {len(rows)}")
for r in rows:
    url = r['image_url']
    slug = r['slug']
    try:
        res = requests.get(url, timeout=5, stream=True, headers={'User-Agent': 'Mozilla/5.0'})
        ct = res.headers.get('Content-Type', 'unknown')
        print(f"[{res.status_code}] {slug}: {ct} -> {url[:65]}...")
    except Exception as e:
        print(f"[ERR] {slug}: {e} -> {url[:65]}...")

conn.close()
