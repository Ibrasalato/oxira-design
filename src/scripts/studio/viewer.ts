// three.js viewer: builds the 3D model from a Plan and offers orbit, top and walk views,
// style switching, labels, snapshots and GLB/OBJ export.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { Plan, Rect } from './plan.ts';
import { STYLES, floorTexture, type Style, type StyleId, type TexSpec } from './styles.ts';
import { furnish } from './furnish.ts';

export type View = 'orbit' | 'top' | 'walk';
export type ViewerOptions = { autoRotate?: boolean; interactive?: boolean; labels?: (name: string, area: number) => string };

export class Viewer {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  model = new THREE.Group();
  private walls = new THREE.Group();
  private upper = new THREE.Group();      // lintels and glass: hidden in cut view
  private ceiling = new THREE.Group();
  private furniture: THREE.Group | null = null;
  private labelGroup = new THREE.Group();
  private sun: THREE.DirectionalLight;
  private ground: THREE.Mesh;
  private plan: Plan | null = null;
  private style: Style = STYLES.modern;
  private center = new THREE.Vector3();
  private span = 10;
  private raf = 0;
  private visible = true;
  private ro: ResizeObserver;
  private io: IntersectionObserver;
  view: View = 'orbit';
  cut = false;
  showLabels = true;
  withFurniture = true;
  // walk state
  private yaw = 0;
  private pitch = 0;
  private keys = new Set<string>();
  private moveVec = { f: 0, s: 0 };
  private last = performance.now();
  onChange?: () => void;

  constructor(private host: HTMLElement, private opts: ViewerOptions = {}) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: false });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.touchAction = 'none';

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.05, 2000);
    const pm = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.55;

    this.scene.add(new THREE.HemisphereLight(0xffffff, 0xd8cfc0, 0.9));
    this.sun = new THREE.DirectionalLight(0xfff4e5, 2.2);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.bias = -0.0004;
    this.sun.shadow.normalBias = 0.02;
    this.scene.add(this.sun, this.sun.target);

    this.ground = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshStandardMaterial({ color: '#E7EBEE', roughness: 1 }));
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.y = -0.012;
    this.ground.receiveShadow = true;
    this.scene.add(this.ground, this.model, this.labelGroup);
    this.model.name = 'oxira-design-model';
    this.walls.name = 'walls'; this.upper.name = 'openings'; this.ceiling.name = 'ceiling';

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.maxPolarAngle = Math.PI * 0.49;
    this.controls.autoRotate = !!opts.autoRotate;
    this.controls.autoRotateSpeed = 0.7;
    if (opts.interactive === false) { this.controls.enableZoom = false; this.controls.enablePan = false; }

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(host);
    this.io = new IntersectionObserver((e) => { this.visible = e[0]?.isIntersecting ?? true; });
    this.io.observe(host);
    this.bindWalk();
    this.resize();
    this.loop();
  }

  // ---------------------------------------------------------------- model
  toWorld = (x: number, y: number) => new THREE.Vector3(x - this.center.x, 0, -(y - this.center.z));

  setPlan(plan: Plan) {
    this.plan = plan;
    const b = plan.bounds;
    this.center.set((b.x0 + b.x1) / 2, 0, (b.y0 + b.y1) / 2);
    this.span = Math.max(4, b.x1 - b.x0, b.y1 - b.y0);
    this.rebuild();
    this.frame();
  }

  setStyle(id: StyleId) {
    this.style = STYLES[id] || STYLES.modern;
    if (this.plan) this.rebuild();
  }

  setFurniture(on: boolean) {
    this.withFurniture = on;
    if (this.furniture) this.furniture.visible = on && this.view !== 'top' ? true : on;
    if (on && !this.furniture && this.plan) { this.furniture = furnish(this.plan, this.style, this.toWorld); this.model.add(this.furniture); }
    if (this.furniture) this.furniture.visible = on;
  }

  setLabels(on: boolean) { this.showLabels = on; this.labelGroup.visible = on && this.view !== 'walk'; }

  setCut(on: boolean) {
    this.cut = on;
    if (!this.plan) return;
    const h = this.plan.height;
    this.walls.scale.y = on ? Math.min(1, 1.15 / h) : 1;
    this.upper.visible = !on;
    for (const s of this.labelGroup.children) s.position.y = (on ? 1.6 : h + 0.45);
    this.onChange?.();
  }

  private clearGroup(g: THREE.Object3D) {
    for (const c of [...g.children]) {
      g.remove(c);
      c.traverse((o: any) => { if (o.geometry) o.geometry.dispose(); });
    }
  }

  private rebuild() {
    const plan = this.plan!;
    const s = this.style;
    this.clearGroup(this.model);
    this.walls = new THREE.Group(); this.walls.name = 'walls';
    this.upper = new THREE.Group(); this.upper.name = 'openings';
    this.ceiling = new THREE.Group(); this.ceiling.name = 'ceiling';
    this.clearGroup(this.labelGroup);
    const H = plan.height;
    const T = (x: number, y: number) => this.toWorld(x, y);

    const wallMat = new THREE.MeshStandardMaterial({ color: s.wall, roughness: 0.92 });
    const frameMat = new THREE.MeshStandardMaterial({ color: s.frame, roughness: 0.5, metalness: 0.3 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: s.glass, roughness: 0.05, transmission: 0.6, transparent: true, opacity: 0.35, metalness: 0 });
    const doorMat = new THREE.MeshStandardMaterial({ color: s.door, roughness: 0.6 });

    const boxAt = (cx: number, cy: number, ux: number, uy: number, len: number, t: number, y0: number, y1: number) => {
      const g = new THREE.BoxGeometry(len, y1 - y0, t);
      const p = T(cx, cy);
      const m = new THREE.Matrix4().makeRotationY(Math.atan2(uy, ux));
      m.setPosition(p.x, (y0 + y1) / 2, p.z);
      g.applyMatrix4(m);
      return g;
    };

    // walls (one merged mesh) + sills
    const wg: THREE.BufferGeometry[] = [];
    for (const w of plan.walls) wg.push(boxAt(w.ox + (w.ux * w.len) / 2, w.oy + (w.uy * w.len) / 2, w.ux, w.uy, w.len, w.t, 0, H));
    const upperG: THREE.BufferGeometry[] = [];
    const frames: THREE.BufferGeometry[] = [];
    const glass: THREE.BufferGeometry[] = [];
    const leaves: THREE.BufferGeometry[] = [];
    for (const o of plan.openings) {
      if (o.kind === 'window') {
        wg.push(boxAt(o.cx, o.cy, o.ux, o.uy, o.width, o.t, 0, 0.9));
        if (H > 2.25) upperG.push(boxAt(o.cx, o.cy, o.ux, o.uy, o.width, o.t, 2.2, H));
        glass.push(boxAt(o.cx, o.cy, o.ux, o.uy, o.width - 0.04, 0.02, 0.9, 2.2));
        frames.push(boxAt(o.cx, o.cy, o.ux, o.uy, o.width, Math.min(o.t, 0.08), 0.88, 0.93));
        frames.push(boxAt(o.cx, o.cy, o.ux, o.uy, o.width, Math.min(o.t, 0.08), 2.17, 2.22));
        for (const k of [-1, 0, 1]) {
          const off = (k * (o.width - 0.05)) / 2;
          frames.push(boxAt(o.cx + o.ux * off, o.cy + o.uy * off, o.ux, o.uy, 0.05, Math.min(o.t, 0.08), 0.9, 2.2));
        }
      } else if (o.kind === 'door' || o.width <= 2.4) {
        const top = o.kind === 'door' || o.width <= 1.3 ? 2.1 : 2.4;
        if (H > top + 0.05) upperG.push(boxAt(o.cx, o.cy, o.ux, o.uy, o.width, o.t, top, H));
        if (o.leaf) {
          const a = o.leaf.a, b = o.leaf.b;
          const len = Math.hypot(b.x - a.x, b.y - a.y);
          leaves.push(boxAt((a.x + b.x) / 2, (a.y + b.y) / 2, (b.x - a.x) / len, (b.y - a.y) / len, len, 0.04, 0.01, 2.05));
        }
      }
    }
    const add = (geos: THREE.BufferGeometry[], material: THREE.Material, group: THREE.Group, name: string, shadow = true) => {
      if (!geos.length) return;
      const m = new THREE.Mesh(mergeGeometries(geos), material);
      m.name = name;
      m.castShadow = shadow; m.receiveShadow = true;
      group.add(m);
      geos.forEach((g) => g.dispose());
    };
    add(wg, wallMat, this.walls, 'walls');
    add(upperG, wallMat, this.upper, 'lintels');
    add(glass, glassMat, this.upper, 'glass', false);
    add(frames, frameMat, this.upper, 'window-frames');
    add(leaves, doorMat, this.model, 'doors');

    // floors and ceilings per room
    const floorMats = new Map<string, THREE.Material>();
    const fm = (spec: TexSpec) => {
      const k = JSON.stringify(spec);
      if (!floorMats.has(k)) floorMats.set(k, new THREE.MeshStandardMaterial({ map: floorTexture(spec), color: floorTexture(spec) ? '#ffffff' : spec.base, roughness: spec.kind === 'marble' ? 0.25 : 0.75 }));
      return floorMats.get(k)!;
    };
    const ceilMat = new THREE.MeshStandardMaterial({ color: s.ceiling, roughness: 1, side: THREE.DoubleSide });
    const ceilGeos: THREE.BufferGeometry[] = [];
    for (const r of plan.rooms) {
      const spec = r.type === 'bath' ? s.floor.wet : r.type === 'kitchen' ? s.floor.kitchen : r.type === 'balcony' ? s.floor.outdoor : s.floor.dry;
      const geo = rectsGeometry(r.rects, T, 0, spec.size);
      const mesh = new THREE.Mesh(geo, fm(spec));
      mesh.receiveShadow = true;
      mesh.name = 'floor-' + (r.name || r.type);
      this.model.add(mesh);
      if (r.type !== 'balcony') ceilGeos.push(rectsGeometry(r.rects, T, H, 1));
      // label
      const lab = this.opts.labels ? this.opts.labels(r.name, r.area) : `${r.name}\n${r.area.toFixed(1)} m²`;
      const sp = makeLabel(lab);
      const p = T(r.center.x, r.center.y);
      sp.position.set(p.x, this.cut ? 1.6 : H + 0.45, p.z);
      const k = Math.max(0.4, Math.min(0.9, this.span / 22));
      sp.scale.multiplyScalar(k);
      this.labelGroup.add(sp);
    }
    if (ceilGeos.length) {
      const m = new THREE.Mesh(mergeGeometries(ceilGeos), ceilMat);
      m.receiveShadow = true;
      m.name = 'ceiling';
      this.ceiling.add(m);
      ceilGeos.forEach((g) => g.dispose());
    }
    this.ceiling.visible = this.view === 'walk';
    this.model.add(this.walls, this.upper, this.ceiling);

    this.furniture = null;
    if (this.withFurniture) { this.furniture = furnish(plan, s, this.toWorld); this.model.add(this.furniture); }

    // ground and sun sized to the plan
    (this.ground.material as THREE.MeshStandardMaterial).color.set(s.ground);
    this.ground.scale.set(this.span * 6, this.span * 6, 1);
    this.scene.background = new THREE.Color(s.sky);
    const d = this.span * 0.85;
    this.sun.position.set(d * 0.6, d * 1.4, d * 0.8);
    this.sun.target.position.set(0, 0, 0);
    const sc = this.sun.shadow.camera;
    sc.left = sc.bottom = -this.span * 0.8; sc.right = sc.top = this.span * 0.8; sc.near = 0.5; sc.far = d * 4;
    sc.updateProjectionMatrix();
    this.setCut(this.cut);
    this.setLabels(this.showLabels);
    this.onChange?.();
  }

  // ---------------------------------------------------------------- views
  frame() {
    const s = this.span;
    // keep the whole plan in frame on narrow (portrait) viewports too
    const fit = 1.1 / Math.min(1, Math.max(0.45, this.camera.aspect)) ** 0.75;
    if (this.view === 'top') {
      this.camera.position.set(0, s * 1.55 * fit, s * 0.02);
      this.controls.target.set(0, 0, 0);
    } else if (this.view === 'orbit') {
      this.camera.position.set(s * 0.62, s * 0.95, s * 1.05).multiplyScalar(fit);
      this.controls.target.set(0, 0.4, 0);
    }
    this.camera.near = 0.05; this.camera.far = s * 40;
    this.camera.updateProjectionMatrix();
    this.controls.update();
  }

  setView(v: View) {
    this.view = v;
    const walk = v === 'walk';
    this.controls.enabled = !walk;
    this.ceiling.visible = walk;
    this.labelGroup.visible = this.showLabels && !walk;
    this.controls.autoRotate = !walk && !!this.opts.autoRotate;
    if (walk) {
      if (this.cut) this.setCut(false);
      this.camera.fov = 70;
      const start = this.walkStart();
      this.camera.position.set(start.x, 1.6, start.z);
      this.yaw = start.yaw; this.pitch = 0;
      this.applyLook();
    } else {
      this.camera.fov = 45;
      if (v === 'top' && !this.cut) this.setCut(true);
      if (v === 'orbit' && this.cut) this.setCut(false);
      this.frame();
    }
    this.camera.updateProjectionMatrix();
    this.onChange?.();
  }

  private walkStart() {
    const p = this.plan;
    if (!p || !p.rooms.length) return { x: 0, z: 0, yaw: 0 };
    const r = p.rooms.slice().sort((a, b) => (b.type === 'living' ? 100 : 0) + b.area - ((a.type === 'living' ? 100 : 0) + a.area))[0];
    const R = r.maxRect;
    // stand near one end of the room's longest axis, looking along it
    const alongX = R.x1 - R.x0 >= R.y1 - R.y0;
    const x = alongX ? R.x0 + (R.x1 - R.x0) * 0.3 : (R.x0 + R.x1) / 2;
    const y = alongX ? (R.y0 + R.y1) / 2 : R.y0 + (R.y1 - R.y0) * 0.3;
    const w = this.toWorld(x, y);
    return { x: w.x, z: w.z, yaw: alongX ? -Math.PI / 2 : 0 };
  }

  private applyLook() {
    const dir = new THREE.Vector3(-Math.sin(this.yaw) * Math.cos(this.pitch), Math.sin(this.pitch), -Math.cos(this.yaw) * Math.cos(this.pitch));
    this.camera.lookAt(this.camera.position.clone().add(dir));
  }

  private bindWalk() {
    const el = this.renderer.domElement;
    let drag: { x: number; y: number } | null = null;
    el.addEventListener('pointerdown', (e) => { if (this.view !== 'walk') return; drag = { x: e.clientX, y: e.clientY }; el.setPointerCapture(e.pointerId); });
    el.addEventListener('pointermove', (e) => {
      if (!drag || this.view !== 'walk') return;
      this.yaw += (e.clientX - drag.x) * 0.005;
      this.pitch = Math.max(-1.2, Math.min(1.2, this.pitch - (e.clientY - drag.y) * 0.004));
      drag = { x: e.clientX, y: e.clientY };
      this.applyLook();
    });
    el.addEventListener('pointerup', () => { drag = null; });
    el.addEventListener('pointercancel', () => { drag = null; });
    el.tabIndex = 0;
    el.addEventListener('keydown', (e) => { if (this.view === 'walk' && /^(Arrow|Key[WASD])/.test(e.code)) { this.keys.add(e.code); e.preventDefault(); } });
    el.addEventListener('keyup', (e) => this.keys.delete(e.code));
    el.addEventListener('blur', () => this.keys.clear());
  }

  /** Hold-to-move from on-screen buttons: f = forward(+)/back(-), s = right(+)/left(-). */
  setMove(f: number, s: number) { this.moveVec = { f, s }; }
  turn(d: number) { this.yaw += d; this.applyLook(); }

  private walkable(x: number, z: number) {
    const g = this.plan?.grid;
    if (!g) return true;
    const px = x + this.center.x, py = -z + this.center.z;
    for (const [dx, dy] of [[0.18, 0], [-0.18, 0], [0, 0.18], [0, -0.18], [0, 0]]) {
      const i = Math.round((px + dx - g.x0) / g.cell), j = Math.round((py + dy - g.y0) / g.cell);
      if (i < 0 || j < 0 || i >= g.w || j >= g.h) continue;
      const v = g.v[j * g.w + i];
      if (v === 1 || v === 3) return false;
    }
    return true;
  }

  private stepWalk(dt: number) {
    let f = this.moveVec.f, s = this.moveVec.s;
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) f += 1;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) f -= 1;
    if (this.keys.has('KeyD')) s += 1;
    if (this.keys.has('KeyA')) s -= 1;
    if (this.keys.has('ArrowLeft')) this.turn(-1.6 * dt);
    if (this.keys.has('ArrowRight')) this.turn(1.6 * dt);
    if (!f && !s) return;
    const sp = 1.6 * dt;
    const fx = -Math.sin(this.yaw), fz = -Math.cos(this.yaw);
    const rx = Math.cos(this.yaw), rz = -Math.sin(this.yaw);
    const nx = this.camera.position.x + (fx * f + rx * s) * sp;
    const nz = this.camera.position.z + (fz * f + rz * s) * sp;
    if (this.walkable(nx, nz)) { this.camera.position.x = nx; this.camera.position.z = nz; }
    else if (this.walkable(nx, this.camera.position.z)) this.camera.position.x = nx;
    else if (this.walkable(this.camera.position.x, nz)) this.camera.position.z = nz;
    this.applyLook();
  }

  // ---------------------------------------------------------------- loop / output
  private resize() {
    const w = this.host.clientWidth || 1, h = this.host.clientHeight || 1;
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop);
    const now = performance.now();
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    if (!this.visible || document.hidden) return;
    if (this.view === 'walk') this.stepWalk(dt);
    else this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  snapshot(type = 'image/jpeg', q = 0.9, maxW = 0): string {
    this.renderer.render(this.scene, this.camera);
    const src = this.renderer.domElement;
    if (!maxW || src.width <= maxW) return src.toDataURL(type, q);
    const c = document.createElement('canvas');
    c.width = maxW; c.height = Math.round((src.height / src.width) * maxW);
    c.getContext('2d')!.drawImage(src, 0, 0, c.width, c.height);
    return c.toDataURL(type, q);
  }

  private exportRoot() {
    const root = this.model.clone(true);
    root.traverse((o) => { o.visible = true; });
    root.scale.set(1, 1, 1);
    const w = root.getObjectByName('walls');
    if (w) w.scale.y = 1;
    return root;
  }

  /** dollhouse: without the ceiling, for AR */
  async exportGLB(dollhouse = false): Promise<Blob> {
    const { GLTFExporter } = await import('three/addons/exporters/GLTFExporter.js');
    const root = this.exportRoot();
    if (dollhouse) {
      const drop: THREE.Object3D[] = [];
      root.traverse((o) => { if (o.name === 'ceiling') drop.push(o); });
      drop.forEach((o) => o.removeFromParent());
      // centre on the floor so AR places the model around the tap point
      const bb = new THREE.Box3().setFromObject(root);
      const c = bb.getCenter(new THREE.Vector3());
      const wrap = new THREE.Group();
      root.position.set(root.position.x - c.x, root.position.y - bb.min.y, root.position.z - c.z);
      wrap.add(root);
      const buf = (await new GLTFExporter().parseAsync(wrap, { binary: true })) as ArrayBuffer;
      return new Blob([buf], { type: 'model/gltf-binary' });
    }
    const buf = (await new GLTFExporter().parseAsync(root, { binary: true })) as ArrayBuffer;
    return new Blob([buf], { type: 'model/gltf-binary' });
  }

  async exportOBJ(): Promise<Blob> {
    const { OBJExporter } = await import('three/addons/exporters/OBJExporter.js');
    const txt = new OBJExporter().parse(this.exportRoot());
    return new Blob(['# Oxira Design - units: metres, Y up\n' + txt], { type: 'text/plain' });
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    this.ro.disconnect(); this.io.disconnect();
    this.controls.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}

function rectsGeometry(rects: Rect[], T: (x: number, y: number) => THREE.Vector3, y: number, texSize: number) {
  const pos: number[] = [], uv: number[] = [], nor: number[] = [], idx: number[] = [];
  for (const r of rects) {
    const base = pos.length / 3;
    const pts = [T(r.x0, r.y0), T(r.x1, r.y0), T(r.x1, r.y1), T(r.x0, r.y1)];
    const raw = [[r.x0, r.y0], [r.x1, r.y0], [r.x1, r.y1], [r.x0, r.y1]];
    pts.forEach((p, k) => { pos.push(p.x, y, p.z); nor.push(0, y > 0 ? -1 : 1, 0); uv.push(raw[k][0] / texSize, raw[k][1] / texSize); });
    if (y > 0) idx.push(base, base + 2, base + 1, base, base + 3, base + 2);
    else idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}

function makeLabel(text: string): THREE.Sprite {
  const lines = text.split('\n');
  const c = document.createElement('canvas');
  const fs = 44;
  const g = c.getContext('2d')!;
  const font = (w: number) => `${w} ${fs}px "IBM Plex Sans", ${document.documentElement.lang === 'ur' ? 'Cairo' : 'Tajawal'}, system-ui, sans-serif`;
  g.font = font(700);
  const w = Math.ceil(Math.max(...lines.map((l, i) => { g.font = font(i ? 500 : 700); return g.measureText(l).width; }))) + 48;
  const h = lines.length * (fs + 10) + 28;
  c.width = w; c.height = h;
  g.fillStyle = 'rgba(10,37,62,0.86)';
  const r = 18;
  g.beginPath(); g.roundRect(0, 0, w, h, r); g.fill();
  g.textAlign = 'center'; g.textBaseline = 'middle';
  lines.forEach((l, i) => { g.font = font(i ? 500 : 700); g.fillStyle = i ? '#F5A800' : '#FFFFFF'; g.fillText(l, w / 2, 14 + (fs + 10) * (i + 0.5)); });
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
  sp.renderOrder = 10;
  sp.scale.set(w / 120, h / 120, 1);
  return sp;
}
