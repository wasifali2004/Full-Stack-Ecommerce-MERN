# Nexora Electronics — MERN Ecommerce

This repository contains three applications:

- `Frontend`: React/Vite customer storefront
- `Admin/Admin Dashboard`: React/Vite product and order administration
- `Backend`: Express, MongoDB, Cloudinary, JWT authentication, and Stripe checkout

## Local setup

Use Node.js 20 or newer. Install each application's dependencies:

```bash
cd Frontend
npm install

cd "../Admin/Admin Dashboard"
npm install

cd ../../Backend
npm install
```

Copy each `.env.example` to `.env` in the same directory and replace the placeholder values. The backend uses MongoDB Atlas through `MONGODB_URI` and requires JWT settings to start. Cloudinary is required for product image uploads, and Stripe is required only for Stripe checkout.

Start the API, storefront, and admin dashboard in separate terminals:

```bash
# Backend
npm run server

# Frontend
npm run dev

# Admin/Admin Dashboard
npm run dev
```

The default local URLs are:

- API: `http://localhost:4000`
- Storefront: `http://localhost:5173`
- Admin: `http://localhost:5174` (or the next available port printed by Vite)

## Verification

Run these before committing or deploying:

```bash
# Frontend and Admin/Admin Dashboard
npm run lint
npm run build

# Backend
npm run build
npm test
```

Order totals and product details are recalculated by the API. Stripe orders are marked paid only after the API retrieves and validates the Checkout Session.
