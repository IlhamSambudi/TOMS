# Verification Plan - Final Check

1. **Services & Routes Alignment**:
    - `groupService`: `/api/groups` (Verified)
    - `handlingService`: `/api/handling` (Verified)
    - `flightService`: `/api/flights` (Verified)
    - `assignmentService`: 
        - `/api/groups/:id/tour-leaders` (Check `assignmentRoutes.js`)
        - `/api/groups/:id/muthawifs` (Check `assignmentRoutes.js`)
        - `/api/staff/tour-leaders` (Check `staffRoutes.js`)
        - `/api/staff/muthawifs` (Check `staffRoutes.js`)

2. **Frontend Crash**:
    - If white screen persists, check for:
        - `undefined` data in components (e.g. `group.flights.map` when `flights` is null).
        - Ensure `groupService.getById` returns expected structure.

3. **Browser Test**:
    - Run final full workflow test.
