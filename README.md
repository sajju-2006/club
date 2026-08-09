# Campus Hub

A full-stack campus events and club discovery platform built with React, Node.js/Express, and MongoDB — matching a modern dashboard UI with advanced features.

![Campus Hub Dashboard](https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800)

## Features

### Core
- **Dashboard** — Hero section, upcoming events, popular categories, club discovery, stats, and inspirational banner
- **Events** — Browse, filter by category, RSVP, and bookmark events
- **Clubs** — Search, join/leave clubs with live member counts
- **Communities** — Category-grouped community explorer
- **Calendar** — Interactive monthly calendar with event markers
- **Profile** — Edit profile, view joined clubs, saved events, and RSVPs

### Advanced
- **JWT Authentication** — Secure login/register with token-based sessions
- **Real-time Messaging** — Socket.io powered chat between students
- **Live Search** — Fuzzy search across events, clubs, and people
- **Notifications** — Real-time notification system with read/unread tracking
- **Dark Mode** — Full dark/light theme toggle with persistence
- **Idea Submission** — Submit new club/event proposals (admin review workflow)
- **Responsive Design** — Mobile-friendly with collapsible sidebar

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18, Vite, Tailwind CSS, Lucide Icons |
| Backend  | Node.js, Express, Socket.io         |
| Database | MongoDB with Mongoose               |
| Auth     | JWT + bcrypt                        |

## Prerequisites

- **Node.js** 18+
- **MongoDB** running locally (or MongoDB Atlas connection string)

## Quick Start

### 1. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

The backend `.env` file is pre-configured for local development:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campus-hub
JWT_SECRET=campus-hub-dev-secret-key-2026
CLIENT_URL=http://localhost:5173
```

### 3. Seed the database

Make sure MongoDB is running, then:

```bash
cd backend
npm run seed
```

### 4. Start the servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

### Demo Login

```
Email:    aarav@campus.edu
Password: password123
```

## API Endpoints

| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| POST   | `/api/auth/register`        | Register new user        |
| POST   | `/api/auth/login`           | Login                    |
| GET    | `/api/auth/me`              | Get current user         |
| GET    | `/api/events`               | List events (filterable) |
| GET    | `/api/events/upcoming`      | Upcoming events          |
| POST   | `/api/events/:id/rsvp`      | RSVP to event            |
| POST   | `/api/events/:id/bookmark`  | Bookmark event           |
| GET    | `/api/clubs`                | List clubs               |
| POST   | `/api/clubs/:id/join`       | Join/leave club          |
| GET    | `/api/categories`           | List categories          |
| GET    | `/api/stats`                | Platform statistics      |
| GET    | `/api/search?q=`            | Search all               |
| POST   | `/api/ideas`                | Submit club idea         |
| GET    | `/api/notifications`        | User notifications       |
| GET    | `/api/messages/conversations` | Chat conversations     |
| POST   | `/api/messages`             | Send message             |

## Project Structure

```
club/
├── backend/
│   ├── src/
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API routes
│   │   ├── middleware/    # Auth middleware
│   │   ├── server.js     # Express + Socket.io server
│   │   └── seed.js       # Database seeder
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Auth & Theme providers
│   │   ├── pages/        # Route pages
│   │   └── services/     # API client
│   └── package.json
└── README.md
```

## License

MIT
