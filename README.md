# WebBackend-group8

Open up http://localhost:5000 to see the server running on there

To run the server use
```shell
npm run dev
```

if you get an error about not having nodemon use 
```shell
npm install --save-dev nodemon
```


# Documentation

## How to Run

### Local 
To run the server use
```shell
npm run dev
```

If you get an error about not having nodemon use 
```shell
npm install --save-dev nodemon
```

Open up **http://localhost:5000** to see the server running on there

### Docker
```shell
docker-compose up --build
```

### Prerequisites
- Database must be running.
- Default connection: `localhost:5432`, database `fitness_db`

## How to Check If It's Running

1. Open **http://localhost:5000/test** in browser
2. Should return: `{ "message": "Connection established" }`
3. Terminal shows: `Server running on port 5000`

**If not working:**
- `ECONNREFUSED`: Database not running
- `relation does not exist`: Database not initialized (run init.sql)
- `Invalid token` : Token has expired, you need to login again 
- `Missing Authorization header` : Add `Bearer <token>` header 
- `Port 5000 in use `: Kill other process or change PORT 


## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Body | Returns |
|--------|----------|------|---------|
| POST | `/api/auth/register` | `{name, email, password}` | `{user, token}` |
| POST | `/api/auth/login` | `{email, password}` | `{user, token}` |
| GET | `/api/auth/me` | - (needs token) | `{user}` |

### Users (`/api/users`) - Protected

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| PUT | `/api/users/:id/name` | Update user name |
| GET | `/api/users/:id/height` | Get user height |
| PUT | `/api/users/:id/heightsave` | Update user height |

### Meals (`/api/meals`) - Protected

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/meals` | Add meal entry |
| DELETE | `/api/meals` | Remove meal entry |
| GET | `/api/meals/stats` | Get today's calorie stats |
| GET | `/api/meals/weekly` | Get weekly stats |
| GET | `/api/meals/entries` | Get user's meal entries |
| GET | `/api/foods` | Get all foods (public) |

### Hydration (`/api/hydration`) - Protected

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hydration` | Get today's water intake |
| POST | `/api/hydration/add` | Add water |
| POST | `/api/hydration/remove` | Remove water |
| POST | `/api/hydration/reset` | Reset today's intake |
| PUT | `/api/hydration/goal` | Update daily goal |
| GET | `/api/hydration/weekly` | Get weekly stats |

### Workouts (`/api/workouts`) - Protected

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/workouts` | Log completed workout |
| GET | `/api/workouts` | Get user's workout records |
| GET | `/api/workouts/all` | Get all available workouts |
| GET | `/api/workouts/stats` | Get user's workout stats |
| DELETE | `/api/workouts/:id` | Delete a workout record |

### Desks (`/api/desks`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/desks` | Get all desks |
| GET | `/api/desks/:id` | Get desk by ID |
| POST | `/api/desks` | Create new desk |
| PUT | `/api/desks/:id/height` | Update desk height |
| GET | `/api/desks/connection/status?deskId=X` | Check simulator connection |

### Contact (`/api/contact`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact` | Submit contact message |
| GET | `/api/contact` | Get all messages |

### Admin (`/admin`) - Protected (admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/users` | Get all users |
| DELETE | `/admin/users/:id` | Delete user |
| PATCH | `/admin/users/:id/type` | Change user type |
| GET | `/admin/workouts` | Get all workouts |
| POST | `/admin/workouts` | Create workout |
| DELETE | `/admin/workouts/:id` | Delete workout |
| GET | `/admin/foods` | Get all foods |
| POST | `/admin/foods` | Create food |
| DELETE | `/admin/foods/:id` | Delete food |

---

## Authentication

All protected routes need this header:
```
Authorization: Bearer <token>
```

**Get token from:** `/api/auth/login` or `/api/auth/register`

**Token contains:** `{id, email, type}`

**User types:**
- `standard` - regular user
- `premium` - access to meals feature  
- `admin` - full admin access


## Watch Out For

### 1. Database Must Be Running
```bash
docker-compose up
```
Backend connects to `localhost:5432`. Backend is useless without access to the DB so its important its running. 

if its your first time running the db 
```bash
docker-compose up --build
```

if u modify the db 
```bash 
docker-compose down -v 
docker-compose up --build
```

### 2. Database Functions
Backend uses PostgreSQL functions (not raw SQL):
```javascript
pool.query("SELECT * FROM user_create($1, $2, ...)", [params])
```
If function returns `function does not exist` than you need to run the DB.

### 3. Simulator Connection
Desk routes call external simulator at `http://localhost:8000`.
If simulator is down, `/desks/connection/status` returns `connected: false`.
Make sure to have the simulator running when you are trying to interact with it to avoid error.

## Why Is the Code Like This?

### `/routes/` - Routes setup

Separating them into files consiting one domain makes finding endpoints for a feature much easier and the code is bettter organised thanks to that.

### `/controllers/` - Handling request logic

Controllers handle validating input, calling model and returning response, keeping routes clean and logic reusable.

### `/models/` - Communicate with database
Each model represents one table in the database. Models store logic made using PostgreSQL functions making it easier to modify. When you change a query once it changes it everywhere.

### `/src/middleware/authMiddleware.js` - Check JWT
Runs before protected routes. Adds `req.user` if valid.
- **Why?** One place for auth logic. Add to any route with `authMiddleware`.


### `/src/db.js` - Database connection pool
Single pool shared by all models ensuring better performance and lack of connection leaks.

## Important Files

| File | What It Does |
|------|--------------|
| `src/server.js` | Starts the server on port 5000 |
| `src/app.js` | Express app with all routes |
| `src/db.js` | PostgreSQL connection pool |
| `src/middleware/authMiddleware.js` | JWT verification |
| `routes/*.js` | API endpoint definitions |
| `controllers/*.js` | Request handlers |
| `models/*.js` | Database operations |

---

## Running Tests

```bash
npm test              # Run all tests
npm run test:unit     # Unit tests only
npm run test:integration  # Integration tests only
```

Tests use Jest + Supertest. Mock database in `test/setup/mockDb.js`.

