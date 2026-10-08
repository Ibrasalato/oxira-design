# Builds public/og-<lang>.png (1200x630) from a live studio render + brand layout.
import os, base64
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F = lambda p: 'file://' + os.path.join(ROOT, 'node_modules/@fontsource', p)
TXT = {
  'ar': ('rtl', 'من مخطط أوتوكاد إلى تصميم ثلاثي الأبعاد', 'ارفع ملف DXF وشوف بيتك 3D بالمساحات والأثاث خلال ثوانٍ'),
  'en': ('ltr', 'From AutoCAD plan to 3D interior design', 'Upload a DXF and see your home in 3D with areas and furniture in seconds'),
  'de': ('ltr', 'Vom AutoCAD-Plan zum 3D-Innendesign', 'DXF hochladen und Ihr Zuhause in Sekunden in 3D sehen'),
  'fr': ('ltr', 'Du plan AutoCAD au design intérieur 3D', 'Importez un DXF et voyez votre logement en 3D en quelques secondes'),
  'ru': ('ltr', 'От чертежа AutoCAD до 3D-дизайна интерьера', 'Загрузите DXF и увидьте дом в 3D за секунды'),
}
logo = open(os.path.join(ROOT, 'public/favicon.svg')).read()
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 1300, 'height': 900})
    pg.goto('http://localhost:4321/studio/?sample=apartment', wait_until='networkidle')
    pg.wait_for_function('window.__oxStudio && window.__oxStudio.plan()')
    pg.evaluate('window.__oxStudio.viewer().setLabels(false)')
    pg.add_style_tag(content='#sd-tools,.oxchat,#sd-walk{display:none!important}')
    pg.wait_for_timeout(2500)
    shot = pg.locator('#sd-view').screenshot()
    model = 'data:image/png;base64,' + base64.b64encode(shot).decode()
    for lang, (d, title, sub) in TXT.items():
        html = f'''<html dir="{d}"><head><style>
@font-face {{ font-family: Cairo; font-weight: 700; src: url({F('cairo/files/cairo-arabic-700-normal.woff2')}); }}
@font-face {{ font-family: Plex; font-weight: 700; src: url({F('ibm-plex-sans/files/ibm-plex-sans-latin-700-normal.woff2')}); }}
@font-face {{ font-family: Plex; font-weight: 700; src: url({F('ibm-plex-sans/files/ibm-plex-sans-cyrillic-700-normal.woff2')}); unicode-range: U+0400-04FF; }}
body {{ margin:0; width:1200px; height:630px; background:#0A253E; font-family: Plex, Cairo, sans-serif; color:#fff; overflow:hidden; position:relative; }}
.img {{ position:absolute; top:40px; bottom:40px; inset-inline-end:40px; width:560px; border-radius:24px; background:#F3F6F8 url({model}) center/cover; }}
.txt {{ position:absolute; inset-inline-start:64px; top:70px; width:500px; }}
.brand {{ display:flex; align-items:center; gap:14px; font-size:34px; direction:ltr; justify-content:flex-{'end' if d=='rtl' else 'start'}; }}
.brand svg {{ width:46px; height:46px; }} .brand b {{ color:#F5A800; font-size:26px; border-left:2px solid rgba(255,255,255,.25); padding-left:14px; }}
h1 {{ font-size:{50 if lang!='ru' else 44}px; line-height:1.25; margin:70px 0 22px; }}
p {{ font-size:26px; color:#A7B8C8; line-height:1.5; margin:0; }}
.url {{ position:absolute; bottom:52px; {'right' if d=='rtl' else 'left'}:64px; font-size:24px; color:#F5A800; direction:ltr; }}
</style></head><body><div class="img"></div><div class="txt"><div class="brand">{logo}<span>Oxira</span><b>Design</b></div><h1>{title}</h1><p>{sub}</p></div><div class="url">design.oxira.sa</div></body></html>'''
        tmp = f'/tmp/claude-0/og-{lang}.html'
        open(tmp, 'w').write(html)
        q = b.new_page(viewport={'width': 1200, 'height': 630})
        q.goto('file://' + tmp)
        q.wait_for_timeout(400)
        q.screenshot(path=os.path.join(ROOT, f'public/og-{lang}.png'))
        q.close()
    b.close()
print('ok')
