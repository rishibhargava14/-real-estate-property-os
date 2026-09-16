# Real Estate Property OS — Monorepo

This combines the two separate uploads into one repo:

```
real-estate-property-os/
├── frontend/     (Next.js 14 App Router — re-frontend)
├── backend/      (Express + MongoDB API)
├── package.json  (root scripts to run both together)
└── .gitignore
```

They were already built to talk to each other over HTTP (no code changes
made) — the frontend calls the backend at `NEXT_PUBLIC_API_URL`, and the
backend allows that origin via `FRONTEND_URL` in CORS. Joining them here just
means one repo, one `git clone`, one command to run both in dev.

## Run locally

```bash
npm run install:all      # installs backend + frontend deps
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
# edit backend/.env: set MONGODB_URI and JWT_SECRET at minimum
npm run dev               # runs backend (:5000) and frontend (:3000) together
```

Backend health check: `http://localhost:5000/api/health`
Frontend: `http://localhost:3000`

Default `.env.local` already points the frontend at
`http://localhost:5000/api` and `http://localhost:5000` (uploads), so no
edits are needed there for local dev.

## Deploying them together

They deploy as two separate services that reference each other by URL — this
is the standard pattern for a Next.js + Express app, and requires no
extra glue code beyond setting the right environment variables on each side.

**1. Database — MongoDB Atlas**
Create a free-tier cluster, add a database user, allow network access from
your backend host (or `0.0.0.0/0` for simplicity early on), and copy the
connection string into `MONGODB_URI`.

**2. Backend — Render or Railway**
- New Web Service → point at `backend/` as the root/build directory.
- Build command: `npm install`. Start command: `npm start`.
- Env vars: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV=production`,
  and `FRONTEND_URL` = your deployed frontend's URL (needed for CORS).
- **Uploads**: `backend/src/middleware/upload.middleware.js` and
  `app.js` currently write/serve from the local `uploads/` folder. Render and
  Railway use ephemeral disks, so files uploaded (property photos, geotagged
  photo proofs) will vanish on redeploy/restart. For anything beyond a demo,
  swap the multer disk storage for Cloudinary or S3-compatible storage before
  going live — the backend README already flags this.
- Note your backend's public URL, e.g. `https://propertyos-api.onrender.com`.

**3. Frontend — Vercel**
- Import the repo, set the project root to `frontend/`.
- Env vars: `NEXT_PUBLIC_API_URL` = `https://propertyos-api.onrender.com/api`,
  `NEXT_PUBLIC_UPLOADS_URL` = `https://propertyos-api.onrender.com`.
- Deploy. Vercel gives you a URL like `https://propertyos.vercel.app`.

**4. Close the loop**
Go back to the backend service and set `FRONTEND_URL` to the Vercel URL from
step 3, then redeploy the backend so CORS allows it.

## Things worth fixing before this is production-ready

Flagged in the frontend's own README, still true after joining the repos:

- The frontend calls `PATCH /api/sitevisits/:id`, `GET /api/settings`, and
  `PATCH /api/settings` — none of these routes exist in the backend yet
  (only `/api/auth`, `/api/properties`, `/api/sitevisits`, `/api/leads`,
  `/api/photo`, `/api/whatsapp`, `/api/audit`, `/api/dashboard` are wired up
  in `app.js`). Site-visit status changes and the Settings page will fail
  silently until these are added.
- Public storefront path: implemented at `app/public/[subdomain]/page.jsx`
  (`/public/:subdomain`); if you want `/property/:subdomain` instead, rename
  that folder.
- Local disk uploads → move to Cloudinary/S3 before production, per above.
