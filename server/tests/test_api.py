import unittest
import sys
import os
from pathlib import Path

# Add project root to path
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from server.app import create_app
from server.database import get_db

class TestEchoesOfSpaceAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.client = cls.app.test_client()

    def test_01_health_check(self):
        """Test /api/health endpoint returns 200 and operational database"""
        res = self.client.get('/api/health')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data.get("status"), "online")
        self.assertTrue(data.get("database_ready"))
        self.assertEqual(data.get("version"), "1.0.0")

    def test_02_dynamic_stats_integrity(self):
        """Test /api/stats computes real mathematical invariants from DB"""
        res = self.client.get('/api/stats')
        self.assertEqual(res.status_code, 200)
        stats = res.get_json()

        total = stats["total_objects"]
        self.assertGreater(total, 12, "Must have at least 12 verified objects")

        # Sum invariants
        moon = stats["moon_objects"]
        mars = stats["mars_objects"]
        self.assertEqual(moon + mars, total, "Moon + Mars must equal total objects")

        breakdown = stats["status_breakdown"]
        status_sum = breakdown["still_in_use"] + breakdown["left_behind"] + breakdown["mission_ended"]
        self.assertEqual(status_sum, total, "Status sum must equal total objects")

        coords_sum = stats["verified_coordinates_count"] + stats["unverified_coordinates_count"]
        self.assertEqual(coords_sum, total, "Verified + unverified coords must equal total objects")

    def test_03_objects_filtering(self):
        """Test /api/objects filter query params"""
        # Moon objects only
        res_moon = self.client.get('/api/objects?body=Moon')
        self.assertEqual(res_moon.status_code, 200)
        moon_objs = res_moon.get_json()
        self.assertTrue(all(o["celestial_body"] == "Moon" for o in moon_objs))

        # Mars objects only
        res_mars = self.client.get('/api/objects?body=Mars')
        self.assertEqual(res_mars.status_code, 200)
        mars_objs = res_mars.get_json()
        self.assertTrue(all(o["celestial_body"] == "Mars" for o in mars_objs))

        # Search term filter
        res_search = self.client.get('/api/objects?search=Armstrong')
        self.assertEqual(res_search.status_code, 200)
        search_objs = res_search.get_json()
        self.assertGreater(len(search_objs), 0)

    def test_04_object_detail_and_404(self):
        """Test /api/objects/<slug> returns full record and proper 404 for unknown slug"""
        res_valid = self.client.get('/api/objects/apollo-11-descent-stage')
        self.assertEqual(res_valid.status_code, 200)
        obj = res_valid.get_json()
        self.assertEqual(obj["slug"], "apollo-11-descent-stage")
        self.assertEqual(obj["coords_confidence"], "CONFIRMED")
        self.assertIn("stories", obj)
        self.assertIn("sources", obj)
        self.assertGreaterEqual(len(obj["stories"]), 7, "Must contain all 7 story chapters")
        self.assertGreaterEqual(len(obj["sources"]), 1, "Must contain at least 1 verified source")

        # 404 handler
        res_invalid = self.client.get('/api/objects/non-existent-probe-123')
        self.assertEqual(res_invalid.status_code, 404)

    def test_05_random_object(self):
        """Test /api/objects/random returns a valid object"""
        res = self.client.get('/api/objects/random')
        self.assertEqual(res.status_code, 200)
        obj = res.get_json()
        self.assertIn("slug", obj)
        self.assertIn("name", obj)

    def test_06_missions_endpoint(self):
        """Test /api/missions returns missions with linked objects"""
        res = self.client.get('/api/missions')
        self.assertEqual(res.status_code, 200)
        missions = res.get_json()
        self.assertGreaterEqual(len(missions), 10)
        for m in missions:
            self.assertIn("id", m)
            self.assertIn("name", m)
            self.assertIn("objects_left_behind", m)

    def test_07_quiz_and_badges(self):
        """Test /api/quiz and /api/badges endpoints"""
        res_quiz = self.client.get('/api/quiz?limit=10')
        self.assertEqual(res_quiz.status_code, 200)
        questions = res_quiz.get_json()
        self.assertEqual(len(questions), 10)
        for q in questions:
            self.assertIsInstance(q["options"], list)
            self.assertTrue(0 <= q["correct_index"] < len(q["options"]))
            self.assertTrue(len(q["explanation"]) > 0)
            self.assertTrue(len(q["kid_explanation"]) > 0)

        res_badges = self.client.get('/api/badges')
        self.assertEqual(res_badges.status_code, 200)
        badges = res_badges.get_json()
        self.assertGreaterEqual(len(badges), 6)

if __name__ == '__main__':
    unittest.main()
