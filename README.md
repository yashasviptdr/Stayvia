# 🏠 Stayvia

> **Hostel & PG Finder – Student Accommodation and Mess Management Platform**
> *Initial Campus Focus: Madhav Institute of Technology and Science (MITS), Gwalior, Madhya Pradesh*

Stayvia is a modern, student-centric web platform designed to help university students discover, compare, and book student hostels, paying guest (PG) accommodations, and shared apartments. Initially personalized for students studying near **MITS Gwalior (Gola Ka Mandir)**, Stayvia allows students to explore demonstration listings across Gwalior localities (Gola Ka Mandir, Anand Nagar, Thatipur, Morar, City Center) and local campus mess services.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3 (Custom CSS variables & design tokens), JavaScript ES6, Bootstrap 5.3, Bootstrap Icons
- **Backend**: Node.js, Express.js
- **Security & Utilities**: Helmet (HTTP security headers), CORS, Morgan (HTTP logging), Dotenv (environment variable management)
- **Database**: MySQL (configured with `mysql2/promise` connection pooling)
- **Architecture**: Modular Express routing, centralized error handling, client-side separation of sample data

---

## 📂 Project Organization

```text
stayvia/
├── config/
│   └── db.js                 # Safe MySQL connection pool & status tracker
├── database/
│   └── schema.sql            # Initial MySQL database table definitions
├── middleware/
│   └── errorHandler.js       # Centralized 404 & 500 error handlers
├── public/                   # Static frontend served by Express
│   ├── css/
│   │   └── style.css         # Modern startup theme with CSS tokens
│   ├── js/
│   │   ├── main.js           # Interactive UI, filters, modals & session handling
│   │   └── sample-data.js    # Structured client demonstration catalog
│   ├── index.html            # Responsive homepage with MITS Gwalior filters
│   ├── login.html            # Dedicated login page with quick-fill demo buttons
│   ├── signup.html           # Dedicated account creation page
│   └── property.html         # Dedicated property details view & visit booking flow
├── routes/
│   └── api.js                # Health check & demonstration API endpoints
├── tests/
│   └── health-check.test.js  # Server & health check verification test
├── .env.example              # Template for environment configuration
├── .gitignore                # Excludes node_modules, .env, and logs
├── package.json              # Project scripts & package definitions
├── server.js                 # Main Express server entry point
└── README.md                 # Project documentation & beginner guide
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18.x or v20.x or v24.x LTS)
- **npm** (v9+ or v10+)
- **MySQL Server** (Optional for Task 1; the application safely runs in demonstration mode without MySQL).

### 2. Navigate to the Project
Open your terminal (PowerShell, Command Prompt, or Bash) in the project directory:
```bash
cd C:\Users\ratne\.gemini\antigravity\scratch\stayvia
```

### 3. Install Dependencies
```bash
npm install
```
*(This installs Express, dotenv, cors, helmet, morgan, and mysql2).*

### 4. Configure Environment Variables
Copy the `.env.example` file to create your own `.env`:
```bash
copy .env.example .env     # On Windows PowerShell / Command Prompt
# or
cp .env.example .env       # On macOS / Linux
```

### 5. Start the Application
- **Standard Mode**:
  ```bash
  npm start
  ```
- **Development Mode** (auto-restarts on code changes using nodemon):
  ```bash
  npm run dev
  ```

### 6. View in Your Browser
- **Homepage (with MITS Gwalior Filters)**: Open [http://localhost:3000](http://localhost:3000)
- **Dedicated Login Page**: Open [http://localhost:3000/login](http://localhost:3000/login)
- **Dedicated Signup Page**: Open [http://localhost:3000/signup](http://localhost:3000/signup)
- **Property Details & Booking Flow**: Open [http://localhost:3000/property?id=1](http://localhost:3000/property?id=1)
- **Health Check API**: Open [http://localhost:3000/api/health](http://localhost:3000/api/health)
- **Accommodations API**: Open [http://localhost:3000/api/accommodations](http://localhost:3000/api/accommodations)

### 7. Run Automated Tests
```bash
npm test                             # Runs server, health-check & API route tests
node tests/client-filters.test.js    # Tests client-side locality, type, budget & facility filters
```

---

## 🗄️ Configuring MySQL (For Phase 2)

Stayvia is engineered with a **safe database connector** (`config/db.js`). The server will **not** crash or fail to load if MySQL is stopped or unconfigured.

When you are ready to connect a real MySQL database:
1. Ensure your MySQL server (such as MySQL Community Server or XAMPP) is running.
2. Create the database and tables using the provided script:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
3. Update `.env` with your real MySQL password and user:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_actual_password
   DB_NAME=stayvia_db
   ```
4. Restart the server (`npm start`). The console and `/api/health` will immediately report `Connected to MySQL database: stayvia_db`.

---

## 📋 Status & Feature Roadmap

| Feature / Module | Status | Details |
| :--- | :---: | :--- |
| **Clean Project Structure** | ✅ Done | Modular folders: config, routes, middleware, public, tests |
| **Responsive Modern Homepage** | ✅ Done | Hero, Search Box, Trust Pillars, How It Works, Owner CTA, Footer |
| **Demonstration Accommodation Cards** | ✅ Done | Clear photo cards with rent, deposit, facilities pills & details modal |
| **Interactive Search & Type Filter** | ✅ Done | Live keyword, category (Hostel/PG/Flat), and budget filtering |
| **Express Backend Foundation** | ✅ Done | Express 4, Helmet CSP, CORS, JSON parsing, logging |
| **Safe MySQL Connector** | ✅ Done | Connection pooling with graceful offline fallback |
| **Health Check Endpoint** | ✅ Done | `GET /api/health` reports uptime, server info & DB connectivity |
| **Automated Verification Test** | ✅ Done | Native HTTP test asserting status 200 and schema |
| **User Authentication (JWT + bcrypt)** | ⏳ Pending | Scheduled for Phase 2 |
| **Live Database CRUD & Listings** | ⏳ Pending | Scheduled for Phase 2 |
| **Student Inquiries & Booking Visits** | ⏳ Pending | Scheduled for Phase 2 |
| **Mess Subscriptions & Meal Ordering**| ⏳ Pending | Scheduled for Phase 3 |
| **Owner Property Management Portal** | ⏳ Pending | Scheduled for Phase 3 |
| **Image Uploads (Multer)** | ⏳ Pending | Scheduled for Phase 3 |
