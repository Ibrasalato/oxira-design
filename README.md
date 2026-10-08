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
```

## Where things live

| What | Where |
| --- | --- |
| Site copy in 5 languages, contact details, n8n URLs, **prices** | `src/i18n/content.ts` (`PRICES`) |
| Studio copy in 5 languages | `src/i18n/studio.ts` |
| Landing page sections | `src/components/Home.astro` |
| Studio page (panel, viewport, dialogs) | `src/components/Studio.astro` |
| Order form (used on the landing page and inside the studio) | `src/components/OrderForm.astro` |
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
| `POST /webhook/oxira-design-order` | Order form, multipart with files. Saves to `oxira_design_orders`, emails info@oxira.sa with attachments, confirms to the client. Quick package → Moyasar invoice → `{ payUrl }` |
| `POST /webhook/oxira-design-moyasar-callback` | Moyasar callback for design invoices: confirms with Moyasar, marks the order paid, emails team and client |
| `POST /webhook/oxira-design-payment-status` | `{ orderId }` → payment status |
| `POST /webhook/oxira-design-render` | AI render from a studio snapshot, 3 per visitor per day and a global daily cap, logged in `oxira_design_renders` |

Allowed origins: `https://design.oxira.sa`, `https://ibrasalato.github.io`, `http://localhost:4321`.
Prices are checked on the server (n8n node "Price order"); keep them in sync with `PRICES` in `content.ts`.

## DNS and Pages

DNS: CNAME `design` → `ibrasalato.github.io`. In the repo's **Settings → Pages**: Source **GitHub Actions**,
custom domain `design.oxira.sa`, then **Enforce HTTPS**.
