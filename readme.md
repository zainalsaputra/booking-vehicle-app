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