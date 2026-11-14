import requests

test_map = {
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
        "url": "https://images-assets.nasa.gov/image/PIA00567/PIA00567~medium.jpg",
        "thumb": "https://images-assets.nasa.gov/image/PIA00567/PIA00567~thumb.jpg",
        "credit": "NASA/JPL (PIA00567)",
        "page": "https://images.nasa.gov/details/PIA00567"
    },
    "viking-2-lander": {
        "nasa_id": "PIA00568",
        "url": "https://images-assets.nasa.gov/image/PIA00568/PIA00568~medium.jpg",
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
        "url": "https://images-assets.nasa.gov/image/PIA10972/PIA10972~medium.jpg",
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

print(f"Testing {len(test_map)} NASA asset URLs...")
for slug, item in test_map.items():
    try:
        r_disp = requests.get(item["url"], timeout=6, stream=True)
        r_thum = requests.get(item["thumb"], timeout=6, stream=True)
        print(f"[{r_disp.status_code}/{r_thum.status_code}] {slug} -> {item['nasa_id']}")
    except Exception as e:
        print(f"ERR {slug}: {e}")
