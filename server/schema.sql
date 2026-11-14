-- ECHOES OF SPACE: Database Schema

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS missions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    launch_date TEXT,
    landing_date TEXT,
    objective TEXT NOT NULL,
    outcome TEXT NOT NULL,
    source_url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS objects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    celestial_body TEXT NOT NULL CHECK(celestial_body IN ('Moon', 'Mars')),
    category TEXT NOT NULL,
    mission_id TEXT NOT NULL,
    year_left INTEGER NOT NULL,
    original_purpose TEXT NOT NULL,
    reason_left TEXT NOT NULL,
    significance TEXT NOT NULL,
    current_status TEXT NOT NULL CHECK(current_status IN ('Left behind', 'Mission ended', 'Still in use', 'Still operating', 'Crashed/impacted', 'Unknown')),
    latitude REAL,
    longitude REAL,
    coords_confidence TEXT NOT NULL CHECK(coords_confidence IN ('CONFIRMED', 'ESTIMATED', 'UNKNOWN')),
    image_url TEXT NOT NULL,
    image_credit TEXT NOT NULL,
    local_path TEXT,
    thumbnail_path TEXT,
    nasa_id TEXT,
    nasa_page_url TEXT,
    summary TEXT NOT NULL,
    kid_summary TEXT NOT NULL,
    fun_fact TEXT NOT NULL,
    FOREIGN KEY (mission_id) REFERENCES missions (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    object_id TEXT NOT NULL,
    stage TEXT NOT NULL CHECK(stage IN ('intro', 'before', 'journey', 'purpose', 'final_moment', 'after', 'legacy')),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    kid_body TEXT NOT NULL,
    FOREIGN KEY (object_id) REFERENCES objects (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    object_id TEXT NOT NULL,
    source_name TEXT NOT NULL,
    source_url TEXT NOT NULL,
    source_type TEXT NOT NULL,
    FOREIGN KEY (object_id) REFERENCES objects (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    kid_question TEXT NOT NULL,
    options TEXT NOT NULL, -- JSON array of strings
    correct_index INTEGER NOT NULL,
    explanation TEXT NOT NULL,
    kid_explanation TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK(difficulty IN ('easy', 'medium', 'hard')),
    object_id TEXT,
    source_url TEXT,
    FOREIGN KEY (object_id) REFERENCES objects (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS badges (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    unlock_rule TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_objects_body ON objects(celestial_body);
CREATE INDEX IF NOT EXISTS idx_objects_mission ON objects(mission_id);
CREATE INDEX IF NOT EXISTS idx_stories_object ON stories(object_id);
CREATE INDEX IF NOT EXISTS idx_sources_object ON sources(object_id);
