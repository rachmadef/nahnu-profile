# NAHNU — Digital Collective Space 🚀

> **Three Developers. One Digital Space.**  
> Website portfolio modern kolaboratif untuk menampilkan profil, kemampuan teknologi, dan showcase project dari tim yang terdiri dari 3 developer.

---

## 📌 Daftar Isi
- [Gambaran Umum](#-gambaran-umum)
- [Arsitektur & Tech Stack](#-arsitektur--tech-stack)
- [Struktur Direktori](#-struktur-direktori)
- [Prasyarat Sistem](#-prasyarat-sistem)
- [Panduan Instalasi](#-panduan-instalasi)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Setup Backend (Laravel 13)](#2-setup-backend-laravel-13)
  - [3. Setup Frontend (Vite + Tailwind CSS 4)](#3-setup-frontend-vite--tailwind-css-4)
- [Akses Aplikasi & Kredensial Admin](#-akses-aplikasi--kredensial-admin)
- [Daftar Endpoint API](#-daftar-endpoint-api)
- [Build untuk Production](#-build-untuk-production)
- [Troubleshooting](#-troubleshooting)
- [Tim Pengembang](#-tim-pengembang)

---

## 🌟 Gambaran Umum

**NAHNU** dibangun menggunakan arsitektur pemisahan penuh (*decoupled architecture*) antara Frontend dan Backend:
- **Frontend** berjalan mandiri menggunakan **Vite** dan **Tailwind CSS 4**, mengonsumsi data secara dinamis melalui REST API.
- **Admin Panel** dibuat khusus (*custom frontend-based*) tanpa dependensi admin panel instan (no Filament), memberikan keleluasaan penuh dalam kustomisasi UI/UX.
- **Backend** bertindak murni sebagai **RESTful API** berbasis **Laravel 13** yang aman, dilengkapi autentikasi token **Laravel Sanctum**, sanitasi input HTML (Quill Editor), serta validasi ketat.

---

## 🛠 Arsitektur & Tech Stack

```text
       ┌──────────────────────┐         REST API (JSON)         ┌──────────────────────┐
       │   Frontend (Vite)    │ ◄─────────────────────────────► │   Backend (Laravel)  │
       │  HTML5 + Tailwind 4  │   Bearer Token (Sanctum) / CORS │  Laravel 13 REST API │
       │  Axios + Quill.js    │                                 │  PHP 8.3+ / MySQL    │
       └──────────────────────┘                                 └──────────────────────┘
```

| Bagian | Teknologi |
|---|---|
| **Frontend** | HTML5, Tailwind CSS v4, JavaScript (ES Modules), Vite 6, Axios, Quill Editor |
| **Backend** | PHP 8.3+, Laravel 13, Laravel Sanctum (API Auth), Eloquent ORM |
| **Database** | MySQL / MariaDB |
| **Web Server Lokal** | Laragon / XAMPP / PHP Built-in Server |

---

## 📁 Struktur Direktori

```text
nahnu-profile/
├── backend/                  # RESTful API Backend (Laravel 13)
│   ├── app/                  # Controller, Models, Services, Middleware
│   ├── config/               # Konfigurasi aplikasi & CORS
│   ├── database/             # Migrasi, Factory, dan Seeders
│   ├── routes/               # Definisi route API (`api.php`)
│   ├── storage/              # Upload file & cache
│   └── .env.example          # Template konfigurasi environment backend
├── frontend/                 # Client & Admin Panel (Vite)
│   ├── admin/                # Halaman panel admin (Dashboard, Projects, etc.)
│   ├── public/               # Asset statis publik
│   ├── src/                  # Sumber CSS Tailwind, JavaScript & Helper API
│   ├── index.html            # Halaman utama (Public)
│   ├── projects.html         # Daftar project
│   ├── project-detail.html   # Detail project
│   ├── about.html            # Profil tim
│   ├── contact.html          # Form kontak pesan
│   └── .env.example          # Template konfigurasi environment frontend
├── docs/                     # Dokumen rancangan & aset logo
└── web/                      # Screenshot & dokumentasi web
```

---

## ⚙ Prasyarat Sistem

Pastikan perangkat Anda telah terinstall perangkat lunak berikut:
- **PHP** >= 8.3
- **Composer** >= 2.x
- **Node.js** >= 18.x & **npm** >= 9.x
- **MySQL** atau **MariaDB** (Bisa melalui Laragon, XAMPP, atau Docker)
- **Git**

---

## 🚀 Panduan Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/<USERNAME>/<REPO_NAME>.git
cd nahnu-profile
```

---

### 2. Setup Backend (Laravel 13)

Buka terminal di root project, lalu masuk ke folder `backend`:

```bash
cd backend
```

1. **Install dependensi PHP via Composer:**
   ```bash
   composer install
   ```

2. **Salin file konfigurasi environment:**
   ```bash
   copy .env.example .env
   # Atau jika di Linux/macOS:
   # cp .env.example .env
   ```

3. **Generate Application Key:**
   ```bash
   php artisan key:generate
   ```

4. **Konfigurasi Database di `.env`:**  
   Buka file `backend/.env` dan sesuaikan koneksi database MySQL Anda:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=nahnu_profile
   DB_USERNAME=root
   DB_PASSWORD=
   ```
   *(Pastikan database `nahnu_profile` sudah dibuat di phpMyAdmin / MySQL)*

5. **Jalankan Migrasi & Seeder Database:**
   ```bash
   php artisan migrate --seed
   ```
   *Perintah ini akan membuat semua tabel database beserta data awal (akun admin, kategori, teknologi, anggota tim, dan sampel project).*

6. **Buat Symlink Storage untuk Upload Gambar:**
   ```bash
   php artisan storage:link
   ```

7. **Jalankan Backend Server:**
   ```bash
   php artisan serve
   ```
   Backend API akan berjalan di: `http://127.0.0.1:8000`

---

### 3. Setup Frontend (Vite + Tailwind CSS 4)

Buka tab terminal baru, lalu masuk ke folder `frontend`:

```bash
cd frontend
```

1. **Install dependensi Node.js:**
   ```bash
   npm install
   ```

2. **Salin file environment frontend:**
   ```bash
   copy .env.example .env
   # Atau jika di Linux/macOS:
   # cp .env.example .env
   ```

3. **Periksa URL API Backend di `frontend/.env`:**
   Pastikan variabel `VITE_API_BASE_URL` mengarah ke server backend Anda:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000/api
   ```

4. **Jalankan Frontend Dev Server:**
   ```bash
   npm run dev
   ```
   Frontend akan aktif di: `http://localhost:5173`

---

## 🔑 Akses Aplikasi & Kredensial Admin

### URL Halaman:
- **Website Publik:** `http://localhost:5173/`
- **Showcase Projects:** `http://localhost:5173/projects.html`
- **Tentang Tim:** `http://localhost:5173/about.html`
- **Kontak:** `http://localhost:5173/contact.html`
- **Admin Login:** `http://localhost:5173/admin/login.html`

### Akun Login Admin Default:
| Field | Value |
|---|---|
| **Email** | `admin@nahnu.id` |
| **Password** | `password` |

> ⚠️ **Catatan Keamanan:** Segera ubah password default ini melalui menu profil admin setelah instalasi pertama kali di lingkungan produksi.

---

## 📡 Daftar Endpoint API

Semua endpoint API beralamat di: `http://127.0.0.1:8000/api`

### Public Endpoints:
- `GET /api/projects` — Mendapatkan daftar project publik (dengan filter kategori & pencarian).
- `GET /api/projects/{slug}` — Mendapatkan detail project berdasarkan slug.
- `GET /api/categories` — Mendapatkan daftar kategori project.
- `GET /api/technologies` — Mendapatkan daftar stack teknologi.
- `GET /api/team-members` — Mendapatkan daftar anggota tim.
- `POST /api/contact` — Mengirimkan pesan/pertanyaan dari form kontak.

### Admin Endpoints (Memerlukan Bearer Token):
- `POST /api/admin/login` — Autentikasi admin dan penerbitan token.
- `POST /api/admin/logout` — Revoke token saat ini.
- `GET /api/admin/profile` & `PUT /api/admin/profile` — Kelola akun admin.
- `GET /api/admin/dashboard` — Statistik ringkasan (jumlah project, pesan baru, dsb).
- `CRUD /api/admin/projects` — Manajemen project lengkap (termasuk upload gambar).
- `CRUD /api/admin/categories` — Manajemen kategori.
- `CRUD /api/admin/technologies` — Manajemen teknologi.
- `CRUD /api/admin/team-members` — Manajemen anggota tim.
- `GET /api/admin/messages` — Melihat & membaca pesan kontak masuk.

---

## 📦 Build untuk Production

Untuk melakukan build frontend menjadi file statis siap deploy:

```bash
cd frontend
npm run build
```

Hasil build akan tersimpan di dalam folder `frontend/dist/` dan siap di-hosting di Nginx, Apache, Vercel, Netlify, atau layanan hosting statis lainnya.

---

## ❓ Troubleshooting

1. **Gambar tidak muncul setelah diupload di admin?**
   - Pastikan Anda sudah menjalankan perintah `php artisan storage:link` di folder `backend`.
   - Periksa konfigurasi `APP_URL` di `backend/.env` (default: `http://localhost:8000` atau `http://127.0.0.1:8000`).

2. **Error CORS saat memanggil API dari Frontend?**
   - Periksa file `backend/config/cors.php`. Pastikan `allowed_origins` mengizinkan `http://localhost:5173` atau `FRONTEND_URL` di `.env` sudah sesuai.

3. **Node modules tidak ditemukan saat clone?**
   - Jalankan `npm install` di dalam direktori `frontend`.

---

## 👥 Tim Pengembang

Platform **NAHNU** dikembangkan oleh:
- **Ahmad Fauzi** — *Lead Backend Web Engineer*
- **Rian Pratama** — *Lead Frontend Web Architect*
- **Dimas Saputra** — *Full Stack & Local Web Engineer*

---

## 📄 Lisensi

Proyek ini dilindungi di bawah lisensi [MIT](LICENSE).
