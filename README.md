# JAC Vehicle Import Dashboard (MERN)

A premium, responsive vehicle import management system built with the MERN stack (MongoDB, Express, React, Node.js), featuring JWT authentication and role-based access control (Superadmin/Manager).

## Features
- **Dashboard**: Real-time KPIs, Category summaries, and Order suggestions.
- **Inventory**: Detailed tracking of stock and pipeline units.
- **Suppliers**: Management of different vehicle divisions and commitment targets.
- **Orders (PFI)**: Proforma Invoice management with status tracking.
- **Alerts**: Intelligent low-stock notifications.
- **Authentication**: Secure JWT-based login with role protection and optional **Biometric (Fingerprint) login**.
- **Aesthetics**: Premium UI using Material UI (MUI) and Tailwind CSS with glassmorphism effects.
- **Fail-safe Logic**: Automatic fallback to **Dummy JSON data** if the database connection fails.

## Tech Stack
- **Frontend**: React (Vite), MUI, Tailwind CSS, Framer Motion, Axios.
- **Backend**: Node.js, Express, MongoDB Atlas (Mongoose), JWT, Bcrypt.
- **Testing**: Jest, Supertest.

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Running locally or on Atlas)

### Setup Backend
1. `cd server`
2. `npm install`
3. Create `.env` file (copied from `.env.example` if available):
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/jac-dashboard
   JWT_SECRET=your_secret_key
   ```
4. Seed the database: `node scripts/seed.js`
5. Run dev server: `npm start` (ensure MongoDB is running)

### Setup Frontend
1. `cd client`
2. `npm install`
3. Run dev server: `npm run dev`

## Default Credentials
- **Superadmin**: `admin@jac.com` / `password123`
- **Manager**: `manager@jac.com` / `password123`

## Testing
- Run backend tests: `cd server && npm test`
