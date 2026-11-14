import requests

searches = {
    "apollo-11-lrrr": "apollo 11 laser ranging retroreflector",
    "apollo-14-lrrr": "apollo 14 laser ranging retroreflector",
    "apollo-15-lrrr": "apollo 15 laser retroreflector",
    "viking-1-lander": "viking 1 lander surface chryse",
    "spirit-rover": "spirit rover columbia hills mars",
    "insight-lander": "insight lander elysium planitia mars",
    "luna-9": "luna 9 moon"
}

for slug, query in searches.items():
    url = f"https://images-api.nasa.gov/search?q={requests.utils.quote(query)}&media_type=image"
    try:
        r = requests.get(url, timeout=8).json()
        items = r.get('collection', {}).get('items', [])[:3]
        print(f"\n--- {slug} (query: {query}) ---")
        for it in items:
            d = it['data'][0]
            nid = d.get('nasa_id')
            title = d.get('title')
            links = it.get('links', [])
            thumb = links[0]['href'] if links else ''
            print(f"  [{nid}] {title[:60]} -> {thumb}")
    except Exception as e:
        print(f"Error {slug}: {e}")
