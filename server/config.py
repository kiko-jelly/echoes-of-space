import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DATABASE_PATH = os.environ.get("DATABASE_PATH", str(DATA_DIR / "echoes.db"))
SEED_DATA_PATH = str(DATA_DIR / "seed_data.json")

DATA_DIR.mkdir(parents=True, exist_ok=True)

PORT = int(os.environ.get("PORT", 5000))
FLASK_ENV = os.environ.get("FLASK_ENV", "development")
DEBUG = os.environ.get("FLASK_DEBUG", "1") == "1"
