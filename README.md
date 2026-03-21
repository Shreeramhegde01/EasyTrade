# OLX Marketplace — Full Stack App

A marketplace application built with **Spring Boot** (backend) and **React + TypeScript** (frontend).

## 🚀 How to Run

### Prerequisites
- **Java 17+** (Java 24 works too)
- **Node.js 18+**
- **Maven** (comes with the project's `mvnw` or install globally)

### Step 1: Start the Backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```

The backend starts at **http://localhost:8080**.
- Uses H2 in-memory database (no setup needed)
- Demo data is auto-seeded on startup

### Step 2: Start the Frontend (React + Vite)

```bash
cd frontend
npm install        # first time only
npm run dev
```

The frontend starts at **http://localhost:5173** (or the next available port).

### Step 3: Open in Browser

Go to **http://localhost:5173** — you're ready!

---

## 👥 Demo Accounts

| Email                    | Password      |
|--------------------------|---------------|
| karthik@example.com      | password123   |
| priya@example.com        | password123   |
| rahul@example.com        | password123   |

Or create your own account via the **Sign Up** page.

---

## 🌐 Multi-User Access (LAN)

Other people on your WiFi network can access the app using **your IP address**:

1. Find your local IP:
   ```powershell
   ipconfig
   ```
   Look for **IPv4 Address** (e.g. `192.168.1.5`)

2. Share this URL with others:
   ```
   http://192.168.1.5:5173
   ```

3. Start Vite with `--host` flag to expose on network:
   ```bash
   cd frontend
   npx vite --host
   ```

> The backend already binds to `0.0.0.0` (all interfaces), and the frontend uses `window.location.hostname` dynamically for API calls, so LAN access works automatically.

---

## 📦 Features

- **User Authentication** — Register/Login with JWT tokens
- **Listing Management** — Create, view, search, and delete listings
- **Category Filtering** — Filter by Mobiles, Laptops, Electronics, etc.
- **Search** — Full-text search across titles and descriptions
- **Chat** — Start conversations with sellers
- **Profile** — View your profile and listings
- **Dark Theme** — Premium dark purple glassmorphism UI

---

## 🏗️ Project Structure

```
FULLSTACK/
├── backend/                    # Spring Boot API
│   ├── src/main/java/com/olx/
│   │   ├── config/             # Security, JWT, CORS, DataSeeder
│   │   ├── controller/         # REST endpoints
│   │   ├── dto/                # Request/Response DTOs
│   │   ├── model/              # JPA entities
│   │   ├── repository/         # Data access layer
│   │   └── service/            # Business logic
│   └── pom.xml
│
├── frontend/                   # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/         # Navbar, ListingCard
│   │   ├── pages/              # Home, Login, Signup, PostItem, etc.
│   │   ├── services/           # API client + auth helpers
│   │   └── index.css           # Full dark theme design system
│   └── package.json
│
└── README.md
```

---

## 🌍 Deployment Options

### Option 1: Railway / Render (Free Tier)

1. Push code to GitHub
2. **Backend**: Deploy as a Java/Maven project on [Railway](https://railway.app) or [Render](https://render.com)
   - Build command: `mvn clean package -DskipTests`
   - Start command: `java -jar target/olx-marketplace-0.0.1-SNAPSHOT.jar`
   - Add env variable: `SPRING_DATASOURCE_URL` for PostgreSQL (both services offer free PostgreSQL)
3. **Frontend**: Deploy on [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
   - Build command: `npm run build`
   - Output directory: `dist`
   - Set env variable for API URL (update `api.ts` to read from env)

### Option 2: VPS (DigitalOcean / AWS EC2)

1. Install Java 17+ and Node.js on the server
2. Build frontend: `cd frontend && npm run build`
3. Copy `frontend/dist/` to Spring Boot's `src/main/resources/static/`
4. Build JAR: `cd backend && mvn clean package`
5. Run: `java -jar target/olx-marketplace-0.0.1-SNAPSHOT.jar`
6. Access at `http://your-server-ip:8080`

### Option 3: Docker (Coming Soon)

Add Dockerfiles for both services and use Docker Compose.

---

## 🛠️ Tech Stack

| Layer     | Technology                                    |
|-----------|-----------------------------------------------|
| Backend   | Spring Boot 3.2, Spring Security, Spring JPA  |
| Frontend  | React 19, Vite 8, TypeScript, Axios           |
| Database  | H2 (dev) — swap to PostgreSQL for production  |
| Auth      | JWT + BCrypt                                  |
| Styling   | Vanilla CSS (dark theme, glassmorphism)       |
