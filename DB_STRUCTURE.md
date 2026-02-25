# 🗄️ TOMS — Database Structure Documentation

**Schema:** `umroh_ops`  
**Database:** PostgreSQL  
**Last Updated:** 2026-02-25

---

## Table of Contents

1. [users](#1-users)
2. [handling\_companies](#2-handling_companies)
3. [groups](#3-groups)
4. [flights](#4-flights)
5. [group\_flight\_segments](#5-group_flight_segments)
6. [transports](#6-transports)
7. [tour\_leaders](#7-tour_leaders)
8. [muthawifs](#8-muthawifs)
9. [group\_assignments](#9-group_assignments)
10. [group\_hotels](#10-group_hotels)
11. [group\_trains](#11-group_trains)
12. [group\_rawdah](#12-group_rawdah)

---

## 1. `users`

Menyimpan data akun untuk autentikasi login ke sistem.

| Column | Type | Constraint | Default | Description |
|---|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | auto | ID unik user |
| `username` | VARCHAR(100) | NOT NULL, UNIQUE | — | Username untuk login |
| `password_hash` | VARCHAR(255) | NOT NULL | — | Bcrypt hash dari password |
| `full_name` | VARCHAR(255) | — | — | Nama lengkap user |
| `role` | VARCHAR(50) | — | `'operator'` | Role user: `admin`, `operator` |
| `created_at` | TIMESTAMP | — | CURRENT_TIMESTAMP | Waktu akun dibuat |

**Relasi:** Tidak ada FK keluar. Digunakan oleh sistem autentikasi JWT.

---

## 2. `handling_companies`

Menyimpan data perusahaan handling yang digunakan oleh grup perjalanan.

| Column | Type | Constraint | Default | Description |
|---|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | auto | ID unik |
| `name` | VARCHAR(255) | NOT NULL | — | Nama perusahaan handling |
| `contact_person` | VARCHAR(255) | — | — | Nama contact person |
| `phone` | VARCHAR(50) | — | — | Nomor telepon |
| `email` | VARCHAR(255) | — | — | Alamat email |
| `address` | TEXT | — | — | Alamat |
| `created_at` | TIMESTAMP | — | CURRENT_TIMESTAMP | Waktu data dibuat |

**Direferensikan oleh:** `groups.handling_company_id`

---

## 3. `groups`

Entitas utama yang merepresentasikan satu grup perjalanan umroh.

| Column | Type | Constraint | Default | Description |
|---|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | auto | ID unik grup |
| `group_code` | VARCHAR(50) | NOT NULL, UNIQUE | — | Kode unik grup (contoh: `UMR-2026-01`) |
| `program_type` | VARCHAR(50) | — | — | Jenis program (`REGULER`, `PLUS`, dst) |
| `departure_date` | DATE | — | — | Tanggal keberangkatan |
| `total_pax` | INTEGER | — | — | Total jumlah jemaah |
| `status` | VARCHAR(20) | — | `'PREPARATION'` | Status grup: `PREPARATION`, `DEPARTURE`, `ARRIVAL` |
| `handling_company_id` | INTEGER | FK → `handling_companies(id)` ON DELETE SET NULL | — | Perusahaan handling yang ditugaskan |
| `muasasah` | VARCHAR(50) | — | — | Muasasah: `MAAD`, `GHANIYA`, `ARABCO` |
| `notes` | TEXT | — | — | Catatan tambahan |
| `created_at` | TIMESTAMP | — | CURRENT_TIMESTAMP | Waktu data dibuat |

**Direferensikan oleh:** `group_flight_segments`, `transports`, `group_assignments`, `group_hotels`, `group_trains`, `group_rawdah`

---

## 4. `flights`

Master data penerbangan yang tersedia. Digunakan sebagai referensi oleh segmen penerbangan grup.

| Column | Type | Constraint | Default | Description |
|---|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | auto | ID unik |
| `airline` | VARCHAR(100) | — | — | Nama maskapai |
| `flight_number` | VARCHAR(20) | — | — | Nomor penerbangan (contoh: `GA-401`) |
| `origin` | VARCHAR(50) | — | — | Kode bandara asal (IATA) |
| `destination` | VARCHAR(50) | — | — | Kode bandara tujuan (IATA) |
| `departure_time` | TIMESTAMP | — | — | Jadwal keberangkatan (ETD) |
| `arrival_time` | TIMESTAMP | — | — | Jadwal kedatangan (ETA) |
| `created_at` | TIMESTAMP | — | CURRENT_TIMESTAMP | Waktu data dibuat |

> **Alias di kode:** Tabel ini dikenal juga sebagai `flight_master` dalam beberapa query JOIN.

**Direferensikan oleh:** `group_flight_segments.flight_master_id`

---

## 5. `group_flight_segments`

Segmen penerbangan spesifik untuk setiap grup. Satu grup dapat memiliki banyak segmen (multi-leg).

| Column | Type | Constraint | Default | Description |
|---|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | auto | ID unik |
| `group_id` | INTEGER | FK → `groups(id)` ON DELETE CASCADE | — | Grup yang terkait |
| `flight_master_id` | INTEGER | FK → `flights(id)` ON DELETE RESTRICT | — | Penerbangan referensi |
| `flight_date` | DATE | NOT NULL | — | Tanggal aktual penerbangan |
| `segment_order` | INTEGER | NOT NULL | — | Urutan segmen dalam perjalanan |
| `override_etd` | TIME | — | — | Override jadwal berangkat |
| `override_eta` | TIME | — | — | Override jadwal tiba |
| `remarks` | TEXT | — | — | Catatan segmen |
| `created_at` | TIMESTAMP | — | CURRENT_TIMESTAMP | Waktu data dibuat |

**Constraint unik:** `UNIQUE (group_id, segment_order)` — urutan segmen tidak boleh duplikat per grup.

---

## 6. `transports`

Data transportasi darat per grup (bus, mobil, dll).

| Column | Type | Constraint | Default | Description |
|---|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | auto | ID unik |
| `group_id` | INTEGER | FK → `groups(id)` ON DELETE CASCADE | — | Grup yang terkait |
| `provider_name` | VARCHAR(255) | — | — | Nama penyedia transportasi |
| `vehicle_type` | VARCHAR(100) | — | — | Jenis kendaraan (Bus, Coaster, dll) |
| `route` | VARCHAR(255) | — | — | Rute perjalanan |
| `journey_date` | TIMESTAMP | — | — | Tanggal/waktu perjalanan |
| `departure_time` | TIME | — | — | Jam berangkat |
| `pickup_location` | VARCHAR(255) | — | — | Lokasi jemput |
| `drop_location` | VARCHAR(255) | — | — | Lokasi tujuan/turun |
| `pax_count` | INTEGER | — | — | Jumlah penumpang |
| `created_at` | TIMESTAMP | — | CURRENT_TIMESTAMP | Waktu data dibuat |

---

## 7. `tour_leaders`

Master data tour leader yang tersedia.

| Column | Type | Constraint | Default | Description |
|---|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | auto | ID unik |
| `name` | VARCHAR(255) | — | — | Nama tour leader |
| `phone` | VARCHAR(50) | — | — | Nomor telepon |
| `created_at` | TIMESTAMP | — | CURRENT_TIMESTAMP | Waktu data dibuat |

**Direferensikan oleh:** `group_assignments.tour_leader_id`

---

## 8. `muthawifs`

Master data muthawif yang tersedia.

| Column | Type | Constraint | Default | Description |
|---|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | auto | ID unik |
| `name` | VARCHAR(255) | — | — | Nama muthawif |
| `phone` | VARCHAR(50) | — | — | Nomor telepon |
| `created_at` | TIMESTAMP | — | CURRENT_TIMESTAMP | Waktu data dibuat |

**Direferensikan oleh:** `group_assignments.muthawif_id`

---

## 9. `group_assignments`

Penugasan tour leader dan/atau muthawif ke grup tertentu.

| Column | Type | Constraint | Default | Description |
|---|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | auto | ID unik |
| `group_id` | INTEGER | FK → `groups(id)` ON DELETE CASCADE | — | Grup yang terkait |
| `tour_leader_id` | INTEGER | FK → `tour_leaders(id)` | — | Tour leader yang ditugaskan |
| `muthawif_id` | INTEGER | FK → `muthawifs(id)` | — | Muthawif yang ditugaskan |
| `role` | VARCHAR(50) | — | — | Role dalam penugasan: `TOUR_LEADER`, `MUTHAWIF` |
| `assigned_at` | TIMESTAMP | — | CURRENT_TIMESTAMP | Waktu penugasan |

---

## 10. `group_hotels`

Data hotel per kota untuk setiap grup.

| Column | Type | Constraint | Default | Description |
|---|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | auto | ID unik |
| `group_id` | INTEGER | FK → `groups(id)` ON DELETE CASCADE | — | Grup yang terkait |
| `city` | VARCHAR(100) | NOT NULL | — | Kota hotel (`MAKKAH`, `MADINAH`, dll) |
| `hotel_name` | VARCHAR(255) | NOT NULL | — | Nama hotel |
| `check_in` | DATE | — | — | Tanggal check-in |
| `check_out` | DATE | — | — | Tanggal check-out |
| `room_dbl` | INTEGER | — | `0` | Jumlah kamar double |
| `room_trpl` | INTEGER | — | `0` | Jumlah kamar triple |
| `room_quad` | INTEGER | — | `0` | Jumlah kamar quad |
| `room_quint` | INTEGER | — | `0` | Jumlah kamar quint |
| `reservation_no` | VARCHAR(100) | — | — | Nomor reservasi hotel |
| `created_at` | TIMESTAMP | — | CURRENT_TIMESTAMP | Waktu data dibuat |

---

## 11. `group_trains`

Data perjalanan kereta haramain per grup.

| Column | Type | Constraint | Default | Description |
|---|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | auto | ID unik |
| `group_id` | INTEGER | FK → `groups(id)` ON DELETE CASCADE | — | Grup yang terkait |
| `train_date` | DATE | — | — | Tanggal perjalanan kereta |
| `from_station` | VARCHAR(255) | — | — | Stasiun asal |
| `to_station` | VARCHAR(255) | — | — | Stasiun tujuan |
| `departure_time` | TIME | — | — | Jam berangkat |
| `total_hajj` | INTEGER | — | — | Jumlah jemaah |
| `remarks` | TEXT | — | — | Catatan |
| `created_at` | TIMESTAMP | — | CURRENT_TIMESTAMP | Waktu data dibuat |

---

## 12. `group_rawdah`

Data izin/jadwal rawdah (kunjungan ke Raudhah) per grup.

| Column | Type | Constraint | Default | Description |
|---|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | auto | ID unik |
| `group_id` | INTEGER | FK → `groups(id)` ON DELETE CASCADE | — | Grup yang terkait |
| `men_date` | DATE | — | — | Tanggal rawdah jemaah pria |
| `men_time` | VARCHAR(20) | — | — | Waktu rawdah pria |
| `men_pax` | INTEGER | — | — | Jumlah jemaah pria |
| `women_date` | DATE | — | — | Tanggal rawdah jemaah wanita |
| `women_time` | VARCHAR(20) | — | — | Waktu rawdah wanita |
| `women_pax` | INTEGER | — | — | Jumlah jemaah wanita |
| `created_at` | TIMESTAMP | — | CURRENT_TIMESTAMP | Waktu data dibuat |
| `updated_at` | TIMESTAMP | — | CURRENT_TIMESTAMP | Waktu data terakhir diperbarui |

---

## Entity Relationship Overview

```
users (standalone — auth only)

handling_companies
    └── groups (handling_company_id)
            ├── group_flight_segments (group_id) → flights (flight_master_id)
            ├── transports (group_id)
            ├── group_assignments (group_id) → tour_leaders / muthawifs
            ├── group_hotels (group_id)
            ├── group_trains (group_id)
            └── group_rawdah (group_id)

tour_leaders (standalone master)
muthawifs (standalone master)
flights (standalone master)
```

---

## Notes

- Semua tabel menggunakan `SERIAL PRIMARY KEY` (auto-increment integer).
- `ON DELETE CASCADE` digunakan pada semua tabel turunan dari `groups` — jika grup dihapus, seluruh data terkait ikut terhapus.
- `ON DELETE SET NULL` digunakan pada `groups.handling_company_id` — jika handling company dihapus, grup tetap ada namun `handling_company_id` menjadi NULL.
- `ON DELETE RESTRICT` digunakan pada `group_flight_segments.flight_master_id` — penerbangan tidak bisa dihapus jika masih digunakan oleh segmen grup.
