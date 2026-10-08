# python3 scripts/shot.py in.svg|url out.png [w h]
import sys, asyncio
from playwright.sync_api import sync_playwright
src, out = sys.argv[1], sys.argv[2]
w = int(sys.argv[3]) if len(sys.argv) > 3 else 1200
h = int(sys.argv[4]) if len(sys.argv) > 4 else 900
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
    pg = b.new_page(viewport={'width': w, 'height': h})
    pg.goto(src if '://' in src else 'file://' + __import__('os').path.abspath(src))
    pg.wait_for_timeout(int(sys.argv[5]) if len(sys.argv) > 5 else 500)
    pg.screenshot(path=out, full_page=False)
    b.close()
