# 📚 The Ledger — Curated Bookstore Rating Platform & Marketplace

> An editorial bookstore directory and community rating marketplace blending the intuitive consumer experience of **Airbnb** with the warm, literary sophistication of **Kinfolk** and boutique bookshops.

Built with **React (Vite)**, **Node.js (Express)**, **PostgreSQL (Prisma ORM)**, and **Docker**.

---

## 🌟 Visual Preview & Aesthetics

The UI combines a warm ivory paper palette (`#FAF7F2`), deep espresso typography (`#1A1412`), and forest green accents (`#1B4332`) with classic gold star badges (`#D97706`).

* **Airbnb-Style Segmented Search Capsule**: Instant multi-criteria search filtering by bookstore name, street/city, curation style, and rating order.
* **Curated Category Carousel**: Horizontal icon strip filtering between Indie Shops, Literary Cafés, Historic & Rare Prints, and Poetry Salons.
* **Editorial Bookstore Cards**: High-resolution covers, curator pick badges, community quote snippets, and an interactive save/wishlist button.
* **Side-Sheet Rating Modal**: Interactive 1–5 star rating submission with live feedback and instant score updates.

---

## 🚀 Key Features by User Role

### 1. 👑 System Administrator
* **Executive Metrics Dashboard**: Real-time counter cards for total registered users, total bookstores, and total community ratings with role breakdown.
* **Platform User Management**:
  * View list of all members: Name, Email, Address, and Platform Role.
  * **Store Owner Rating Integration**: Automatically calculates and displays the bookstore name and live average rating score for each store owner.
  * Multi-field search filtering by Name, Email, and Address.
  * Clickable column sorting (**Ascending ▲ / Descending ▼**) across all table fields.
* **Bookstore Directory Management**:
  * Dedicated Stores Table displaying Store Name, Contact Email, Physical Address, Average Star Rating, and Assigned Owner.
  * Modal to register new stores with owner assignment.
  * Modal to create new user accounts (`STORE_OWNER`, `SYSTEM_ADMIN`, `NORMAL_USER`).

### 2. 🏪 Store Owner
* **Proprietor Dashboard**:
  * Real-time average store rating with visual gold star breakdown.
  * Total customer reviews recorded.
  * Sortable customer feedback table showing reviewer name, email, star rating, and review date.
* **Credential Management**: Update password modal directly from the navigation bar.

### 3. 📖 Normal Reader (User)
* **Explore Directory**: Search bookstores by name or physical street address.
* **Community Ratings**: Submit ratings (1 to 5 stars) for any registered store.
* **Modify Ratings**: Update or remove existing ratings with instantaneous average score recalculation.
* **My Ratings History**: Dedicated page tracking all bookstores you have personally reviewed.
* **Account Security**: Update password after logging in.

---

## 📋 Challenge Specification & Validations Checklist

| Requirement | Implementation | Status |
| :--- | :--- | :---: |
| **Tech Stack** | React + Express + PostgreSQL + Prisma | ✅ Complete |
| **Ratings Scale** | Strictly bounded 1 to 5 stars | ✅ Complete |
| **Single Login System** | Unified `/login` route with JWT & role-based routing | ✅ Complete |
| **Normal User Registration** | Full registration flow on `/register` | ✅ Complete |
| **Three User Roles** | `SYSTEM_ADMIN`, `STORE_OWNER`, `NORMAL_USER` | ✅ Complete |
| **Name Validation** | Min 20 characters, Max 60 characters | ✅ Complete |
| **Address Validation** | Maximum 400 characters | ✅ Complete |
| **Password Validation** | 8–16 characters, ≥1 uppercase letter, ≥1 special character | ✅ Complete |
| **Admin Store View** | View stores with Name, Email, Address, Rating | ✅ Complete |
| **Admin Store Owner Rating** | Displays store rating for store owners | ✅ Complete |
| **Table Sorting** | Ascending / Descending sorting on all data tables | ✅ Complete |

---

## 🔑 Demo Accounts (Pre-Seeded)

The database comes pre-seeded with **10 iconic bookstores**, **10 users**, and **29 community reviews**:

| Role | Email | Password | Access Details |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@storerating.com` | `Admin@12345` | Access to `/admin` Console |
| **Store Owner (Paris)** | `owner1@storerating.com` | `Owner@12345` | Owner of *Shakespeare & Company Paris* |
| **Store Owner (SF)** | `owner2@storerating.com` | `Owner@12345` | Owner of *City Lights Booksellers* |
| **Store Owner (Portland)**| `owner3@storerating.com` | `Owner@12345` | Owner of *Powell's City of Books* |
| **Normal Reader 1** | `user1@storerating.com` | `User@12345` | Arthur Conan Doyle |
| **Normal Reader 2** | `user2@storerating.com` | `User@12345` | Virginia Woolf |

---

## 🛠️ Tech Stack & Architecture

```
store-rating/
├── client/                     # Frontend (React 18 + Vite)
│   ├── src/
│   │   ├── components/         # StoreCard, Navbar, Logo, RatingModal, ChangePasswordModal
│   │   ├── context/            # AuthContext (JWT session management)
│   │   ├── pages/              # HomePage, LoginPage, RegisterPage, AdminDashboard, OwnerDashboard
│   │   ├── services/           # Axios HTTP client with auto-JWT interceptor
│   │   └── index.css           # Warm Editorial + Airbnb Design System tokens
├── server/                     # Backend (Node.js + Express)
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema (User, Store, Rating models)
│   │   └── seed.js             # 10 bookstores & community reviews seed script
│   └── src/
│       ├── controllers/        # authController, storeController, ratingController, adminController
│       ├── middleware/         # authMiddleware, roleMiddleware
│       ├── routes/             # authRoutes, storeRoute, ratingRoute, adminRoute, ownerRoute
│       └── validators/         # express-validator schemas matching challenge constraints
├── docker-compose.yml          # PostgreSQL 16 Alpine container configuration
└── package.json                # Root convenience proxy scripts
```

---

## ⚡ Getting Started Locally

### Prerequisites
* **Node.js** v18+ installed
* **Docker Desktop** (or a local PostgreSQL instance running on port `5432`)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/store-rating.git
cd store-rating
```

### 2. Start PostgreSQL Database
```bash
docker compose up -d
```
*Creates container `store_rating_postgres` with database `store_rating` on port `5432`.*

### 3. Install Backend & Run Database Migrations
```bash
cd server
npm install
npx prisma migrate dev --name init
npm run prisma:seed
```
*Seeds 10 bookstores, users, and ratings into PostgreSQL.*

### 4. Start Backend Server
```bash
npm run dev
```
*Runs backend API on `http://localhost:5000`.*

### 5. Install & Start Frontend (in a new terminal)
```bash
cd ../client
npm install
npm run dev
```
*Runs React Vite application on `http://localhost:5173`.*

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
* `POST /api/auth/register` — Register a new `NORMAL_USER`
* `POST /api/auth/login` — Sign in and receive JWT token + user profile
* `GET  /api/auth/me` — Retrieve current authenticated session
* `POST /api/auth/change-password` — Update account password
* `POST /api/auth/logout` — Invalidate session

### Bookstores (`/api/stores`)
* `GET  /api/stores` — List all stores (supports `search`, `sortBy`, `order`, `page`, `limit`)
* `GET  /api/stores/:id` — Get bookstore details, average rating, and user's rating
* `POST /api/stores` — Create a new store (Admin only)
* `PUT  /api/stores/:id` — Update store details (Admin only)
* `DELETE /api/stores/:id` — Delete store (Admin only)

### Ratings (`/api/ratings`)
* `POST /api/ratings` — Submit or update a 1–5 star rating (Users only, 1 rating per store)
* `GET  /api/ratings/my` — Get authenticated user's submitted ratings
* `DELETE /api/ratings/:storeId` — Delete a submitted rating

### System Administrator (`/api/admin`)
* `GET  /api/admin/dashboard` — Platform stats (users, stores, ratings, role distribution)
* `GET  /api/admin/users` — List all users with store ratings for owners (supports search & sorting)
* `POST /api/admin/users` — Create a new user with any designated role

### Store Owner (`/api/owner`)
* `GET  /api/owner/dashboard` — Live store stats, average score, and customer review list

---

## 🚢 Deployment Guide

### Fast Cloud Deployment (Render + Neon + Vercel)
1. **Database**: Create a free PostgreSQL instance on **[Neon.tech](https://neon.tech)** and copy the `DATABASE_URL`.
2. **Backend**: Deploy `server/` to **[Render.com](https://render.com)** as a Web Service:
   * Build Command: `npm install && npx prisma generate && npx prisma migrate deploy && npm run seed`
   * Start Command: `npm start`
   * Env: `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`
3. **Frontend**: Deploy `client/` to **[Vercel.com](https://vercel.com)**:
   * Root Directory: `client`
   * Env: `VITE_API_URL=https://your-render-backend.onrender.com/api`

---

## 📄 License
This project is open-source and available under the **MIT License**.
