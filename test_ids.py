import requests

test_ids = [
    'as11-40-5917', 'as11-40-5952', 'as14-67-9385', 'as15-88-11866', 
    'as15-85-11460', 'as16-107-17561', 'as17-147-22527', 'AS12-48-7133', 
    'as12-46-6813', 'PIA00007', 'PIA00568', 'PIA01120', 
    'PIA05208', 'PIA10216', 'PIA10972', 'PIA23157'
]

for nid in test_ids:
    url = f"https://images-api.nasa.gov/search?nasa_id={nid}"
    try:
        r = requests.get(url, timeout=6).json()
        items = r.get('collection', {}).get('items', [])
        if items:
            d = items[0]['data'][0]
            links = items[0].get('links', [])
            thumb = links[0]['href'] if links else 'no link'
            title = d.get('title', '')
            print(f"✅ Found {nid}: {title[:40]} -> {thumb}")
        else:
            print(f"❌ Not found: {nid}")
    except Exception as e:
        print(f"Error {nid}: {e}")
