# EasyTrade - Cloud Architecture

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              GITHUB REPOSITORY                                   │
│                         (Shreeramhegde01/EasyTrade)                             │
│                                     │                                            │
│                              push to main                                        │
└─────────────────────────────────────┼───────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           RENDER BLUEPRINT (CI/CD)                              │
│                          reads render.yaml on push                              │
│                        auto-deploys both services                               │
└────────────────────────────────────┬────────────────────────────────────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 │                                       │
                 ▼                                       ▼
┌────────────────────────────────┐    ┌────────────────────────────────┐
│     RENDER STATIC SITE         │    │     RENDER WEB SERVICE         │
│   easytrade-frontend           │    │   easytrade-backend            │
│                                │    │                                │
│   • React + TypeScript         │    │   • Spring Boot (Docker)       │
│   • Vite Build                 │    │   • REST API                   │
│   • Static Assets              │    │   • JWT Authentication         │
│                                │    │                                │
│   Build: npm run build         │    │   Build: Dockerfile            │
│   Output: /dist                │    │   Port: 8080                   │
└────────────────────────────────┘    └───────────────┬────────────────┘
             │                                        │
             │         HTTPS API Calls                │
             │◄──────────────────────────────────────►│
             │    /api/auth, /api/listings            │
                                                      │
                                                      │
                 ┌────────────────────────────────────┴────────────────────────────┐
                 │                                                                 │
                 ▼                                                                 ▼
┌────────────────────────────────────────┐    ┌────────────────────────────────────────┐
│            NEON DATABASE               │    │            CLOUDINARY                  │
│       (PostgreSQL Serverless)          │    │       (Image CDN & Storage)            │
│                                        │    │                                        │
│   • Users table                        │    │   • Product images upload              │
│   • Listings table                     │    │   • Auto image optimization            │
│   • Messages/Chats table               │    │   • CDN delivery                       │
│   • Conversations table                │    │   • Transformations                    │
│                                        │    │                                        │
│   Connection: JDBC over SSL            │    │   SDK: cloudinary-java                 │
└────────────────────────────────────────┘    └────────────────────────────────────────┘
```

---

## 📊 Data Flow

```
┌──────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────┐
│  User    │────►│   Frontend   │────►│   Backend   │────►│   Neon   │
│ Browser  │◄────│   (React)    │◄────│ (Spring)    │◄────│(Postgres)│
└──────────┘     └──────────────┘     └──────┬──────┘     └──────────┘
                                             │
                                             │ Image Upload
                                             ▼
                                      ┌──────────────┐
                                      │  Cloudinary  │
                                      │   (Images)   │
                                      └──────────────┘
```

---

## 🔄 CI/CD Pipeline (Render Blueprint)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Developer │     │   GitHub    │     │   Render    │     │    Live     │
│   Commits   │────►│   Push to   │────►│  Blueprint  │────►│   Deploy    │
│   Code      │     │   main      │     │  Triggered  │     │   Complete  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
                                    ┌─────────────────────┐
                                    │  render.yaml reads: │
                                    │  • Frontend: static │
                                    │  • Backend: docker  │
                                    └─────────────────────┘
```

---

## 🛠️ Technology Stack

| Component       | Technology              | Purpose                          |
|-----------------|-------------------------|----------------------------------|
| **Frontend**    | React + TypeScript      | User Interface                   |
| **Build Tool**  | Vite                    | Fast frontend bundling           |
| **Backend**     | Spring Boot 3.2         | REST API Server                  |
| **Auth**        | JWT + BCrypt            | Secure authentication            |
| **Database**    | Neon (PostgreSQL)       | Serverless relational database   |
| **Images**      | Cloudinary              | Image upload, storage & CDN      |
| **Hosting**     | Render                  | Cloud platform (free tier)       |
| **CI/CD**       | Render Blueprint        | Auto-deploy on git push          |
| **Container**   | Docker                  | Backend containerization         |

---

## 🌐 Live URLs

| Service  | URL                                          |
|----------|----------------------------------------------|
| Frontend | https://easytrade-frontend.onrender.com      |
| Backend  | https://easytrade-backend.onrender.com/api   |

---

## 🔐 Environment Variables

### Backend (easytrade-backend)
| Variable               | Source      | Purpose                    |
|------------------------|-------------|----------------------------|
| `DB_USERNAME`          | Neon        | Database username          |
| `DB_PASSWORD`          | Neon        | Database password          |
| `JWT_SECRET`           | Generated   | Token signing key          |
| `CLOUDINARY_CLOUD_NAME`| Cloudinary  | Cloud account name         |
| `CLOUDINARY_API_KEY`   | Cloudinary  | API authentication         |
| `CLOUDINARY_API_SECRET`| Cloudinary  | API secret key             |

### Frontend (easytrade-frontend)
| Variable           | Value                                      |
|--------------------|--------------------------------------------|
| `VITE_API_BASE_URL`| https://easytrade-backend.onrender.com/api |
