# 🕌 TOMS - Travel Operations Management System

TOMS (Travel Operations Management System) is an advanced, full-stack operational management web application tailored specifically for Umrah and Hajj travel agencies. It serves as a centralized hub to orchestrate, track, and manage all aspects of pilgrim groups, from their initial creation to their safe return.

---

## 🌟 Core Features

TOMS is divided into logical modules that map directly to the operational needs of an Umrah/Hajj travel agency.

### 1. 👥 Group Management (`/groups`)
The heart of the application. Groups represent a batch of pilgrims traveling together.
- **Creation/Editing**: Manage Group Codes, Program Types (Umrah 9/12 Days, Plus Turkey, Hajj, etc.), Departure Dates, Total Pax, Handling Companies, Muasasah (e.g., MAAD, GHANIYA, ARABCO), and Notes.
- **Group Detail View**: A comprehensive dashboard for a single group, split into multiple tabs:
  - **Overview**: High-level summary of group attributes.
  - **Flights**: Assign and manage multi-segment flight itineraries (Outbound, Connecting, Return).
  - **Transport**: Schedule ground transportation (Buses, GMCs) for airport transfers, intercity travel, and Ziyarah (City Tours).
  - **Hotels**: Manage accommodation bookings in Makkah, Madinah, and transit cities (check-in/check-out dates, nights count, hotel ratings).
  - **Trains**: Manage Haramain High-Speed Railway ticket schedules.
  - **Rawdah**: Schedule Men/Women Rawdah permit timings.
  - **Assignments**: Allocate Tour Leaders and Muthawifs to the group.
- **Status Tracking**: Track group statuses (`PREPARATION`, `DEPARTURE`, `ARRIVAL`).
- **PDF Print / Itinerary Generation**: Generate a clean, structured A4 PDF document summarizing the entire group's itinerary, flights, accommodations, transport, and rawdah schedules.

### 2. ✈️ Flight Master (`/flights`)
A master database of all flight segments.
- Manage Airlines, Flight Numbers, Origins, Destinations, and Scheduled Departure/Arrival times.
- Serves as the base data to be assigned to specific groups in the "Group Details -> Flights" tab.

### 3. 🚌 Transport Master
Manage ground transportation provider networks and assignments.

### 4. 🏢 Handling Companies & Muasasah
Manage Saudi-based local partners (Handling Companies) and Muasasah entities directly tied to group processing.

### 5. 👨‍💼 Tour Leaders & Muthawifs
Master databases for human resources (Tour Leaders and Muthawifs / Guides). Store contact information and track their assignments to specific groups.

---

## 🗄️ Database Structure (PostgreSQL)

The system relies on a relational PostgreSQL database to maintain structural integrity across complex itineraries.

### Core Tables
1. **`groups`** 
   - `id` (PK), `group_code`, `program_type`, `departure_date`, `total_pax`, `handling_company_id` (FK), `muasasah`, `status`, `notes`, `created_at`.
2. **`flight_master`**
   - `id` (PK), `airline`, `flight_number`, `origin`, `destination`, `scheduled_etd`, `scheduled_eta`.
3. **`group_flight_segments`** (Pivot mapping Groups to Flights)
   - `id` (PK), `group_id` (FK), `flight_master_id` (FK), `flight_date`, `segment_order`.
4. **`transports`**
   - `id` (PK), `group_id` (FK), `provider_name`, `vehicle_type`, `route`, `pickup_location`, `drop_location`, `journey_date`, `departure_time`, `pax_count`.
5. **`hotels`**
   - `id` (PK), `group_id` (FK), `city`, `hotel_name`, `rating`, `check_in`, `check_out`, `nights`, `meal_plan`, `room_details`, `reservation_number`.
6. **`trains`**
   - `id` (PK), `group_id` (FK), `from_station`, `to_station`, `train_date`, `departure_time`, `pnr_code`, `total_pax`.
7. **`rawdah_permits`**
   - `id` (PK), `group_id` (FK), `men_date`, `men_time`, `women_date`, `women_time`.
8. **`handling_companies`**, **`tour_leaders`**, **`muthawifs`**
   - Standard master tables mapping IDs, Names, Phones, and Notes.
9. **`group_assignments`**
   - `id` (PK), `group_id` (FK), `tour_leader_id` (FK), `muthawif_id` (FK), `role`.

---

## 🔄 Application Flows

### 1. Creating a New Travel Roster
1. Navigate to **Groups** -> Click **New Group**.
2. Fill in base details: Code, Dates, Pax, Handling Company, Muasasah.
3. Once created, click on the **Group Code** to enter the Group Detail View.

### 2. Building the Itinerary
Inside the Group Detail View, the operator navigates through tabs:
1. **Flights Tab**: Add Flight Segments. (e.g., CGK -> JED, MED -> CGK).
2. **Hotels Tab**: Add Hotel Makkah and Hotel Madinah logic. Nights are auto-calculated from Check-In and Check-Out dates.
3. **Transport Tab**: Schedule buses for Airport pick-up, city transfers, and Ziyarah. Defines Routes and Journey Times.
4. **Rawdah Tab**: Set standard entry times for Men and Women blocks.
5. **Assignments Tab**: Lock in the Tour Leader who will guide the group.

### 3. Execution & Sharing
1. Using the **PDF Print** button inside the Group Detail view, the system compiles all related db tables (`groups`, `group_flight_segments`, `hotels`, `transports`, `rawdah_permits`) into an A4 Layout.
2. The Group Status is advanced to **DEPARTURE** and then **ARRIVAL** as the journey concludes.

---

## 🛠️ Tech Stack & Development Setup

### Backend (BE)
- **Framework**: Node.js + Express.js
- **Database**: PostgreSQL (Raw SQL queries via `pg` pool)
- **Architecture**: MVC Pattern (`routes` -> `controllers` -> `models`)
- **Key Files**: 
  - `BE/src/config/db.js` (PostgreSQL connection pool)
  - `BE/src/config/setupDb.js` (Schema generation script)
  - `BE/src/models/*` (Direct SQL queries)
  - Log generation using `morgan` and custom stream handling to `BE/logs`.

### Frontend (FE)
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + CSS Variables (`index.css` for custom minimal SaaS aesthetic)
- **State/Routing**: React Router DOM (v6), React Hook Form
- **Validation**: Zod schema validation
- **Icons**: Lucide React
- **Architecture**:
  - `FE/src/pages/` (Top-level view components)
  - `FE/src/components/` (Reusable UI like `Modal`, `DataTable`, `Button`, `Input`)
  - `FE/src/services/` (Axios API wrappers communicating with the BE)

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+) running locally or remotely.

### 1. Database Setup
1. Create a PostgreSQL database named `travel_ops` (or as defined in your environment).
2. Configure credentials in the Backend `.env` file mapping to your local Postgres user.
3. Seed the initial schema:
   ```bash
   cd BE
   node src/config/setupDb.js
   ```

### 2. Running the Backend
```bash
cd BE
npm install
npm run dev
```
*The backend typically runs on `http://localhost:5000`.*

### 3. Running the Frontend
```bash
cd FE
npm install
npm run dev
```
*The frontend typically runs on `http://localhost:5173` or `5174`.*

---

## 📦 Deployment & Version Control
This project utilizes Git for version control.
To push updates to the repository:
```bash
git add .
git commit -m "Your descriptive commit message"
git push origin main
```
For production deployment, the backend should be daemonized via `pm2` and the frontend built using `npm run build` and served statically via Nginx/Apache.
