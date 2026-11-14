import requests
import json
import time

OBJECTS_SEARCH = [
    {
        "slug": "apollo-11-descent-stage",
        "query": "apollo 11 lunar module footpad plaque as11-40-5917",
        "fallback_id": "as11-40-5917"
    },
    {
        "slug": "apollo-11-lrrr",
        "query": "apollo 11 laser ranging retroreflector as11-40-5952",
        "fallback_id": "as11-40-5952"
    },
    {
        "slug": "apollo-14-lrrr",
        "query": "apollo 14 lunar laser ranging retroreflector alsep",
        "fallback_id": "as14-67-9385"
    },
    {
        "slug": "apollo-15-lrv",
        "query": "apollo 15 lunar roving vehicle hadley as15-88-11866",
        "fallback_id": "as15-88-11866"
    },
    {
        "slug": "apollo-15-lrrr",
        "query": "apollo 15 lunar laser retroreflector as15-85-11460",
        "fallback_id": "as15-85-11460"
    },
    {
        "slug": "apollo-16-lrv",
        "query": "apollo 16 lunar roving vehicle young as16-107-17561",
        "fallback_id": "as16-107-17561"
    },
    {
        "slug": "apollo-17-lrv",
        "query": "apollo 17 lunar roving vehicle cernan as17-147-22527",
        "fallback_id": "as17-147-22527"
    },
    {
        "slug": "surveyor-3",
        "query": "surveyor 3 apollo 12 conrad as12-48-7133",
        "fallback_id": "as12-48-7133"
    },
    {
        "slug": "apollo-12-alsep",
        "query": "apollo 12 alsep deployment bean as12-46-6813",
        "fallback_id": "as12-46-6813"
    },
    {
        "slug": "viking-1-lander",
        "query": "viking 1 lander surface chryse planitia pia00007",
        "fallback_id": "PIA00007"
    },
    {
        "slug": "viking-2-lander",
        "query": "viking 2 lander utopia planitia frost pia00568",
        "fallback_id": "PIA00568"
    },
    {
        "slug": "mars-pathfinder-sojourner",
        "query": "mars pathfinder sojourner yogi rock pia01120",
        "fallback_id": "PIA01120"
    },
    {
        "slug": "spirit-rover",
        "query": "spirit rover tracks gusev crater pia05208",
        "fallback_id": "PIA05208"
    },
    {
        "slug": "opportunity-rover",
        "query": "opportunity rover shadow endeavour crater rim pia10216",
        "fallback_id": "PIA10216"
    },
    {
        "slug": "phoenix-lander",
        "query": "phoenix mars lander water ice trench pia10972",
        "fallback_id": "PIA10972"
    },
    {
        "slug": "insight-lander",
        "query": "insight lander selfie elysium planitia pia23157",
        "fallback_id": "PIA23157"
    },
    {
        "slug": "luna-9",
        "query": "luna 9 moon lunar lander surface",
        "fallback_id": "SPD-SLRSY-1927"
    }
]

def search_nasa(item):
    query = item["query"]
    url = f"https://images-api.nasa.gov/search?q={requests.utils.quote(query)}&media_type=image"
    try:
        r = requests.get(url, timeout=10)
        if r.status_code == 200:
            data = r.json()
            items = data.get("collection", {}).get("items", [])
            if items:
                # choose first match
                first = items[0]
                d = first["data"][0]
                nasa_id = d.get("nasa_id")
                title = d.get("title")
                links = first.get("links", [])
                thumb = links[0]["href"] if links else None
                
                # Fetch asset manifest to get display size (medium or orig)
                asset_url = f"https://images-api.nasa.gov/asset/{nasa_id}"
                display_url = thumb
                try:
                    ar = requests.get(asset_url, timeout=8).json()
                    asset_items = ar.get("collection", {}).get("items", [])
                    # Look for medium.jpg, large.jpg, or small.jpg
                    for a in asset_items:
                        href = a.get("href", "")
                        if "~medium.jpg" in href or "~large.jpg" in href:
                            display_url = href
                            break
                        elif "~small.jpg" in href:
                            display_url = href
                except Exception as e:
                    pass
                
                return {
                    "slug": item["slug"],
                    "nasa_id": nasa_id,
                    "title": title,
                    "thumb_url": thumb,
                    "display_url": display_url,
                    "nasa_page_url": f"https://images.nasa.gov/details/{nasa_id}",
                    "credit": f"NASA / {d.get('secondary_creator', 'NASA')} ({nasa_id})"
                }
    except Exception as e:
        print(f"Error querying {query}: {e}")
        
    return None

results = []
for obj in OBJECTS_SEARCH:
    res = search_nasa(obj)
    if res:
        print(f"✅ Found {obj['slug']}: {res['nasa_id']} -> {res['display_url']}")
        results.append(res)
    else:
        print(f"❌ Failed for {obj['slug']}")
    time.sleep(0.5)

with open("nasa_api_results.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)

print(f"\nSaved {len(results)} NASA API verified assets to nasa_api_results.json")
