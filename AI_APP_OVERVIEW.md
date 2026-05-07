# HamroAwaaz App Overview

## What this project is
HamroAwaaz is a complaint-reporting and municipal response system for citizens and administrators.

The product has three parts:
- `user-app`: a mobile app for citizens to submit complaints with photos and location.
- `admin-portal`: a web dashboard for municipal staff to review, assign, and resolve complaints.
- `backend`: an Express + MongoDB API that stores complaints and serves them to both apps.

## Main idea
A citizen opens the mobile app, chooses a complaint category, adds a photo, and shares a location. The complaint is sent to the backend and stored in MongoDB. The admin portal reads those complaints, shows them in dashboards and maps, and allows admins to update status and assign officers.

## Core workflow
1. User signs in or enters the app.
2. User creates a complaint in `user-app/app/(tabs)/report.tsx`.
3. Complaint is posted to `backend/routes/reportRoutes.js`.
4. Backend saves the report in MongoDB using `backend/models/Report.js`.
5. Admin portal fetches reports from `/api/reports/all`.
6. Admin updates complaint status or officer assignment through `/api/reports/:id`.
7. User app fetches report list to show in home, my-reports, and profile tabs.

## API host resolution
- **Admin portal** (`admin-portal/src/App.jsx`): Uses `VITE_API_BASE_URL` env var or defaults to `http://localhost:5000`
- **User app** (`user-app/constants/api.ts`): Dynamic resolution:
  - If `EXPO_PUBLIC_API_BASE_URL` is set, use that.
  - Otherwise, detect Expo dev server host and use that + `:5000`.
  - Android emulator fallback: `http://10.0.2.2:5000`
  - Default: `http://localhost:5000`


## Project structure
### Backend
Important files:
- `backend/server.js` - Express server, CORS, MongoDB connection, API mounting.
- `backend/routes/reportRoutes.js` - complaint list, update, and create routes.
- `backend/models/Report.js` - MongoDB schema for complaints.

What it does:
- Serves complaint data through REST endpoints.
- Accepts uploaded photos with `multer`.
- Exposes a simple admin login endpoint.

### Admin portal
Important files:
- `admin-portal/src/App.jsx` - main portal UI, routing, dashboard, map, analytics, settings, login, and modal views.
- `admin-portal/src/index.css` - global layout and theme styles.
- `admin-portal/src/App.css` - template-specific CSS leftovers.
- `admin-portal/src/views/LiveMapView.jsx` - map display component used by the portal.

What it does:
- Shows complaint stats and graphs.
- Lists all complaints in a table.
- Displays complaints on a live map.
- Lets admin update complaint status and assign field officers.
- Provides settings and an activity log export.

### User app
Important files:
- `user-app/app/_layout.tsx` - Expo Router root layout.
- `user-app/app/index.tsx` - login/entry screen.
- `user-app/app/(tabs)/report.tsx` - complaint submission flow with camera, geolocation, and map.
- `user-app/app/(tabs)/home.tsx` - home screen.
- `user-app/app/(tabs)/my-reports.tsx` - user complaint history.
- `user-app/app/(tabs)/profile.tsx` - user profile.

What it does:
- Lets users report issues with photos.
- Captures location using device GPS and geocoding.
- Posts reports to the backend using multipart form data.

## Run instructions
The repo root includes a launcher:
- `start-all.ps1` starts the backend, admin portal, and user app together.
- Root `package.json` exposes `npm run start:all`.

After running:
- Admin portal: `http://localhost:5173` with login `admin@hamroawaaz.gov.np` / `admin123`
- User app: Scan Expo QR code with Expo Go; login with `test@test.com` / `admin123`
- Backend: `http://localhost:5000`

The admin portal is fully responsive across mobile, tablet, and desktop screens.

## Data model
The complaint schema in `backend/models/Report.js` stores:
- `category`
- `location`
- `latitude`
- `longitude`
- `description`
- `imageUrl`
- `username`
- `ward`
- `status`
- `assignedOfficer`
- `createdAt`

## API endpoints
### Backend routes
- `GET /` - health check.
- `POST /api/admin/login` - simple admin login.
- `GET /api/reports/all` - fetch all complaints.
- `POST /api/reports` - create a complaint.
- `POST /api/reports/submit` - same complaint create flow.
- `PUT /api/reports/:id` - update complaint status and officer.

## Important implementation details
- The admin portal uses `http://localhost:5000` by default and respects `VITE_API_BASE_URL` env var.
- The user app (Expo) dynamically resolves the backend from the dev server host. On a physical device, it detects the packager IP. Falls back to `localhost:5000` in dev, `http://10.0.2.2:5000` on Android emulator.
- User app also respects `EXPO_PUBLIC_API_BASE_URL` env var for deployed builds.
- Uploaded photos are served from `/uploads` in the backend and reconstructed as `${API_BASE_URL}/uploads/filename`.
- Admin portal login: `admin@hamroawaaz.gov.np` / `admin123`
- User app login: `test@test.com` / `admin123` (both stored in client code for now).

## Good starting order for another AI
If you need to understand the system quickly, read files in this order:
1. `backend/server.js`
2. `backend/routes/reportRoutes.js`
3. `backend/models/Report.js`
4. `user-app/app/(tabs)/report.tsx`
5. `admin-portal/src/App.jsx`
6. `start-all.ps1`

## Current caveats
- The user app web target fails because `react-native-maps` is native-only. Use Expo Metro (`npm start`) instead.
- Physical device setup: The Expo app automatically detects your PC's IP from the dev server. If that fails, set `EXPO_PUBLIC_API_BASE_URL` to your machine's LAN IP + `:5000`.
- Admin and user app use hard-coded test credentials in code (not production-safe).
