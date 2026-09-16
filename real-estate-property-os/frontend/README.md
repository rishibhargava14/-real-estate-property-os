# Property OS — frontend

Next.js (App Router) frontend for the Real Estate Property OS, built against
the API surface in the build sheet.

## Setup

```
cd frontend
npm install
cp .env.local.example .env.local   # point at your backend + uploads origin
npm run dev
```

Runs on http://localhost:3000. Expects the backend on http://localhost:5000/api,
and uploaded images served from http://localhost:5000/uploads/... (both
configurable in `.env.local`).

## Structure

```
app/
  layout.jsx, globals.css, page.jsx      root shell + redirect to /login or /dashboard
  login/page.jsx                          sign in / register company (toggle)
  (app)/layout.jsx                        authenticated shell: sidebar + storefront link
  (app)/dashboard/page.jsx
  (app)/properties/page.jsx               grid + create-listing modal (multi-image upload)
  (app)/sitevisits/page.jsx               month calendar + day table + actions
  (app)/leads/page.jsx
  (app)/map/page.jsx                      Leaflet map, dynamically imported (client-only)
  (app)/photo-proof/page.jsx              geo-tagged upload + gallery
  (app)/settings/page.jsx                 language/tokens + audit export
  public/[subdomain]/page.jsx             public storefront — no auth, no sidebar
lib/api.js, lib/format.js                 axios instance, auth header, ₹ formatting
components/                               Sidebar, PropertyCard, PropertyMap, badges, StatCard
```

The `(app)` folder is a route group — it doesn't appear in the URL, so
`/dashboard`, `/properties`, etc. match the build sheet's paths exactly while
sharing one sidebar layout.

**Public storefront URL**: the build sheet's structure list gives the file as
`app/public/[subdomain]/page.jsx`, which is what's implemented here — so the
live URL is `/public/:subdomain`. Section 5's prose describes it as
`/property/:subdomain`; if that path is what you actually want, rename the
folder to `app/property/[subdomain]/page.jsx` (everything else is unaffected).

## Auth

JWT in `localStorage` under `token`, attached as a `Bearer` header by
`lib/api.js`, with a redirect to `/login` on 401. `companyId`, `companyName`,
and `subdomain` are cached alongside it from the login response — every
authenticated call passes `companyId` as a param/body field.

## Map

`components/PropertyMap.jsx` wraps `react-leaflet` and is only ever loaded via
`next/dynamic(..., { ssr: false })` from `(app)/map/page.jsx`, since Leaflet
needs `window`. Pins are colored by status (green available, amber rented,
rose sold) using inline SVG-free `divIcon`s rather than Leaflet's default
marker images, so there's nothing to configure for image asset paths.

## Endpoints the UI calls that weren't itemized in the build sheet

Section 4 covers the create/list/report actions, but a handful of
supporting endpoints are implied by the pages themselves. The frontend calls
them with the shapes below and fails gracefully (empty states, silent no-ops)
if they don't exist yet — flag these to the backend dev:

| Endpoint | Used by | Expected shape |
|---|---|---|
| `PATCH /api/sitevisits/:id` `{ status }` | Complete / Cancel buttons on Site visits | updated `SiteVisit` |
| `GET /api/settings?companyId=` | Settings page, on load | `{ language, whatsappToken, upiToken, googleMapApiKey }` |
| `PATCH /api/settings` | Settings page, Save | same shape, echoed back |

Two more calls reuse endpoints already in section 4 but with a request shape
worth double-checking against the backend:

- **WhatsApp inquiry** on the public storefront submits to
  `POST /api/leads/create` with `source: "WhatsApp"` rather than
  `POST /api/whatsapp/send` — the latter is what the backend uses to *send*
  outbound messages (cron reminders, replies), not to capture an inbound web
  form, and the Company model has no stored WhatsApp number for the frontend
  to message directly.
- **Reminder** button on Site visits calls `POST /api/whatsapp/send` with
  `{ type: "sitevisit-reminder", phone, propertyId, language }` — the build
  sheet doesn't give the exact body for this endpoint, so confirm the field
  names match what the backend expects.

## Design

Deep "blueprint" navy (`#16324F`) sidebar and storefront hero, warm sand
background, brass gold for prices and hot leads, forest green / rose for
available / sold. Property cards use soft shadows and rounded corners (unlike
a flat admin ledger) since photography is the point on both the internal grid
and the public storefront. Type is Newsreader (serif, headings) over Manrope
(UI) and JetBrains Mono (ids, coordinates, timestamps). Tokens live in
`tailwind.config.js` and `app/globals.css`.
