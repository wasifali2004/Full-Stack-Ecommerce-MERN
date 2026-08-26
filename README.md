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

### Environment variables

The repository uses one private `.env` file in each application directory. Vite only exposes variables prefixed with `VITE_` to browser code, so never put database credentials, API secrets, or JWT secrets in either frontend `.env` file.

#### Backend/.env

```env
PORT=4000
MONGODB_URI=
MONGODB_DB_NAME=e-commerce

CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_SECRET_KEY=

JWT_SECRET=jwt-sec
CLIENT_URL=http://localhost:5173,http://localhost:5174

STRIPE_SECRET_KEY=stripe-key

```

Configure these values in `Backend/.env`:

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | API port. Defaults to `4000`. |
| `MONGODB_URI` | Yes | MongoDB connection string, including a user with access to the database. |
| `MONGODB_DB_NAME` | No | MongoDB database name. Defaults to `e-commerce`. |
| `JWT_SECRET` | Yes | Long, random secret used to sign login tokens. |
| `CLIENT_URL` | No | Comma-separated allowed browser origins, for example `http://localhost:5173,http://localhost:5174`. |
| `CLOUDINARY_NAME` | Yes for image uploads | Cloudinary cloud name. |
| `CLOUDINARY_API_KEY` | Yes for image uploads | Cloudinary API key. |
| `CLOUDINARY_SECRET_KEY` | Yes for image uploads | Cloudinary API secret. |
| `STRIPE_SECRET_KEY` | Yes for Stripe checkout | Stripe secret key, such as a test-mode `sk_test_...` key during local development. |

`MONGODB_URI` and `JWT_SECRET` are required when the API starts. Cloudinary is needed to add product images. Stripe can be left unset if Stripe checkout is not being used; checkout requests will then return a configuration error. Do not add `ADMIN_EMAIL` or `ADMIN_PASSWORD`; admin accounts are managed in MongoDB.

#### Making an admin from MongoDB

New registrations are regular users. To promote an existing account, update its `role` field in the configured database:

```javascript
db.users.updateOne(
	{ email: "person@example.com" },
	{ $set: { role: "admin" } }
)
```

The collection is normally named `users` by Mongoose. The promoted user can then sign in through the admin dashboard with the email and password already stored for that account. Admin authorization checks the current database role on every protected request, so changing `role` back to `user` removes access without requiring an environment change.

#### Frontend/.env

Configure `Frontend/.env` like this:

```env
VITE_BACKEND_URL=http://localhost:4000
```

`VITE_BACKEND_URL` is the public base URL of the API. Do not add a trailing slash.

#### Admin/Admin Dashboard/.env

Configure `Admin/Admin Dashboard/.env` like this:

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_FRONTEND_URL=http://localhost:5173
```

`VITE_FRONTEND_URL` is used when the admin dashboard links back to the customer storefront.
Keep all `.env` files private. For production, configure the same variables in your hosting provider's environment settings. `VERCEL` is provided automatically by Vercel and does not need to be added manually.

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
