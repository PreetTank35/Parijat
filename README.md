# 🌸 PARIJAT (पारिजात)
### Hyperlocal, Multilingual Agricultural Marketplace for Indian Farmers
**Tagline:** *Rent • Share • Grow (भाड्याने घ्या • शेअर करा • समृद्ध व्हा)*

---

## 🌾 1. Product Vision & Philosophy

**Parijat** connects small and marginal farmers who need agricultural machinery with nearby equipment owners who have idle tractors, rotavators, and harvesters. It also empowers rural communities with honest, verified APMC mandi crop prices and collective group purchasing for fertilizers and seeds.

Built specifically with rural Maharashtra farmers in mind, Parijat solves real field constraints:
- **Low-Literacy & First-Time Smartphone First:** Touch targets $\ge 52\text{px}$, visual photographic cards, color + icon + localized text badges, and minimal typing.
- **Audio Assistance (Web Speech API):** Built-in speaker buttons ("ऐका" / "सुनें" / "Listen") with clear speech guidance and visual subtitle bubbles for low-connectivity environments.
- **Marathi (`mr`) Demonstration Default:** Native Marathi terminology (उदा. रोटाव्हेटर, नांगर, मळणी यंत्र, बाजार भाव, क्विंटल), with instantaneous switching to Hindi (`hi`) and English (`en`).
- **Honest Market Transparency:** Clear, unambiguous distinction between verified APMC wholesale mandi rates and transparent AI/Demo fair price estimates.
- **Hyperlocal Village Distance:** Nearby machinery discovery within 5 to 50 km radius across Pune district talukas (Baramati, Junnar, Hinjewadi, Shirur, Indapur, Bhor).

---

## 🛠️ 2. Technology Stack & Monorepo Architecture

```
parijat/
├── package.json                 # Monorepo root (npm workspaces)
├── .env                         # Root configuration
├── packages/
│   └── shared/                  # Shared Zod schemas, TypeScript types, constants & enums
└── apps/
    ├── api/                     # Express.js REST API with Prisma ORM
    │   ├── prisma/
    │   │   ├── schema.prisma    # Normalized schema (20 models)
    │   │   └── seed.ts          # Rich Pune district agricultural dataset
    │   └── src/
    │       ├── app.ts           # Express routing, CORS, cookies, error handling
    │       ├── server.ts        # Server entry point (port 3001)
    │       ├── routes/          # REST endpoints (/api/v1/...)
    │       └── services/        # Business logic & conflict prevention
    └── web/                     # React 18 frontend with Vite & Tailwind CSS
        ├── src/
        │   ├── components/      # Touch-friendly, high-contrast components
        │   ├── context/         # Auth, Voice, and Location contexts
        │   ├── i18n/            # Complete Marathi, Hindi, English dictionaries
        │   └── pages/           # 11 full-featured application screens
        └── vite.config.ts       # Vite proxy to backend API
```

---

## 🚀 3. Getting Started

### Prerequisites
- Node.js $\ge 18.0.0$
- npm $\ge 9.0.0$

### Setup & Database Seeding
```bash
# 1. Install all monorepo dependencies
npm install

# 2. Generate Prisma Client
npm run db:generate

# 3. Synchronize database schema (SQLite dev.db)
npm run db:migrate # or: npx prisma db push --schema=apps/api/prisma/schema.prisma

# 4. Seed rich Maharashtra demo data
npm run db:seed # or: npx tsx apps/api/prisma/seed.ts
```

### Running Locally
```bash
# Start backend API (http://localhost:3001)
npm run dev:api

# Start React web frontend (http://localhost:5174)
npm run dev:web

# Or run both simultaneously
npm run dev
```

### Deploying to Vercel

The root `vercel.json` configures the Vite web app and Express API as services in
one Vercel project. The web service handles `/`; `/api/*` is routed to the API.
The API entrypoint is `apps/api/src/app.ts`, which exports the Express app
without starting the local development listener. The API build generates
Prisma Client from its schema before running TypeScript, so deployment builds
do not depend on package-install lifecycle scripts.

The Prisma schema currently uses SQLite for local development. Vercel's
serverless filesystem is not a durable database, so configure a hosted database
and update the Prisma provider/schema before relying on persistent API data in
production. Set the required production environment variables in the Vercel
project settings; do not use the development secrets from `.env.example`.

---

## 👨‍🌾 4. Pre-Seeded Demo Farmer Accounts (1-Click Login)

The authentication system supports standard OTP verification as well as **1-Click Demo Profile Login** on the login screen (`/auth`):

| Farmer Name | Phone Number | Location | Role & Equipment |
|---|---|---|---|
| **Ramesh Tukaram Shinde** | `9822012345` | Baramati (बारामती) | Owner: Mahindra 45HP Tractor, Rotavator |
| **Sanjay Dattatray Patil** | `9822023456` | Junnar (जुन्नर) | Owner: Preet Combine Harvester, Sprayer |
| **Ananda Bhau Kadam** | `9822034567` | Hinjewadi (हिंजवडी) | Owner: Swaraj Tractor, Irrigation Pump |
| **Dnyaneshwar Baban More** | `9822045678` | Shirur (शिरूर) | Renter: Small Farmer (Soybean & Jowar) |
| **Sunita Ashok Gaikwad** | `9822056789` | Indapur (इंदापूर) | Renter: Marginal Farmer (Cotton & Gram) |
| **Ganesh Pandurang Jagtap** | `9822067890` | Bhor (भोर) | Owner: Paddy Thresher, Reversible Plough |

> **OTP Note:** In demo mode, the verification code for all phone numbers is **`123456`**.

---

## 📡 5. API Specification (`/api/v1`)

| Module | Method | Endpoint | Description |
|---|---|---|---|
| **Health** | GET | `/api/health` | Service status, mode, and timestamp |
| **Auth** | POST | `/api/v1/auth/request-otp` | Send 6-digit OTP |
| | POST | `/api/v1/auth/verify-otp` | Verify OTP & receive JWT cookie / token |
| | GET | `/api/v1/auth/me` | Fetch authenticated profile & language |
| | POST | `/api/v1/auth/logout` | Invalidate session |
| **Equipment** | GET | `/api/v1/equipment/categories` | Categories with Marathi/Hindi labels & icons |
| | GET | `/api/v1/equipment/villages` | Pune district pilot villages |
| | GET | `/api/v1/equipment` | Search by category, village, and radius |
| | GET | `/api/v1/equipment/:id` | Detailed listing with availability & masked phone |
| | POST | `/api/v1/equipment` | Create new equipment listing |
| **Bookings** | POST | `/api/v1/bookings` | Create rental booking request |
| | GET | `/api/v1/bookings/mine` | Farmer's rented bookings |
| | GET | `/api/v1/bookings/incoming` | Owner's incoming requests |
| | PATCH | `/api/v1/bookings/:id/status` | Accept, Reject, Complete, or Cancel |
| **Reviews** | POST | `/api/v1/reviews` | Post 1-5 star review after booking |
| | GET | `/api/v1/reviews/equipment/:id`| Reviews for machine |
| **Crop Prices** | GET | `/api/v1/crops` | Supported crops with Marathi names |
| | GET | `/api/v1/markets` | Pune APMC mandis (Gultekdi, Baramati, Junnar) |
| | GET | `/api/v1/market-prices` | Verified APMC wholesale prices |
| | POST | `/api/v1/price-estimates` | Transparent AI Demo fair price estimate |
| **Supplies** | GET | `/api/v1/inputs` | Seeds, fertilizers, pesticides catalog |
| | POST | `/api/v1/group-purchases/:id/join` | Join village bulk purchase pledge |
| **Messaging** | GET | `/api/v1/conversations` | Conversation list |
| | POST | `/api/v1/conversations/:id/messages` | Send message between renter & owner |

---

## 💡 6. Accessibility & Localization Features

1. **Audio Guidance (Web Speech API):**
   - Click the 🔊 speaker button on any card or screen to hear clean spoken Marathi / Hindi / English.
   - Includes a floating high-contrast speech bubble for devices lacking local speech synthesis voices.
2. **One-Tap Language Toggle:**
   - Permanent single-click language switcher (`मराठी` | `हिंदी` | `EN`) located directly in the top header.
3. **High-Contrast Touch UI:**
   - Minimum $52\text{px}$ touch targets across all mobile buttons.
   - Status badges combine distinct color, clear icon, and localized text.
