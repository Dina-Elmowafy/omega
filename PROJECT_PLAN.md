# OMEGA Petroleum Services - Project Plan

## 1. System Architecture

The application works in **Hybrid Mode**:
- **Mock Mode (Default)**: Uses `localStorage` to simulate a database. No server required.
- **Full Stack Mode**: Connects to `backend/server.ts` (Express) and PostgreSQL.

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **State**: React Context (`contexts/`)
- **Services**: Centralized API layer (`services/api.ts`)

### Backend
- **Server**: Node.js + Express (`backend/server.ts`)
- **Database Config**: `backend/db.ts`
- **Database Schema**: `backend/database/schema.sql` (PostgreSQL)

---

## 2. Organized Directory Structure

The project follows a flat, root-level structure compatible with standard Vite configuration.

```
/
├── index.html              # Entry point
├── index.tsx               # React Root
├── App.tsx                 # Main Component & Routing
├── types.ts                # TypeScript Definitions
├── constants.ts            # Configuration & Mock Data
├── components/             # UI Components (Navbar, Cards, etc.)
├── pages/                  # Route Views (Home, Dashboard, Admin)
├── contexts/               # React Context Providers
│   ├── DataContext.tsx     # CMS & Business Logic
│   └── AuthContext.tsx     # Authentication Logic
├── services/               # API & External Integrations
│   └── api.ts              # Unified API Handler
└── backend/                # Server Side Code
    ├── server.ts           # Express Application
    ├── db.ts               # Database Connection
    └── database/
        └── schema.sql      # SQL Schema
```

---

## 3. Setup Instructions

### Option A: Frontend Only (Mock Mode)
1. **Install**: `npm install`
2. **Run**: `npm run dev`
3. **Login**: 
   - Admin: `admin@omega.com` / `admin`
   - Client: `user@example.com` / `client`

### Option B: Full Stack (Real Database)
1. **Database**: Install PostgreSQL and run `backend/database/schema.sql`.
2. **Env**: Create `.env` with `DATABASE_URL=...`
3. **Server**: `npm run server`
4. **Config**: In `services/api.ts`, set `const USE_MOCK = false`.

---

## 4. Security & Organization
- **Separation of Concerns**: Frontend services are decoupled from UI.
- **Backend Modularity**: Database logic is separated from server routing.
- **Type Safety**: Unified `types.ts` used across frontend and backend logic.
