# Technical Documentation

## 1. Product goal

The portal centralizes authentic temple heritage and pilgrimage information for pilgrims, tourists and researchers.

## 2. Functional requirements mapping

| Video requirement | Implementation |
|---|---|
| Web-based responsive portal | React responsive UI + Bootstrap |
| State/city listings | Search filters and directory |
| History | Temple detail page |
| Deity/significance | Temple detail page |
| Rituals/pooja | Temple detail page |
| Darshan timings | Temple detail page |
| Festivals | Temple detail page |
| Dress code/rules | Temple detail page |
| Accommodation/transport | Temple detail page |
| State/city/deity search | Combined search/filter |
| Popular circuits | Pilgrimage Circuits page |
| Featured temples | Featured section |
| Content creation/update | Admin CMS |
| Approval of information | Approve action + verified flag |
| Category management | Admin Categories |
| Region management | Admin Regions |
| Save/share | Browser local save + Web Share/clipboard |
| Location-based discovery | Browser geolocation + nearest API |
| KPIs | Admin dashboard |
| Secure access control | JWT-protected admin routes |

## 3. Core entities

### Temple
- id
- name
- state
- city
- deity
- category
- history
- significance
- rituals
- poojaSchedule
- darshan
- festivals
- dressCode
- rules
- accommodation
- transport
- lat/lng
- featured
- verified

### Event
- type
- templeId
- createdAt

### Taxonomy
- categories
- regions

## 4. API

Public:
- `GET /api/health`
- `GET /api/temples`
- `GET /api/temples/:id`
- `GET /api/temples/nearby?lat=&lng=`
- `POST /api/analytics/event`
- `POST /api/auth/login`

Admin:
- `GET /api/admin/dashboard`
- `GET /api/admin/temples`
- `POST /api/admin/temples`
- `PUT /api/admin/temples/:id`
- `PATCH /api/admin/temples/:id/approve`
- `DELETE /api/admin/temples/:id`
- `GET/POST /api/admin/categories`
- `GET/POST /api/admin/regions`

## 5. KPI definitions

- Number of temples listed — count of stored temple records.
- Monthly active users — event-based estimate when MongoDB analytics are enabled; demo fallback uses sample KPI data.
- Search success rate — successful search events / search events.
- Page engagement time — demo metric until richer analytics are connected.
- User satisfaction score — demo/admin-entered metric.

## 6. Security

- Admin routes require JWT.
- `.env` is ignored by Git.
- Credentials are configurable through environment variables.
- Never commit production secrets.

## 7. Performance

The UI is built with a lightweight Vite production bundle and Bootstrap. The requirement states a target page load below 3 seconds; actual load time must be measured after deployment with the target hosting, network and content.

## 8. Accessibility and usability

- Responsive layouts
- Keyboard-friendly standard form controls
- Clear navigation
- High-contrast text
- Mobile-first Bootstrap grid
- Simple, culturally respectful visual language

## 9. Verification workflow

New admin-created content starts as unverified. An administrator can edit it and approve it. Public listing APIs only return verified content.

## 10. Future enhancements

Kept outside Phase 1 as shown in the video:
- Online darshan and puja booking
- Donation/charity modules
- Multilingual support
- Mobile applications
- Interactive maps and advanced pilgrimage route planning


### Performance target
The implementation is optimized for the requirement that key pages should load in under 3 seconds. Production static assets are cacheable, HTTP compression is enabled, third-party font loading was removed from the critical path, and Vite produces optimized/minified assets. This is a target, not a guaranteed measurement; verify the deployed site with Lighthouse/PageSpeed.
