"""Aday görsellerden numaralı kontak baskısı üretir (yalnızca seçim aşaması için)."""
import io, json, sys, time, urllib.request
from PIL import Image, ImageDraw

UA = {'User-Agent': 'rebuild-marketplace-demo/1.0 (webkivanc@gmail.com)'}
CAND = json.load(open('tools/candidates/candidates.json', encoding='utf-8'))
COLS, TW, TH = 6, 300, 200


def fetch(c):
    # upload.wikimedia.org paralel isteklerde susuyor; sıralı + tekrar denemeli.
    for attempt in range(3):
        try:
            req = urllib.request.Request(c['thumb'], headers=UA)
            return Image.open(io.BytesIO(urllib.request.urlopen(req, timeout=60).read())).convert('RGB')
        except Exception:
            time.sleep(0.6 * (attempt + 1))
    return None


def sheet(slot, limit=18):
    items = CAND[slot][:limit]
    imgs = []
    for c in items:
        imgs.append(fetch(c))
        time.sleep(0.15)
    pairs = [(i, im) for i, im in enumerate(imgs) if im]
    if not pairs:
        return None
    rows = (len(pairs) + COLS - 1) // COLS
    out = Image.new('RGB', (COLS * TW, rows * (TH + 18)), (250, 250, 250))
    d = ImageDraw.Draw(out)
    for n, (i, im) in enumerate(pairs):
        x, y = (n % COLS) * TW, (n // COLS) * (TH + 18)
        im = im.copy()
        im.thumbnail((TW - 6, TH - 6))
        out.paste(im, (x + 3, y + 18))
        d.text((x + 4, y + 4), f"{slot}#{i}", fill=(0, 0, 0))
    path = f'tools/candidates/sheet-{slot}.png'
    out.save(path)
    return path


for slot in sys.argv[1:]:
    print(sheet(slot))
