# python3 scripts/shots.py  -> screenshots of key pages into /tmp/claude-0/shots
import sys, os
from playwright.sync_api import sync_playwright
out = '/tmp/claude-0/shots'; os.makedirs(out, exist_ok=True)
pages = sys.argv[1:] or ['/', '/studio/?sample=apartment']
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
    for spec in pages:
        path, _, size = spec.partition('@')
        w, h = (int(x) for x in (size or '1440x900').split('x'))
        pg = b.new_page(viewport={'width': w, 'height': h})
        logs = []
        pg.on('console', lambda m: logs.append(f'{m.type}: {m.text}'))
        pg.on('pageerror', lambda e: logs.append(f'PAGEERROR: {e}'))
        pg.goto('http://localhost:4321' + path, wait_until='networkidle')
        pg.wait_for_timeout(6000)
        name = (path.strip('/').replace('/', '_').replace('?', '_').replace('=', '-') or 'home') + f'_{w}'
        pg.screenshot(path=f'{out}/{name}.png')
        if '--full' in os.environ.get('SHOT', ''): pg.screenshot(path=f'{out}/{name}_full.png', full_page=True)
        print(name, '|', ' || '.join(l for l in logs if 'error' in l.lower() or 'warn' in l.lower())[:800])
        pg.close()
    b.close()
