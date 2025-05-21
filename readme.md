# 📦 Project Setup & Guide

## 🧾 User Accounts

| Email                | Username     | Password  | Role              |
|---------------------|--------------|-----------|-------------------|
| admin@example.com   | Admin        | password  | admin             |
| approval1@example.com | Approval 1 | password  | approval (user)   |
| approval2@example.com | Approval 2 | password  | approval (user)   |

---

## 💾 Database Configuration

| Database    | Version | Extensions |
|-------------|---------|------------|
| PostgreSQL  | 16.1    | -          |
| MySQL       | 8.0.39  | -          |

---

## 🧰 Stack Info

| Component | Version   |
|-----------|-----------|
| PHP       | 8.2.7     |
| Node.js   | 22.15.1   |

---

## ⚙️ Frameworks

| Framework | Version  |
|-----------|----------|
| Laravel   | 11.44.7  |
| React     | 18.2.0   |

---

## 🚀 Usage Guide

### 🛠️ Backend (Laravel)

#### 🔧 Setup Langkah-Langkah

1. **Clone Repository:**
   ```bash
   git clone https://github.com/zainalsaputra/booking-vehicle-app
   cd backend/
   ```

2. **Install Dependencies:**
   ```bash
   composer install
   ```

3. **Copy Environment File:**
   ```bash
   cp .env.example .env
   ```

4. **Generate App Key:**
   ```bash
   php artisan key:generate
   ```

5. **Setup Database:**
   - Edit `.env` dan sesuaikan DB connection (MySQL/PostgreSQL).
   - Buat dan sesuaikan nama database nya dengan `.env`
   - Jalankan migrasi dan seeder:
     ```bash
     php artisan migrate --seed
     ```

6. **Run Server:**
   ```bash
   php artisan serve
   ```
---

### 🌐 Frontend (React)

#### 🔧 Setup Langkah-Langkah

1. **Clone Repository:**
   ```bash
   git clone https://github.com/zainalsaputra/booking-vehicle-app
   cd frontend/
   ```

2. **Install Dependencies:**
   ```bash
   npm install --save --save-dev
   ```

3. **Jalankan Aplikasi:**
   ```bash
   npm run dev

---

## ❓ FAQ

**Q: Laravel tidak connect ke DB?**  
A: Periksa `.env` → DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD sesuai dengan database yang anda gunakan.

**Q: React gagal fetch data?**  
A: Pastikan URL backend benar menggunakan base url `http://localhost:8000`, karena semua implementasi di frontend dibuat secara hardcode (tidak menggunakan dotenv).

---

# 🗂️ Physical Data Model Application

## 🧑‍💼 `users`
| Column             | Type        | Constraint         |
|--------------------|-------------|--------------------|
| id                 | BIGINT      | PK, AUTO INCREMENT |
| name               | VARCHAR     | NOT NULL           |
| email              | VARCHAR     | UNIQUE, NOT NULL   |
| email_verified_at  | TIMESTAMP   | NULLABLE           |
| password           | VARCHAR     | NOT NULL           |
| remember_token     | VARCHAR(100)| NULLABLE           |
| role_id            | BIGINT      | FK → `roles.id`    |
| created_at         | TIMESTAMP   |                    |
| updated_at         | TIMESTAMP   |                    |

## 🧑‍⚖️ `roles`
| Column     | Type     | Constraint         |
|------------|----------|--------------------|
| id         | BIGINT   | PK, AUTO INCREMENT |
| name       | VARCHAR  | NOT NULL           |
| created_at | TIMESTAMP|                    |
| updated_at | TIMESTAMP|                    |

## 🏢 `offices`
| Column     | Type     | Constraint         |
|------------|----------|--------------------|
| id         | BIGINT   | PK, AUTO INCREMENT |
| name       | VARCHAR  | NOT NULL           |
| region     | VARCHAR  | NOT NULL           |
| created_at | TIMESTAMP|                    |
| updated_at | TIMESTAMP|                    |

## 🚗 `vehicles`
| Column           | Type     | Constraint               |
|------------------|----------|--------------------------|
| id               | BIGINT   | PK, AUTO INCREMENT       |
| name             | VARCHAR  | NOT NULL                 |
| plate_number     | VARCHAR  | UNIQUE, NOT NULL         |
| ownership        | ENUM     | ['company', 'rented']    |
| vehicle_type_id  | BIGINT   | FK → `vehicle_types.id`  |
| created_at       | TIMESTAMP|                          |
| updated_at       | TIMESTAMP|                          |

## 🚘 `vehicle_types`
| Column     | Type     | Constraint         |
|------------|----------|--------------------|
| id         | BIGINT   | PK, AUTO INCREMENT |
| name       | VARCHAR  | NOT NULL           |
| created_at | TIMESTAMP|                    |
| updated_at | TIMESTAMP|                    |

## 👷 `drivers`
| Column     | Type     | Constraint         |
|------------|----------|--------------------|
| id         | BIGINT   | PK, AUTO INCREMENT |
| name       | VARCHAR  | NOT NULL           |
| phone      | VARCHAR  | NULLABLE           |
| created_at | TIMESTAMP|                    |
| updated_at | TIMESTAMP|                    |

## 📝 `vehicle_requests`
| Column     | Type     | Constraint                        |
|------------|----------|-----------------------------------|
| id         | BIGINT   | PK, AUTO INCREMENT                |
| user_id    | BIGINT   | FK → `users.id`                   |
| vehicle_id | BIGINT   | FK → `vehicles.id`                |
| driver_id  | BIGINT   | FK → `drivers.id`                 |
| office_id  | BIGINT   | FK → `offices.id`                 |
| purpose    | VARCHAR  | NOT NULL                          |
| start_date | TIMESTAMP| NOT NULL                          |
| end_date   | TIMESTAMP| NOT NULL                          |
| status     | ENUM     | ['pending', 'approved', 'rejected'], default 'pending' |
| created_at | TIMESTAMP|                                   |
| updated_at | TIMESTAMP|                                   |

## ✅ `vehicle_approvals`
| Column             | Type     | Constraint                   |
|--------------------|----------|------------------------------|
| id                 | BIGINT   | PK, AUTO INCREMENT           |
| vehicle_request_id | BIGINT   | FK → `vehicle_requests.id`   |
| approver_id        | BIGINT   | FK → `users.id`              |
| status             | ENUM     | ['pending', 'approved', 'rejected'] |
| level              | INT      | NOT NULL                     |
| note               | TEXT     | NULLABLE                     |
| created_at         | TIMESTAMP|                              |
| updated_at         | TIMESTAMP|                              |

## 🔐 `password_reset_tokens`
| Column     | Type     | Constraint         |
|------------|----------|--------------------|
| email      | VARCHAR  | PK                 |
| token      | VARCHAR  | NOT NULL           |
| created_at | TIMESTAMP| NULLABLE           |

## 🧾 `sessions`
| Column        | Type       | Constraint         |
|---------------|------------|--------------------|
| id            | VARCHAR    | PK                 |
| user_id       | BIGINT     | FK → `users.id`    |
| ip_address    | VARCHAR(45)| NULLABLE           |
| user_agent    | TEXT       | NULLABLE           |
| payload       | TEXT       | NOT NULL           |
| last_activity | INT        | INDEXED            |

## 🔗 Relasi Antar Tabel
- `users.role_id` → `roles.id`
- `users.id` → `vehicle_requests.user_id`
- `users.id` → `vehicle_approvals.approver_id`
- `vehicles.vehicle_type_id` → `vehicle_types.id`
- `vehicles.id` → `vehicle_requests.vehicle_id`
- `drivers.id` → `vehicle_requests.driver_id`
- `offices.id` → `vehicle_requests.office_id`
- `vehicle_requests.id` → `vehicle_approvals.vehicle_request_id`
- `users.id` → `sessions.user_id`

![ERD](https://res.cloudinary.com/dlfpviz7i/image/upload/v1747801018/markdown/onzkfkdfmfmsxcqqvw6i.png)