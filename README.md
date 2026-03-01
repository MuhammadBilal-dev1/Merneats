🍔 MernEats | Enterprise‑Grade MERN + TypeScript Food Ordering Platform

Badges

![Vercel](https://img.shields.io/badge/Hosting-Vercel-black?logo=vercel)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=white)
![Node](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)
![Stripe](https://img.shields.io/badge/Payments-Stripe-635BFF?logo=stripe&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Images-Cloudinary-3448C5?logo=cloudinary&logoColor=white)
![Tailwind](https://img.shields.io/badge/UI-Tailwind-06B6D4?logo=tailwindcss&logoColor=white)

Executive Summary

MernEats is a full‑stack restaurant ordering platform that streamlines discovery, menu management, cart, and payments. Built with the MERN stack and TypeScript, it delivers a fast customer experience, a pragmatic admin workflow, and secure payments via Stripe Checkout with webhook order confirmation.

High‑Level Architecture

```mermaid
flowchart LR
  subgraph Client [Client (React + Vite)]
    UI[UI / Pages]
    State[Zustand Stores]
    Fetch[Axios HTTP]
  end

  subgraph Server [API (Express + TypeScript)]
    Auth[Auth & User]
    Restaurant[Restaurant & Menus]
    Orders[Orders & Stripe]
    Mail[Mailtrap Emails]
  end

  CDN[(Cloudinary)]
  DB[(MongoDB Atlas)]
  Stripe[(Stripe Checkout + Webhooks)]

  UI --> State --> Fetch --> Server
  Auth --> DB
  Restaurant --> DB
  Orders --> DB
  Restaurant --> CDN
  Orders <--> Stripe
```

Core Modules & Capabilities

1. Customer Experience

- Smart Search: Fuzzy search across restaurant name, city, country, cuisines, and menu items.
- Cart & Checkout: Persistent cart (Zustand) and Stripe Checkout session with webhooks.
- Order History: Orders list page with per‑order detail view (item subtotals and totals).

2. Admin Experience

- Restaurant Profile: Create/update restaurant and banner image (Cloudinary).
- Menu Management: Add/Edit/Delete menus; Cloudinary image deletion on remove.
- Order Control: Update order status (pending → confirmed → preparing → outfordelivery → delivered).

3. Communication & Security

- Email Flows: Email verification and password reset via Mailtrap.
- Auth: Token‑based auth guard for protected routes and admin routes.

Technology Stack

| Layer    | Technology                                 | Purpose                                                    |
| -------- | ------------------------------------------ | ---------------------------------------------------------- |
| Frontend | React + Vite, TypeScript, Tailwind, Shadcn | Fast UI, component primitives, DX                          |
| State    | Zustand                                    | Lightweight global state (auth, cart, orders, restaurants) |
| Backend  | Node.js, Express (TypeScript)              | REST API, domain logic                                     |
| DB       | MongoDB + Mongoose                         | Persistent storage                                         |
| Payments | Stripe Checkout + Webhooks                 | Secure card payments                                       |
| Media    | Cloudinary                                 | Image upload/serve and deletion                            |
| Email    | Mailtrap                                   | Dev‑friendly transactional emails                          |

Project Structure

```
Restaurant-Website/
├─ client/                 # React + Vite (TypeScript)
│  ├─ src/
│  │  ├─ components/      # UI components (shadcn + custom)
│  │  ├─ pages/           # Views (Home, Search, Cart, Orders, etc.)
│  │  ├─ store/           # Zustand stores (user, cart, restaurant, orders)
│  │  ├─ schema/          # Zod schemas
│  │  └─ types/           # Shared TS types
│  └─ index.html          # App shell
├─ server/                 # Express API (TypeScript)
│  ├─ src/
│  │  ├─ controller/      # Controllers (user, restaurant, menu, order)
│  │  ├─ models/          # Mongoose schemas
│  │  ├─ routes/          # Express routers
│  │  ├─ utils/           # Helpers (cloudinary, token, upload)
│  │  └─ mailtrap/        # Email templates & client
└─ vercel.json            # Client deploy config (Vercel static build)
```

Server Environment (server/.env)

- PORT=8000
- MONGO_URL=your-mongodb-uri
- FRONTEND_URL=http://localhost:5173
- SECRET_KEY=your-session-secret
- CLOUD_NAME=your-cloudinary-cloud
- API_KEY=your-cloudinary-key
- API_SECRET=your-cloudinary-secret
- MAILTRAP_API_TOKEN=your-mailtrap-token
- STRIPE*PUBLISHABLE_KEY=pk_test*…
- STRIPE*SECRET_KEY=sk_test*…
- WEBHOOK*ENDPOINT_SECRET=whsec*…

Run Locally

Server

- cd server
- npm install
- npm run dev

Client

- cd client
- npm install
- npm run dev
- App: http://localhost:5173

Stripe Webhook (Dev)

- stripe login
- stripe listen --forward-to localhost:8000/api/v1/order/webhook
- Copy the whsec\_… from the console to WEBHOOK_ENDPOINT_SECRET

Key Endpoints (Server)

- Auth
  - POST /api/v1/user/signup
  - POST /api/v1/user/login
  - POST /api/v1/user/logout
  - GET /api/v1/user/check-auth
  - POST /api/v1/user/verify-email
  - POST /api/v1/user/forgot-password
  - POST /api/v1/user/reset-password/:token

- Restaurant & Menu
  - GET /api/v1/restaurant
  - POST /api/v1/restaurant
  - PUT /api/v1/restaurant
  - GET /api/v1/restaurant/search/:searchText?searchQuery=&selectedCuisines=
  - POST /api/v1/menu (multipart image)
  - PUT /api/v1/menu/:id (multipart image)
  - DELETE /api/v1/menu/:id (deletes Cloudinary image)

- Orders & Payments
  - GET /api/v1/order
  - POST /api/v1/order/checkout/create-checkout-session
  - POST /api/v1/order/webhook (Stripe → Server)

Deployment (Vercel for Client)

- vercel.json is already configured for a static client build and SPA fallback.
- Update the API proxy route in vercel.json:
  - "dest": "https://YOUR-BACKEND-DOMAIN/api/$1"
- Build command: npm run build (client)
- Dist dir: dist

Notes & Security

- Never commit secrets. Keep server/.env local or use Vercel/hosted env vars.
- Stripe requires integer amounts (cents). We use Math.round for safety.
- Webhook must use the exact whsec\_… printed by stripe listen.
- Cloudinary deletes menu images when menus are removed.

Troubleshooting

- Stripe 500 on session create:
  - Check STRIPE_SECRET_KEY and allowed shipping countries.
  - Ensure unit_amount is integer (cents).
- Webhook not firing:
  - Ensure stripe listen is running and WEBHOOK_ENDPOINT_SECRET matches.
- Mail not delivered:
  - Mailtrap demo inbox only receives to test recipients.

License

All rights reserved. For internal/project use.
