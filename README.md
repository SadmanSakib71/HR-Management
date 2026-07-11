# HR Management API

Backend REST API for an HR Management System — authentication, employee records
(with photo uploads), daily attendance tracking, and monthly attendance reports.

## Tech Stack

- Node.js + TypeScript (OOP: classes for controllers, services, repositories)
- Express.js
- Knex.js (query builder) + PostgreSQL (tested against [Neon](https://neon.tech) serverless Postgres)
- Joi (validation)
- Multer (file uploads)
- JWT (authentication) + bcrypt (password hashing)
- ESLint + Prettier

## Prerequisites

- Node.js 18+
- A PostgreSQL 13+ database — either local Postgres or a serverless provider such as
  [Neon](https://neon.tech) (free tier is enough). You'll need the connection string.

## Setup

1. Clone the repository and install dependencies:

   ```bash
   git clone <repo-url>
   cd HRManagement
   npm install
   ```

2. Copy the example environment file and fill in your own values:

   ```bash
   cp .env.example .env
   ```

   At minimum, set `DATABASE_URL` to your Postgres connection string (e.g.
   `postgresql://user:password@host:5432/dbname?sslmode=require`) and `JWT_SECRET` to a
   random secret. Knex connects with `ssl: { rejectUnauthorized: false }`, which works for
   both local Postgres and SSL-requiring providers like Neon.

3. Run migrations to create the schema (`hr_users`, `employees`, `attendance`):

   ```bash
   npm run migrate
   ```

4. Run seeds to populate sample data (1 admin user, 5 employees, 10 attendance records):

   ```bash
   npm run seed
   ```

5. Start the dev server:

   ```bash
   npm run dev
   ```

   The API runs at `http://localhost:3000` by default (`PORT` in `.env`).

## Available Scripts

| Script                      | Description                                     |
| ---------------------------- | ------------------------------------------------ |
| `npm run dev`                | Run the API in watch mode with `ts-node-dev`      |
| `npm run build`               | Compile TypeScript to `dist/`                     |
| `npm start`                   | Run the compiled app from `dist/`                 |
| `npm run lint`                | Lint the codebase with ESLint                     |
| `npm run lint:fix`            | Lint and auto-fix issues                          |
| `npm run format`              | Format the codebase with Prettier                 |
| `npm run format:check`        | Check formatting without writing changes          |
| `npm run migrate`             | Run Knex migrations (`src/database/migrations`)   |
| `npm run migrate:rollback`    | Roll back the last batch of migrations            |
| `npm run seed`                | Run Knex seed files (`src/database/seeds`)        |

## Authentication

All endpoints except `/health` and `POST /api/auth/login` require a JWT, passed as a
`Bearer` token in the `Authorization` header.

Seeded admin credentials (for testing):

```
email:    admin@hr.com
password: admin123
```

**Login:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hr.com","password":"admin123"}'
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "email": "admin@hr.com", "name": "HR Admin" }
}
```

**Using the token on a protected route:**

```bash
curl http://localhost:3000/api/employees \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## API Endpoints

| Module | Method | Path | Auth | Description |
| --- | --- | --- | --- | --- |
| Health | GET | `/health` | — | Liveness check |
| Auth | POST | `/api/auth/login` | — | Log in, returns a JWT + basic user info |
| Employees | GET | `/api/employees` | JWT | List employees; supports `page`, `limit`, `search` (ILIKE on name) |
| Employees | GET | `/api/employees/:id` | JWT | Get a single employee |
| Employees | POST | `/api/employees` | JWT | Create an employee (`multipart/form-data`, optional `photo` file) |
| Employees | PUT | `/api/employees/:id` | JWT | Partially update an employee (`multipart/form-data`, optional new `photo`) |
| Employees | DELETE | `/api/employees/:id` | JWT | Soft-delete an employee (sets `deleted_at`, row is kept) |
| Attendance | GET | `/api/attendance` | JWT | List attendance; filters `employee_id`, `date`, `from`/`to`, pagination |
| Attendance | GET | `/api/attendance/:id` | JWT | Get a single attendance record |
| Attendance | POST | `/api/attendance` | JWT | Create-or-update (upsert) a check-in for `(employee_id, date)`; `201` if created, `200` if an existing record was updated |
| Attendance | PUT | `/api/attendance/:id` | JWT | Update `date` and/or `check_in_time` (`employee_id` is not editable) |
| Attendance | DELETE | `/api/attendance/:id` | JWT | Hard-delete an attendance record |
| Reports | GET | `/api/reports/attendance` | JWT | Monthly per-employee attendance summary; requires `month=YYYY-MM`, optional `employee_id` |
| Static | GET | `/uploads/*` | — | Serves uploaded employee photos (e.g. `/uploads/employees/<file>`) |

Employee photos are stored on disk under `UPLOAD_DIR` (default `uploads/`) and served
statically at `/uploads`. An employee's `photo_path` field (e.g. `employees/172xxxx-abcd.png`)
combines with that prefix to form the public URL, e.g. `/uploads/employees/172xxxx-abcd.png`.

## Project Structure

```
src/
├── config/            # env config, DB connection, Multer (image upload) config
├── database/
│   ├── migrations/     # hr_users, employees, attendance table definitions
│   └── seeds/          # 1 admin user, 5 employees, 10 attendance records
├── modules/
│   ├── auth/            # login, JWT issuing
│   ├── employees/        # CRUD + soft delete + photo upload
│   ├── attendance/        # CRUD + upsert-on-(employee_id, date)
│   └── reports/            # monthly attendance summary
├── middlewares/        # auth (JWT verify), error, Joi validate, upload (Multer)
├── common/
│   ├── errors/          # AppError base + NotFoundError, ValidationError, UnauthorizedError
│   ├── utils/            # BaseRepository, BaseController, asyncHandler
│   └── types/             # Express Request augmentation (req.user)
├── app.ts              # Express app setup (middleware, routes, static uploads)
└── server.ts            # entry point (DB connectivity check + listen)
```

Each resource module follows a layered pattern: `routes → controller → service → repository`.

## Notes

- `employees.deleted_at` implements soft delete — deleted employees are excluded from
  listings and lookups but the row remains in the database.
- `attendance` has a unique constraint on `(employee_id, date)`; `POST /api/attendance`
  upserts against it, and a database-level unique-violation (e.g. from a race condition)
  is caught and retried as an update rather than surfacing as a 500.
- All error responses share a consistent shape: `{ "error": "message" }`, with an optional
  `details` array for validation errors.
