# India Temple Heritage & Pilgrimage Information Portal — Complete

A deployment-ready Phase 1 web portal built against the requirements shown in the supplied Unified Mentor project video.

## Requirements covered

### In scope
- Responsive desktop/mobile web portal
- State-wise and city-wise temple listings
- Temple history
- Deity details and significance
- Rituals and daily pooja schedules
- Darshan timings
- Festival calendars
- Dress code and visitor rules
- Nearby accommodation and transport
- State/city/deity/name search
- Popular pilgrimage circuits
- Featured temples
- Admin content creation and updates
- Approval/verification workflow
- Category and region management
- Save/share temple information
- Location-based nearby temple discovery
- KPI dashboard
- Secure admin authentication
- Technical documentation
- Deployment configuration

### Intentionally out of scope
- Online donation
- Online puja booking
- Live darshan streaming
- Native mobile applications
- Multilingual voice assistance

## Technology
- React + Vite
- Bootstrap 5 + Bootstrap Icons
- Node.js + Express
- MongoDB/Mongoose when configured
- JSON fallback for local demo
- JWT admin authentication

## Run locally

1. Install Node.js 20+.
2. Extract this project.
3. Open the project folder in VS Code.
4. Run:

```bash
npm install
npm run dev
```

5. Open the Vite URL shown in the terminal (usually http://localhost:5173).

The backend runs on port 5000. Vite proxies are not required for this starter because the API uses `/api`; for local Vite development, set `VITE_API_URL=http://localhost:5000/api` in `client/.env` if your browser cannot reach the API through the same origin.

### Production build

```bash
npm install
npm run build
npm start
```

Then open http://localhost:5000.

## Admin

Open `/admin`.

Demo credentials:
- Email: `admin@templeheritage.local`
- Password: `ChangeMe123!`

Change these credentials before deployment.

## MongoDB

Copy `.env.example` to `.env` and add:

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-long-random-secret
ADMIN_EMAIL=your-admin-email
ADMIN_PASSWORD=your-strong-password
```

If MongoDB is not configured, the demo uses `data/temples.json` so the project remains runnable.

## Deployment

`render.yaml` is included for a Node-compatible deployment. For Vercel/Netlify, deploy the React client separately and host the Express API on a Node-compatible service.

## Important content note

The sample temple content is demonstration content. For a real public portal, admins should manually verify temple information against official temple/heritage sources before publishing.

## Project structure

- `client/` — React + Vite frontend
- `server/` — Express API and admin authentication
- `data/` — JSON fallback data
- `DOCUMENTATION.md` — technical and requirements mapping
- `render.yaml` — deployment configuration


## Performance optimization
The production build is configured for the Phase 1 page-load target of under 3 seconds. Optimizations include minified Vite output, no render-blocking third-party fonts, Brotli/Gzip-capable HTTP compression, long-lived caching for hashed static assets, short caching for temple directory API responses, and a lightweight first render. Actual page-load time must still be measured after deployment using Lighthouse/PageSpeed on the deployed URL.
