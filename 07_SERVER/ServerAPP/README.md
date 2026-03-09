# ServerAPP — YouTube Favorites MVC Web Application

A server-side MVC web application built with **Node.js + Express**, **SQLite**, **EJS**, and **Bootstrap**.
Supports user authentication (register / login / logout) and a protected YouTube Favorites page per user.

---

## Architecture

```
ServerAPP/
├── app.js                    # Entry point — Express setup, middleware, routes
├── config/
│   ├── db.js                 # SQLite connection + table creation (Users, Favorites)
│   └── session.js            # express-session configured with SQLite store
├── middleware/
│   └── requireAuth.js        # Redirects unauthenticated requests to /login
├── models/
│   ├── user.js               # User OOP class
│   └── favorite.js           # Favorite OOP class
├── repositories/
│   ├── userRepository.js     # SQL queries for Users table
│   └── favoriteRepository.js # SQL queries for Favorites table (userId-scoped)
├── services/
│   ├── authService.js        # Register / login business logic (bcrypt)
│   ├── favoriteService.js    # Add / get / delete favorites logic
│   └── youtubeService.js     # YouTube Data API v3 search (server-side)
├── controllers/
│   ├── authController.js     # Handles register / login / logout HTTP actions
│   └── favoritesController.js# Handles favorites page / search / add / delete
├── routes/
│   ├── authRoutes.js         # GET|POST /register, /login, /logout
│   └── favoritesRoutes.js    # GET|POST /favorites, /favorites/search|add|delete
└── views/                    # EJS templates (Bootstrap 5)
    ├── login.ejs
    ├── register.ejs
    ├── home.ejs
    └── favorites.ejs
```

**Pattern:** MVC + Repository + Service layers
**Sessions:** Stored in `sessions.sqlite` via `connect-sqlite3`
**Passwords:** Hashed with `bcrypt` (12 rounds)

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default `3000`) |
| `SESSION_SECRET` | Yes | Long random string for session signing |
| `YOUTUBE_API_KEY` | Yes | YouTube Data API v3 key |
| `DB_PATH` | No | Custom path for `db.sqlite` (default: project root) |

### Getting a YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or select an existing one)
3. Enable **YouTube Data API v3**
4. Go to **Credentials** → **Create Credentials** → **API key**
5. Paste the key into `.env` as `YOUTUBE_API_KEY`

---

## Local Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file
cp .env.example .env
# Edit .env and set SESSION_SECRET and YOUTUBE_API_KEY

# 3. Run in development (auto-restart on changes)
npm run dev

# 4. Or run normally
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The SQLite database files (`db.sqlite`, `sessions.sqlite`) are created automatically on first run.

---

## Testing the App

1. **Register two users** at `/register` (e.g. `alice@test.com` and `bob@test.com`)
2. **Login as Alice** → go to **My YouTube Favorites**
3. Search for a video → click **+ Save**
4. Verify the favorite appears in the lower section
5. **Logout** → **Login as Bob**
6. Confirm Bob sees an empty favorites list (user isolation)
7. Add different favorites as Bob
8. Test **Remove** button to delete a favorite

---

## Render Deployment

### Steps

1. **Push your code** to a GitHub repository
   (make sure `.env` is in `.gitignore` — it already is)

2. **Create a new Web Service** on [Render](https://render.com)
   - Connect your GitHub repository
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node

3. **Set Environment Variables** in Render dashboard → Environment tab:
   - `SESSION_SECRET` — a long random string
   - `YOUTUBE_API_KEY` — your YouTube API key
   - (Do **not** set `PORT` — Render sets it automatically)

4. Deploy — Render will run `npm start` → `node app.js`

### SQLite on Render (Important)

Render's free tier uses an **ephemeral filesystem** — files written to disk are lost on each deploy/restart.
For a student submission this is acceptable (the app works during a demo session).
For production persistence, use a persistent disk (Render paid tier) or migrate to a hosted DB like PostgreSQL.

The `db.sqlite` and `sessions.sqlite` files will be recreated automatically with empty tables on each restart.

---

## Routes Summary

| Method | Route | Protected | Description |
|---|---|---|---|
| GET | `/register` | No | Register form |
| POST | `/register` | No | Create user account |
| GET | `/login` | No | Login form |
| POST | `/login` | No | Authenticate user |
| POST | `/logout` | Yes | Destroy session |
| GET | `/` | Yes | Home page |
| GET | `/favorites` | Yes | Favorites page (search + list) |
| POST | `/favorites/search` | Yes | Search YouTube videos |
| POST | `/favorites/add` | Yes | Save a video to favorites |
| POST | `/favorites/delete/:id` | Yes | Remove a favorite |
