# Oxira Design — design.oxira.sa

From an AutoCAD plan (DXF) to a 3D interior in the browser: walls, doors, windows, rooms and areas,
automatic furnishing in five styles, walkthrough, estimated quantities, GLB/OBJ export for 3ds Max,
AI renders, an AI chat assistant and paid team packages. Arabic by default, plus English, German, French and Russian.

Built with [Astro](https://astro.build) and three.js, deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm run test:plan  # runs the DXF engine on the sample plans, writes SVG previews to /tmp/claude-0/plan-test
npm run test:planner  # generates concept plans, reads them back with the DXF engine, writes SVG + DXF to /tmp/claude-0/planner-test
```

## Where things live

| What | Where |
| --- | --- |
| Site copy (ar, en, de, fr, ru; es, tr, zh, hi, ur in `src/i18n/locales/`), contact details, n8n URLs, **prices** | `src/i18n/content.ts` (`PRICES`) |
| Studio copy (new languages in `src/i18n/locales/`) | `src/i18n/studio.ts` |
| Landing page sections | `src/components/Home.astro` |
| Studio page (panel, viewport, dialogs) | `src/components/Studio.astro` |
| Order form (used on the landing page and inside the studio) | `src/components/OrderForm.astro` |
| "Design my plan" page (plot + programme → editable concept plan, or upload a plan to complete) | `src/components/Planner.astro`, copy in `src/i18n/planner.ts` |
| Plan generator, slicing-tree editor, doors/windows | `src/scripts/planner/model.ts` |
| Plan SVG and DXF (AutoCAD R12, opens in the studio) | `src/scripts/planner/render.ts` |
| Planner page controller | `src/scripts/planner/app.ts` |
| PDF first page → image (pdf.js, loaded on demand) | `src/scripts/pdfImage.ts` |
| Chat widget | `src/components/Chat.astro` |
| DXF reader (blocks, units, layer roles) | `src/scripts/studio/dxf.ts` |
| Plan engine: walls from parallel lines, openings, rooms, areas | `src/scripts/studio/plan.ts` |
| 3D viewer, views, export | `src/scripts/studio/viewer.ts` |
| Styles and procedural floor textures | `src/scripts/studio/styles.ts` |
| Automatic furniture | `src/scripts/studio/furnish.ts` |
| Quantities (BOQ) | `src/scripts/studio/boq.ts` |
| Studio controller | `src/scripts/studio/app.ts` |
| Sample plans and their generator | `public/samples/*.dxf`, `samples-src/make_samples.py` |
| Brand colours and base styles (same as oxira.sa) | `src/styles/global.css` |
| n8n workflow source (the live workflow in n8n is the source of truth) | `n8n/oxira-design.workflow.ts` |

## How the automation reads a plan

1. **Layers**: roles are guessed from layer names in Arabic, English, German, French and Russian
   (`جدران`, `A-WALL`, `Wand`, `mur`, `стены` …). Door and window blocks are detected by block name.
   The visitor can change any role in the studio.
2. **Units**: `$INSUNITS` from the header, or guessed from the drawing size.
3. **Walls**: pairs of parallel lines 5–60 cm apart become wall boxes; corners and T-junctions are filled;
   long single lines become thin walls.
4. **Openings**: gaps between collinear walls, classified as door or window from the symbols drawn there.
   Gaps crossed by other walls (corridor ends) are rejected.
5. **Rooms**: the plan is rasterised (~5 cm cells), openings are closed, and a flood fill finds every room.
   Room names come from text inside the room and set the room type (bedroom, bath, kitchen …).

Everything runs in the visitor's browser; nothing is uploaded unless they order or ask for an AI render.

## n8n workflow "Oxira Design"

| Endpoint | Purpose |
| --- | --- |
| `POST /webhook/oxira-design-chat` | AI chat agent (`{ sessionId, message, lang, page, context }` → `{ reply }`). Saves requests to `oxira_design_leads` and emails info@oxira.sa |
| `POST /webhook/oxira-design-order` | Order form and the plan page (`package = plan`, quote only), multipart with files. Saves to `oxira_design_orders`, emails info@oxira.sa with attachments, confirms to the client. Quick package → Moyasar invoice → `{ payUrl }` |
| `POST /webhook/oxira-design-moyasar-callback` | Moyasar callback for design invoices: confirms with Moyasar, marks the order paid, emails team and client |
| `POST /webhook/oxira-design-payment-status` | `{ orderId }` → payment status |
| `POST /webhook/oxira-plan-ai` | Workflow "Oxira Design — Plan AI" (`n8n/oxira-design-ai.workflow.ts`): Claude turns a description into plan settings (`kind: brief`) or reads a plan image into room rectangles (`kind: image`). Daily limits per IP |
| `POST /webhook/oxira-design-render` | AI render from a studio snapshot, 3 per visitor per day and a global daily cap, logged in `oxira_design_renders` |

Allowed origins: `https://design.oxira.sa`, `https://ibrasalato.github.io`, `http://localhost:4321`.
Prices are checked on the server (n8n node "Price order"); keep them in sync with `PRICES` in `content.ts`.

## DNS and Pages

DNS: CNAME `design` → `ibrasalato.github.io`. In the repo's **Settings → Pages**: Source **GitHub Actions**,
custom domain `design.oxira.sa`, then **Enforce HTTPS**.

## Plan designer (/plan/)

The visitor enters the plot (width, depth, street, setbacks), picks villa, duplex, apartment building,
shops + apartments or istiraha, the rooms, and the drawings they need. A concept plan is drawn per floor
in the browser: every floor is a slicing tree, so walls can be dragged, rooms split, removed, swapped and
renamed; doors and windows are derived again after every edit. The plan downloads as DXF, prints to PDF,
and any floor opens in the 3D studio (`/studio/?from=plan`). Or the visitor uploads a plan (PDF, DWG, DXF,
images) and says what to complete. Requests go to the order webhook with `package = plan`; the brief is in
`notes` (Arabic, for the team) and `summary` (JSON), the generated plan is attached as `oxira-plan.dxf`.
Every upload on the site accepts PDF: the redesign page uses the first page as the photo, the studio sends
PDFs to the team.

## Accounts and designer portal (/account/)

- Sign-in by emailed link: `oxira-design-login` stores a 40-hex token (30 days) in `oxira_portal_tokens` (role `design`); the page keeps it in localStorage `ox-acc-k`.
- `oxira-design-account` {k, action, data}: `load`, `project`, `save`, `delete` (plans in `oxira_design_projects`), `comment` (per-order thread in `oxira_design_comments`, emailed to the other side), `rate`, `apply`, `claim`.
- Plans: "Save to my account" in the plan designer; `/plan/?p=<pid>` opens your own plan, `/plan/?s=<share>` opens a shared copy (read through `oxira-design-share`). A saved plan's share id goes into the order summary so the designer can open it.
- Designers: apply from the account page → row in `oxira_design_designers` with status `pending`; set `active` (or `admin`) by hand. Active designers see open orders, take them, message the client and deliver files (`oxira-design-deliver`, multipart, emailed to the client with bcc info@, order marked تم التسليم).
- n8n source: `n8n/oxira-design-accounts.workflow.ts` (workflow "Oxira Design — Accounts", id kQlWsL3JiIVlDEut).

## IFC export and AR

- `src/lib/ifc.ts`: small IFC4 writer (storeys, walls, doors and windows in real openings, slabs, IfcSpace rooms; metres, non-ASCII names as \X2\). Used by the plan designer (`src/scripts/planner/ifc.ts`, all floors, 3.2 m storeys) and the studio (`src/scripts/studio/ifc.ts`, one storey at the chosen wall height). Checked with ifcopenshell: no schema issues, geometry builds.
- AR in the studio: the model (without ceilings, centred) goes to `<model-viewer>` (`@google/model-viewer` 4.3.1, loaded on demand): WebXR on Android Chrome, Quick Look on iPhone (USDZ made in the browser). Table-top (1:20) or real size.

## Languages

Ten languages: ar (default, no prefix, RTL), en, de, fr, ru, es, tr, zh, hi, ur (RTL). The first five live in each file under `src/i18n/`; the other five each have one file in `src/i18n/locales/<code>.ts` holding all their copy (content, planner, studio, redesign, region, account, legal, tour) in the same shapes. To add a language: add it to `Lang` and `languages` in `content.ts`, to `astro.config.mjs`, copy a locale file and translate it, add it to `locales/index.ts` and the records, add `public/flags/<flag>.svg` and run `OG_ONLY=<code> python3 scripts/og.py` with the preview running. RTL languages: set `dir: "rtl"` in the copy and add the code to `isRtl`.

## Ready-made plan pages (/plans/)

`src/lib/plans.ts` builds the catalogue at build time: plot sizes × villa / single-storey house / duplex / apartment building × bedrooms, keeping only plans the generator lays out without warnings (it tries up to 4 layout variants) and dropping room counts that give the same plan on the same plot. Each plan gets `/plans/<slug>/` in all 10 languages (`src/components/PlanPage.astro`): drawings of every floor, room schedule, facts and "Open and edit" → `/plan/?plan=<slug>&v=<variant>`, which loads the same brief and variant in the editor. Copy: `src/i18n/plans.ts` (ar, en) and `src/i18n/plans/<code>.ts`. To add sizes or types, edit `SIZES` / `BEDS` there.

## Gallery, embeds, designer directory, Pro waitlist

- `/gallery/`: plans users publish from their account (`publish` action → column `public` in `oxira_design_projects`; the team gets an email and can hide one by setting `public` to false). Cards are drawn in the browser; "Remix" opens an editable copy (`/plan/?s=`). Feed: `oxira-design-gallery`.
- `/embed/?s=<share>&l=<lang>`: iframe widget for other websites, always branded and linking back. Embed code from the account page and the plan designer (`src/lib/embed.ts`).
- "Made with Oxira Design" mark on studio PNG exports, free AI renders and the plan print (`src/lib/watermark.ts`).
- `/designers/`: active designers with average client rating and recent reviews (`oxira-design-designers`, no emails exposed).
- Pro waitlist block (home page and /designers/): `oxira-design-waitlist` → `oxira_design_waitlist`, email to info@.
- Copy for all of this: `src/i18n/growth.ts`.

## Growth automations (n8n "Oxira Design — Growth", id uA2x3tFR9fJFmlrX)

- Daily 10:00 Riyadh: follow-up email for plans saved 2–14 days ago by people who have not ordered (`nudged`), rating request 3–30 days after delivery (`review_asked`), new unassigned orders emailed (bcc) to active designers (`notified_designers`). Every email has an unsubscribe link (`oxira-design-optout` → `oxira_design_optout`).
- Sunday 09:00 Riyadh: the week in numbers plus "plan of the week" captions for Instagram, Pinterest, TikTok and X written by Claude, emailed to info@.
- Source: `n8n/oxira-design-growth.workflow.ts`.
- Deploys ping IndexNow (Bing, Yandex, Seznam, Naver) with every URL from the sitemap; key file in `public/`. For Google, submit `https://design.oxira.sa/sitemap.xml` once in Search Console.

## Photoreal render (path traced, Corona-style)

The studio's render button runs a real path tracer in the visitor's browser
(`src/scripts/studio/pathtrace.ts`, loaded only when used; library `three-gpu-pathtracer`).

- Physically based light: sun + sky dome, 5 bounces outside / 8 inside (global illumination), auto exposure,
  denoise, then a camera finish (soft bloom, S-curve, vignette), in the spirit of Corona Renderer.
- The sun is placed about 110° off the camera heading so wall shadows fall into view.
- Walk views use two-point perspective (level camera, shifted frame) so verticals stay vertical.
- Quality: Fast 160 / High 480 / Ultra 1200 samples (interiors ×2). Free and unlimited, nothing leaves the browser.
- Browsers without WebGL2 float render targets fall back to the AI render.
- "AI finishing touch" sends the finished frame to n8n (`Oxira Design` → `Check render request`, `source: "traced"`),
  which asks `gpt-image-2` (quality high, direct `/v1/images/edits` call) for a Corona-style finish on the same
  camera, layout and sun direction. It uses the same free quota as the AI render (3 per visitor, 150 per day).
- Test hook: `?ptw=480` forces the render width.
