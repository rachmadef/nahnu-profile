# NAHNU — Rancangan Lengkap Website Portfolio

> **Three Developers. One Digital Space.**

## 1. Gambaran Umum

NAHNU adalah website portfolio untuk menampilkan profil, kemampuan, teknologi, dan project dari tim yang terdiri dari **3 developer**.

Arsitektur aplikasi menggunakan pemisahan **frontend dan backend**:

- **Frontend:** HTML, Tailwind CSS 4, JavaScript, Vite, Axios, dan library pendukung standar.
- **Backend:** Laravel 13 sebagai REST API.
- **Database:** MySQL/MariaDB.
- **Admin:** dibuat di frontend, bukan menggunakan Filament.
- **Editor konten:** Quill.
- **Version control:** Git dan GitHub.
- **Deployment:** frontend sebagai static build dan backend Laravel pada server/API terpisah.

> **Catatan penting:** NAHNU tidak menggunakan Filament atau admin panel Laravel siap pakai. Seluruh halaman admin dibuat sendiri pada frontend dan berkomunikasi dengan Laravel melalui API yang dilindungi autentikasi dan otorisasi.

---

## 2. Tujuan Project

1. Menampilkan portfolio profesional dari 3 developer.
2. Menampilkan project secara terstruktur dan mudah dijelajahi.
3. Menyediakan halaman detail project.
4. Menampilkan teknologi yang dikuasai tim.
5. Menampilkan profil masing-masing anggota.
6. Menyediakan sistem admin custom berbasis frontend.
7. Memisahkan frontend dan backend agar pengembangan lebih fleksibel.
8. Menyediakan API yang dapat dikembangkan untuk kebutuhan aplikasi lain di masa depan.
9. Menjaga keamanan data dengan validasi, autentikasi, otorisasi, sanitasi, dan pembatasan akses API.

---

# 3. Arsitektur Sistem

```text
                         INTERNET
                            │
             ┌──────────────┴──────────────┐
             │                             │
       nahnu.id                       api.nahnu.id
             │                             │
             ▼                             ▼
   ┌─────────────────┐          ┌─────────────────────┐
   │    FRONTEND     │          │       BACKEND       │
   │                 │          │                     │
   │ Public Website  │◄────────►│ Laravel 13 REST API│
   │ Admin Panel     │   API    │ Authentication      │
   │ HTML            │          │ Authorization       │
   │ Tailwind CSS    │          │ Validation          │
   │ JavaScript      │          │ Services            │
   │ Vite            │          │ Storage             │
   │ Axios           │          │                     │
   │ Quill           │          └──────────┬──────────┘
   └─────────────────┘                     │
                                           ▼
                                  ┌─────────────────┐
                                  │ MySQL / MariaDB │
                                  └─────────────────┘
```

### Pemisahan Repository

```text
NAHNU
├── nahnu-frontend
└── nahnu-backend
```

Frontend tidak memiliki akses langsung ke database. Semua komunikasi data dilakukan melalui API Laravel.

---

# 4. Struktur Frontend

```text
nahnu-frontend/
├── src/
│   ├── public/
│   │   ├── pages/
│   │   │   ├── index.html
│   │   │   ├── projects.html
│   │   │   ├── project-detail.html
│   │   │   ├── about.html
│   │   │   └── contact.html
│   │   ├── components/
│   │   └── js/
│   │
│   ├── admin/
│   │   ├── pages/
│   │   │   ├── login.html
│   │   │   ├── dashboard.html
│   │   │   ├── projects.html
│   │   │   ├── project-create.html
│   │   │   ├── project-edit.html
│   │   │   ├── categories.html
│   │   │   ├── technologies.html
│   │   │   ├── team-members.html
│   │   │   ├── messages.html
│   │   │   └── settings.html
│   │   ├── components/
│   │   └── js/
│   │       ├── auth.js
│   │       ├── dashboard.js
│   │       ├── projects.js
│   │       ├── categories.js
│   │       ├── technologies.js
│   │       ├── team-members.js
│   │       └── messages.js
│   │
│   ├── components/
│   ├── css/
│   ├── js/
│   │   ├── api.js
│   │   └── utils.js
│   └── assets/
│
├── public/
├── .env.example
├── package.json
└── vite.config.js
```

### Prinsip keamanan frontend

Struktur folder bukan security boundary. Keamanan harus ditegakkan oleh backend.

Frontend tidak boleh menyimpan:

- password database,
- database credentials,
- application secret,
- API private secret,
- private signing key,
- credential server.

File `.env` frontend hanya boleh berisi konfigurasi yang memang aman diketahui browser, seperti base URL API dan konfigurasi publik.

---

# 5. Struktur Backend Laravel 13

```text
nahnu-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       ├── Public/
│   │   │       └── Admin/
│   │   ├── Requests/
│   │   └── Resources/
│   ├── Models/
│   ├── Services/
│   └── Providers/
│
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── factories/
│
├── routes/
│   ├── api.php
│   └── web.php
│
├── storage/
├── config/
├── public/
├── resources/
├── tests/
├── .env
└── composer.json
```

Backend menjadi satu-satunya pihak yang berkomunikasi langsung dengan database.

---

# 6. Teknologi Frontend

| Teknologi | Fungsi |
|---|---|
| HTML5 | Struktur halaman |
| Tailwind CSS 4 | Styling dan responsive UI |
| JavaScript | Interaksi dan logic frontend |
| Vite | Build tool dan development server |
| Axios | HTTP client untuk komunikasi API |
| Quill | Rich text editor untuk konten |
| Library tambahan | Digunakan jika benar-benar diperlukan |

Frontend dibuat dengan pendekatan sederhana dan modular tanpa framework SPA wajib.

---

# 7. Teknologi Backend

| Teknologi | Fungsi |
|---|---|
| Laravel 13 | Backend/API |
| PHP | Bahasa pemrograman |
| MySQL/MariaDB | Database |
| Laravel Sanctum | Autentikasi berbasis session/cookie untuk admin SPA bila konfigurasi deployment mendukung |
| Laravel Validation/Form Request | Validasi input |
| API Resources | Format response API |
| Laravel Storage | Pengelolaan file/media |

---

# 8. Public Website

## Halaman utama

### Home

Menampilkan:

- Hero section.
- Pengenalan NAHNU.
- Ringkasan kemampuan tim.
- Featured projects.
- Teknologi utama.
- Ringkasan anggota tim.
- Call to action.

### Projects

Menampilkan seluruh project.

Fitur:

- Grid/list project.
- Filter kategori.
- Filter teknologi.
- Search.
- Pagination bila jumlah project besar.

### Project Detail

Menampilkan:

- Judul project.
- Cover.
- Deskripsi.
- Detail project.
- Teknologi yang digunakan.
- Developer yang terlibat.
- Link demo.
- Link repository bila tersedia.
- Galeri/media bila diperlukan.

### About

Menampilkan:

- Profil NAHNU.
- Visi/misi atau deskripsi tim.
- 3 developer.
- Skill dan teknologi.
- Social/contact links.

### Contact

Menampilkan form:

- Nama.
- Email.
- Subject.
- Message.

Data dikirim ke backend melalui API.

---

# 9. Admin Panel Frontend

Admin berada pada frontend yang sama atau frontend build yang sama dengan public website.

Contoh route:

```text
/admin
/admin/login
/admin/dashboard
/admin/projects
/admin/projects/create
/admin/projects/edit
/admin/categories
/admin/technologies
/admin/team-members
/admin/messages
/admin/settings
```

## Dashboard

Menampilkan ringkasan:

- Jumlah project.
- Jumlah kategori.
- Jumlah teknologi.
- Jumlah team member.
- Pesan masuk.
- Aktivitas terbaru bila dibutuhkan.

## Project Management

Admin dapat:

- Membuat project.
- Mengedit project.
- Menghapus project.
- Mengatur slug.
- Mengatur kategori.
- Mengatur teknologi.
- Menentukan developer.
- Upload cover/media.
- Menulis deskripsi menggunakan Quill.
- Mengatur status publikasi.

## Category Management

CRUD kategori project.

## Technology Management

CRUD teknologi.

## Team Member Management

CRUD data profil 3 developer.

## Message Management

Admin dapat:

- Melihat pesan.
- Menandai pesan sudah dibaca.
- Menghapus pesan.
- Melihat detail pengirim.

## Settings

Pengaturan umum yang memang diperlukan oleh website.

---

# 10. Quill Editor

Quill digunakan pada halaman admin untuk field yang membutuhkan rich text, terutama:

- Deskripsi project.
- Detail project.
- Konten halaman tertentu jika nantinya diperlukan.

Alur:

```text
Admin
  ↓
Quill Editor
  ↓
HTML Content
  ↓
Axios
  ↓
Laravel API
  ↓
Validation + Sanitization
  ↓
Database
```

HTML dari Quill tidak boleh langsung dianggap aman. Backend harus melakukan sanitasi/allowlist terhadap HTML sebelum disimpan atau sebelum dirender.

---

# 11. API Architecture

API dibagi menjadi public API dan admin API.

## Public API

```text
GET  /api/projects
GET  /api/projects/{slug}

GET  /api/categories
GET  /api/technologies
GET  /api/team-members

POST /api/contact
```

Public API hanya memberikan data yang memang boleh dilihat publik.

## Admin API

```text
POST   /api/admin/login
POST   /api/admin/logout
GET    /api/admin/me

GET    /api/admin/dashboard

GET    /api/admin/projects
POST   /api/admin/projects
GET    /api/admin/projects/{id}
PUT    /api/admin/projects/{id}
DELETE /api/admin/projects/{id}

GET    /api/admin/categories
POST   /api/admin/categories
PUT    /api/admin/categories/{id}
DELETE /api/admin/categories/{id}

GET    /api/admin/technologies
POST   /api/admin/technologies
PUT    /api/admin/technologies/{id}
DELETE /api/admin/technologies/{id}

GET    /api/admin/team-members
POST   /api/admin/team-members
PUT    /api/admin/team-members/{id}
DELETE /api/admin/team-members/{id}

GET    /api/admin/messages
GET    /api/admin/messages/{id}
DELETE /api/admin/messages/{id}
```

Endpoint aktual dapat berkembang sesuai kebutuhan implementasi.

---

# 12. Autentikasi dan Otorisasi Admin

Admin frontend tidak boleh dianggap aman hanya karena route `/admin` disembunyikan.

Backend harus memeriksa:

```text
Request
  ↓
Authentication
  ↓
Authorization
  ↓
Validation
  ↓
Controller
  ↓
Service
  ↓
Database
```

Untuk browser-based admin, pendekatan yang direkomendasikan adalah autentikasi session/cookie dengan Laravel Sanctum apabila deployment frontend/backend dan konfigurasi cookie/CORS memungkinkan.

Konfigurasi harus memperhatikan:

- HTTPS.
- CORS.
- credentials/cookies.
- CSRF protection.
- stateful domains.
- session cookie domain.
- role/permission admin.

Jika arsitektur deployment membutuhkan token, token harus dikelola dengan pendekatan yang aman dan memiliki expiry/revocation yang sesuai.

---

# 13. Database

Struktur awal:

```text
users
├── id
├── name
├── email
├── password
├── role
├── created_at
└── updated_at

team_members
├── id
├── name
├── slug
├── role
├── bio
├── photo
├── skills
├── github_url
├── linkedin_url
├── instagram_url
├── created_at
└── updated_at

projects
├── id
├── category_id
├── title
├── slug
├── short_description
├── description
├── cover
├── demo_url
├── repository_url
├── status
├── published_at
├── created_at
└── updated_at

categories
├── id
├── name
├── slug
└── timestamps

technologies
├── id
├── name
├── slug
├── icon
└── timestamps

project_technology
├── project_id
└── technology_id

project_team_member
├── project_id
└── team_member_id

messages
├── id
├── name
├── email
├── subject
├── message
├── is_read
├── created_at
└── updated_at
```

Relasi utama:

```text
categories 1 ─────── N projects

projects N ───────── N technologies
          melalui project_technology

projects N ───────── N team_members
          melalui project_team_member
```

Struktur dapat disesuaikan saat ERD final dibuat.

---

# 14. Keamanan

## Frontend

- Jangan menyimpan credential database.
- Jangan menyimpan secret backend.
- Jangan mengandalkan route frontend sebagai proteksi.
- Gunakan HTTPS.
- Validasi input dasar sebelum request.
- Jangan menampilkan informasi sensitif di console production.

## Backend

- Authentication.
- Authorization.
- Form Request validation.
- Rate limiting.
- CORS yang ketat.
- CSRF protection untuk mekanisme session/cookie.
- Sanitasi HTML Quill.
- Validasi upload file.
- Pembatasan MIME type dan ukuran file.
- Penyimpanan file menggunakan Laravel Storage.
- Jangan expose `.env`.
- Jangan expose folder project Laravel di web root.
- Logging dan error handling tanpa membocorkan credential.

---

# 15. Upload Media

Media project dapat diunggah melalui admin frontend.

Alur:

```text
Admin Frontend
      ↓
Multipart FormData
      ↓
Laravel API
      ↓
Validation
      ↓
Storage
      ↓
Database menyimpan path
```

Frontend hanya menyimpan/menerima URL atau path media yang memang diperbolehkan.

---

# 16. SEO dan Performance

Public website perlu memperhatikan:

- Semantic HTML.
- Meta title.
- Meta description.
- Open Graph.
- Twitter/X card bila diperlukan.
- Sitemap.
- robots.txt.
- Clean URL/slug.
- Optimasi gambar.
- Lazy loading.
- Responsive design.
- Minification/build melalui Vite.
- Penggunaan asset secara efisien.

Jika halaman public menggunakan HTML statis hasil build, data API dapat dimuat secara client-side. Jika kebutuhan SEO untuk halaman project berkembang, strategi rendering dapat ditinjau kembali pada tahap pengembangan berikutnya.

---

# 17. Design System

Arah visual NAHNU:

- Modern.
- Minimal.
- Profesional.
- Elegan.
- Tidak terlalu banyak efek.
- Fokus pada typography, spacing, grid, dan hierarchy.
- Responsive untuk desktop, tablet, dan mobile.

Komponen reusable:

```text
Navbar
Footer
Button
Card
ProjectCard
TechnologyBadge
TeamCard
Modal
FormInput
Toast
Pagination
Filter
AdminSidebar
AdminNavbar
DataTable
RichTextEditor
```

---

# 18. Git dan Workflow 3 Developer

Repository dipisahkan:

```text
nahnu-frontend
nahnu-backend
```

Contoh branch:

```text
main
develop
feature/homepage
feature/project-api
feature/admin-project
feature/contact-api
fix/login
```

Workflow:

```text
Feature Branch
      ↓
Commit
      ↓
Pull Request
      ↓
Code Review
      ↓
Merge ke develop
      ↓
Testing
      ↓
Merge ke main
      ↓
Deploy
```

Setiap developer sebaiknya memiliki area tanggung jawab, tetapi perubahan lintas frontend/backend tetap harus melalui koordinasi API contract.

---

# 19. Pembagian Tugas 3 Developer

## Developer 1 — Frontend Public

Fokus:

- Home.
- Projects.
- Project detail.
- About.
- Contact.
- Responsive UI.
- Component system.

## Developer 2 — Frontend Admin

Fokus:

- Login UI.
- Dashboard.
- CRUD project.
- CRUD kategori.
- CRUD teknologi.
- CRUD team member.
- Messages.
- Quill integration.

## Developer 3 — Backend

Fokus:

- Laravel 13.
- Database.
- REST API.
- Authentication.
- Authorization.
- Validation.
- Storage.
- Security.
- API documentation.
- Deployment backend.

Pembagian ini fleksibel dan dapat berubah sesuai kebutuhan tim.

---

# 20. Deployment

## Frontend

Setelah:

```bash
npm run build
```

hasil build berada di:

```text
dist/
```

Untuk hosting static/cPanel, isi `dist` dapat ditempatkan pada document root frontend, misalnya:

```text
public_html/
```

Konfigurasi rewrite diperlukan jika routing frontend menggunakan history API.

## Backend

Laravel tidak boleh dipasang dengan seluruh project menjadi web root.

Document root diarahkan ke:

```text
nahnu-backend/public
```

File `.env` tetap berada di luar public web root.

Contoh:

```text
api.nahnu.id
      ↓
Laravel 13
      ↓
public/
```

Database:

```text
MySQL / MariaDB
```

---

# 21. Environment

## Frontend

Contoh:

```env
VITE_API_BASE_URL=https://api.nahnu.id/api
```

Jangan memasukkan secret backend ke dalam environment frontend karena nilai Vite yang digunakan client pada dasarnya dapat terlihat oleh browser.

## Backend

Contoh konsep:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.nahnu.id

DB_CONNECTION=mysql
DB_HOST=...
DB_PORT=3306
DB_DATABASE=...
DB_USERNAME=...
DB_PASSWORD=...

SESSION_DOMAIN=...
SANCTUM_STATEFUL_DOMAINS=...
```

Nilai credential aktual tidak boleh dimasukkan ke repository.

---

# 22. Tahapan Implementasi

## Phase 1 — Project Setup

- Membuat repository frontend.
- Membuat repository backend.
- Setup Laravel 13.
- Setup Vite.
- Setup Tailwind CSS.
- Setup Axios.
- Setup database.
- Setup Git.

## Phase 2 — Database

- Membuat migration.
- Membuat model.
- Membuat relasi.
- Seeder data awal.
- Pengujian database.

## Phase 3 — Public API

- Projects.
- Categories.
- Technologies.
- Team members.
- Contact.

## Phase 4 — Public Frontend

- Layout.
- Navbar.
- Home.
- Projects.
- Project detail.
- About.
- Contact.
- Responsive design.

## Phase 5 — Admin Authentication

- Login.
- Logout.
- Session/auth state.
- Authorization.
- Protected API.

## Phase 6 — Admin Frontend

- Dashboard.
- Project CRUD.
- Category CRUD.
- Technology CRUD.
- Team CRUD.
- Message management.
- Settings.

## Phase 7 — Quill & Media

- Integrasi Quill.
- Sanitasi HTML.
- Upload cover.
- Upload media.
- Storage.

## Phase 8 — Security

- Validation.
- Rate limiting.
- CORS.
- CSRF/session protection.
- Authorization.
- Upload security.
- Error handling.

## Phase 9 — Testing

- API testing.
- Authentication testing.
- CRUD testing.
- Upload testing.
- Responsive testing.
- Browser testing.

## Phase 10 — Deployment

- Build frontend.
- Deploy frontend.
- Deploy Laravel backend.
- Configure database.
- Configure HTTPS.
- Configure CORS/Sanctum.
- Production testing.

---

# 23. MVP

MVP minimum:

### Public

- Home.
- Projects.
- Project detail.
- About.
- Contact.

### Admin

- Login.
- Dashboard sederhana.
- CRUD projects.
- CRUD categories.
- CRUD technologies.
- CRUD team members.
- Messages.

### Backend

- Laravel 13.
- REST API.
- MySQL/MariaDB.
- Authentication.
- Authorization.
- Validation.
- Storage.

### Frontend

- HTML.
- Tailwind CSS 4.
- JavaScript.
- Vite.
- Axios.
- Quill.

---

# 24. Struktur Akhir Project

```text
NAHNU
│
├── nahnu-frontend
│   ├── Public Website
│   ├── Admin Panel
│   ├── HTML
│   ├── Tailwind CSS
│   ├── JavaScript
│   ├── Vite
│   ├── Axios
│   └── Quill
│
└── nahnu-backend
    ├── Laravel 13
    ├── REST API
    ├── Authentication
    ├── Authorization
    ├── Validation
    ├── Storage
    └── MySQL / MariaDB
```

**Filament tidak digunakan dalam arsitektur NAHNU.**

Admin sepenuhnya dibuat pada frontend dan menggunakan API Laravel sebagai satu-satunya jalur akses ke data backend.

---

# 25. Kesimpulan

NAHNU menggunakan arsitektur **frontend-backend terpisah** dengan 3 developer.

Frontend bertanggung jawab terhadap:

- Public website.
- Admin panel.
- UI/UX.
- Interaksi pengguna.
- Quill.
- Komunikasi API melalui Axios.

Backend Laravel 13 bertanggung jawab terhadap:

- REST API.
- Database.
- Authentication.
- Authorization.
- Validation.
- Storage.
- Business logic.
- Security.

Pemisahan ini membuat masing-masing bagian dapat dikembangkan secara independen, sementara kontrak API menjadi penghubung utama antara frontend dan backend.

**Prinsip utama:**

> **Frontend mengelola tampilan dan interaksi. Backend mengelola data, aturan bisnis, autentikasi, dan keamanan.**
