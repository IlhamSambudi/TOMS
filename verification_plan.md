# Verification Plan — TOMS

**Last Updated:** 2026-02-25

---

## ✅ Completed & Verified

### API Routes
| Service | Route | Status |
|---|---|---|
| `groupService` | `GET/POST /api/groups` | ✅ Verified |
| `handlingService` | `GET/POST /api/handling` | ✅ Verified |
| `flightService` | `GET/POST /api/flights` | ✅ Verified |
| `staffService` | `GET /api/staff/tour-leaders` | ✅ Verified |
| `staffService` | `GET /api/staff/muthawifs` | ✅ Verified |
| `assignmentService` | `GET /api/groups/:id/tour-leaders` | ✅ Verified |
| `assignmentService` | `GET /api/groups/:id/muthawifs` | ✅ Verified |
| `transportService` | `GET/POST /api/transports` | ✅ Verified |
| `hotelService` | `GET/POST /api/groups/:id/hotels` | ✅ Verified |
| `trainService` | `GET/POST /api/groups/:id/trains` | ✅ Verified |
| `rawdahService` | `GET/POST /api/rawdah` | ✅ Verified |
| `authService` | `POST /api/auth/login` | ✅ Verified |

---

### Features
| Feature | Status |
|---|---|
| Group CRUD | ✅ |
| Group Detail + Full Itinerary | ✅ |
| Group Print View (PDF) | ✅ |
| Flight Segments (multi-leg) | ✅ |
| Transport (standalone + group) | ✅ |
| Hotels per group | ✅ |
| Trains per group | ✅ |
| Rawdah per group | ✅ |
| Team Assignments (Tour Leader + Muthawif) | ✅ |
| Muasasah field on groups | ✅ |
| Date sorting + past record toggle | ✅ |
| Login / JWT Auth | ✅ |
| Protected routes (ProtectedRoute) | ✅ |
| Logout (sidebar) | ✅ |
| DB auto-create tables on server start | ✅ |

---

### Infrastructure
| Item | Status |
|---|---|
| Docker — `BE/Dockerfile` | ✅ |
| Docker — `FE/Dockerfile` (multi-stage nginx) | ✅ |
| `docker/docker-compose.yml` (3 services + healthcheck) | ✅ |
| nginx SPA fallback + gzip | ✅ |
| `VITE_API_URL` env var (no hardcoded localhost) | ✅ |
| CORS env-configurable whitelist | ✅ |
| DB persistent volume (`toms_pgdata`) | ✅ |
| Admin seed script | ✅ |
| `DB_STRUCTURE.md` documentation | ✅ |
| `Makefile` run shortcuts | ✅ |

---

## 🔲 Pending / To Do

| Item | Notes |
|---|---|
| Role-based access control (RBAC) | `authMiddleware.js` exists, routes not yet protected |
| User management page (add/edit users) | Admin UI to manage operators |
| Production deployment (VPS / server) | Docker compose on `ezyindustries.my.id` |
| HTTPS / SSL | Nginx + Certbot or Cloudflare proxy |
| Report export (PDF/Excel) | Reports page is placeholder |

---

## 🚀 Run Checklist

### Local Dev
```bash
cd BE && npm run dev       # BE on :5000
cd FE && npm run dev       # FE on :5173
```

### Docker (All-in-one)
```bash
make up           # build + start all services
make seed         # seed admin user (admin / admin123)
make logs         # follow logs
```

| Service | URL |
|---|---|
| Frontend | http://localhost (port 80) |
| Backend API | http://localhost:5000/api |
| Database | localhost:5432 |
