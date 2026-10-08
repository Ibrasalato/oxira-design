"""Generate the sample floor plans shipped with the studio (public/samples/*.dxf).

Walls are drawn the way most CAD plans are: wall outlines as closed polylines
(the union of wall rectangles minus openings), doors and windows as blocks,
room names as text, plus furniture and dimension layers that the studio must ignore.

    python3 samples-src/make_samples.py
"""
import ezdxf
from shapely.geometry import box
from shapely.ops import unary_union
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public" / "samples"
OUT.mkdir(parents=True, exist_ok=True)


def add_blocks(doc):
    door = doc.blocks.new(name="DOOR")
    door.add_line((0, 0), (0, 1))
    door.add_arc((0, 0), 1, 0, 90)
    win = doc.blocks.new(name="WIN")
    for v in (0, 0.42, 0.58, 1):
        win.add_line((0, v), (1, v))
    win.add_line((0, 0), (0, 1))
    win.add_line((1, 0), (1, 1))


def build(name, units, walls, openings, doors, windows, texts, layers, extra=None):
    doc = ezdxf.new("R2013", setup=True)
    doc.header["$INSUNITS"] = units
    for key, lname in layers.items():
        if lname not in doc.layers:
            doc.layers.add(lname)
    add_blocks(doc)
    msp = doc.modelspace()

    shape = unary_union([box(*w) for w in walls])
    shape = shape.difference(unary_union([box(*o) for o in openings]))
    polys = [shape] if shape.geom_type == "Polygon" else list(shape.geoms)
    for p in polys:
        msp.add_lwpolyline(list(p.exterior.coords)[:-1], close=True, dxfattribs={"layer": layers["wall"]})
        for ring in p.interiors:
            msp.add_lwpolyline(list(ring.coords)[:-1], close=True, dxfattribs={"layer": layers["wall"]})

    for (x, y, w, flip, rot) in doors:
        msp.add_blockref("DOOR", (x, y), dxfattribs={"layer": layers["door"], "xscale": w, "yscale": -w if flip else w, "rotation": rot})
    for (x, y, w, t, rot) in windows:
        msp.add_blockref("WIN", (x, y), dxfattribs={"layer": layers["window"], "xscale": w, "yscale": t, "rotation": rot})
    for (x, y, label, h) in texts:
        msp.add_text(label, dxfattribs={"layer": layers["text"], "height": h, "insert": (x, y), "halign": 1, "valign": 2, "align_point": (x, y)})
    if extra:
        extra(msp)
    doc.saveas(OUT / name)
    print("wrote", OUT / name)


# ---------------------------------------------------------------- apartment (mm)
E, I = 250, 120
walls = [
    (0, 0, 14000, E), (0, 10000 - E, 14000, 10000), (0, 0, E, 10000), (14000 - E, 0, 14000, 10000),
    (E, 4600, 14000 - E, 4600 + I),            # hall south
    (E, 5900, 14000 - E, 5900 + I),            # hall north
    (4500, 6020, 4500 + I, 10000 - E),         # bed1 | baths
    (6500, 6020, 6500 + I, 10000 - E),         # baths | bed2
    (10000, 6020, 10000 + I, 10000 - E),       # bed2 | bed3
    (4620, 7500, 6500, 7500 + I),              # wc | bath
    (10000, E, 10000 + I, 4600),               # dining | kitchen
]
openings = [
    (6000, 4590, 7600, 4730),                  # living <-> hall (open passage)
    (11000, 4590, 11900, 4730),                # kitchen door
    (3200, 5890, 4100, 6030),                  # bed1 door
    (5100, 5890, 5900, 6030),                  # wc door
    (7000, 5890, 7900, 6030),                  # bed2 door
    (10500, 5890, 11400, 6030),                # bed3 door
    (4490, 8200, 4630, 8950),                  # bath door (from master)
    (-10, 4800, 260, 5800),                    # entrance
    (9990, 1500, 10130, 2400),                 # kitchen <-> dining door
    # windows
    (1500, -10, 4500, 260), (8000, -10, 9500, 260), (11500, -10, 13000, 260),
    (1200, 9740, 3200, 10010), (5200, 9740, 5900, 10010), (7600, 9740, 9200, 10010), (11200, 9740, 12800, 10010),
    (13740, 1500, 14010, 3000),
]
doors = [
    (11000, 4600, 900, True, 0),               # kitchen door opens into the kitchen
    (3200, 5900, 900, False, 0),
    (5100, 5900 + I, 800, False, 0),
    (7000, 5900 + I, 900, False, 0),
    (10500, 5900 + I, 900, False, 0),
    (4500, 8200, 750, True, 90),
    (E, 4800, 1000, False, 90),
    (10000, 1500, 900, False, 90),
]
windows = [
    (1500, 0, 3000, E, 0), (8000, 0, 1500, E, 0), (11500, 0, 1500, E, 0),
    (1200, 10000 - E, 2000, E, 0), (5200, 10000 - E, 700, E, 0), (7600, 10000 - E, 1600, E, 0), (11200, 10000 - E, 1600, E, 0),
    (14000, 1500, 1500, E, 90),
]
texts = [
    (3700, 2400, "LIVING ROOM", 220), (8750, 2400, "DINING", 220), (12000, 2400, "KITCHEN", 220),
    (7000, 5300, "HALL", 180), (2300, 7900, "MASTER BEDROOM", 200), (5560, 6750, "WC", 160), (5560, 8700, "BATH", 160),
    (8250, 7900, "BEDROOM 2", 200), (11900, 7900, "BEDROOM 3", 200),
]


def apt_extra(msp):
    # furniture and dimensions the studio should ignore
    msp.add_lwpolyline([(1000, 6800), (2600, 6800), (2600, 8800), (1000, 8800)], close=True, dxfattribs={"layer": "A-FURN"})
    msp.add_lwpolyline([(800, 800), (3200, 800), (3200, 1700), (800, 1700)], close=True, dxfattribs={"layer": "A-FURN"})
    msp.add_circle((8750, 2400), 600, dxfattribs={"layer": "A-FURN"})
    d = msp.add_linear_dim(base=(0, -800), p1=(0, 0), p2=(14000, 0), dxfattribs={"layer": "A-DIMS"})
    d.render()
    d = msp.add_linear_dim(base=(-800, 0), p1=(0, 0), p2=(0, 10000), angle=90, dxfattribs={"layer": "A-DIMS"})
    d.render()


build("apartment-3br.dxf", 4, walls, openings, doors, windows, texts,
      {"wall": "A-WALL", "door": "A-DOOR", "window": "A-GLAZ", "text": "A-ANNO-TEXT"}, apt_extra)

# ---------------------------------------------------------------- studio (metres, Arabic layers)
E, I = 0.2, 0.1
walls = [
    (0, 0, 8, E), (0, 7.5 - E, 8, 7.5), (0, 0, E, 7.5), (8 - E, 0, 8, 7.5),
    (5.4, 4.6, 5.4 + I, 7.5 - E),              # bath | room
    (5.4 + I, 4.6, 8 - E, 4.6 + I),            # bath south
]
openings = [
    (5.39, 5.2, 5.51, 5.95),                   # bath door
    (6.2, -0.01, 7.2, 0.21),                   # entrance (south)
    (1.0, -0.01, 3.6, 0.21), (1.2, 7.29, 3.8, 7.51), (6.3, 7.29, 7.0, 7.51), (-0.01, 2.0, 0.21, 4.0),
]
doors = [(5.4, 5.2, 0.75, False, 90), (6.2, E, 1.0, False, 0)]
windows = [(1.0, 0, 2.6, E, 0), (1.2, 7.5 - E, 2.6, E, 0), (6.3, 7.5 - E, 0.7, E, 0), (E, 2.0, 2.0, E, 90)]
texts = [(2.8, 4.2, "غرفة المعيشة والنوم", 0.22), (6.7, 6.0, "حمام", 0.2), (6.7, 2.4, "مطبخ", 0.2)]
build("studio-ar.dxf", 6, walls, openings, doors, windows, texts,
      {"wall": "جدران", "door": "أبواب", "window": "شبابيك", "text": "نصوص"})
