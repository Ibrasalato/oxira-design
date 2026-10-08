# Screenshots of the studio in several views/styles: python3 scripts/studio-shots.py [sample] [lang]
import sys, os
from playwright.sync_api import sync_playwright
sample = sys.argv[1] if len(sys.argv) > 1 else 'apartment'
lang = sys.argv[2] if len(sys.argv) > 2 else ''
size = os.environ.get('SIZE', '1440x900').split('x')
out = '/tmp/claude-0/shots'; os.makedirs(out, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
    pg = b.new_page(viewport={'width': int(size[0]), 'height': int(size[1])})
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
    pg.goto(f'http://localhost:4321/{lang + "/" if lang else ""}studio/?sample={sample}', wait_until='networkidle')
    pg.wait_for_function('window.__oxStudio && window.__oxStudio.plan()', timeout=30000)
    pg.wait_for_timeout(2500)
    tag = f'{sample}{"_" + lang if lang else ""}_{size[0]}'
    pg.screenshot(path=f'{out}/st_{tag}_orbit.png')
    for step in os.environ.get('STEPS', 'top,walk,najdi,luxury').split(','):
        if step in ('top', 'walk', 'orbit'):
            pg.evaluate(f'window.__oxStudio.setView("{step}")')
        else:
            pg.evaluate(f'window.__oxStudio.setView("orbit"); window.__oxStudio.setStyle("{step}")')
        pg.wait_for_timeout(2000)
        pg.screenshot(path=f'{out}/st_{tag}_{step}.png')
    print('errors:', errs[:5])
    b.close()
