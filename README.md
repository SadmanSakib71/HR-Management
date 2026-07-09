# HR Management API

Backend API for an HR Management System, built with Node.js, TypeScript, Express, and Knex/PostgreSQL.

## Tech Stack

- Node.js + TypeScript (OOP: classes for controllers, services, repositories)
- Express.js
- Knex.js (query builder) + PostgreSQL
- Joi (validation)
- Multer (file uploads)
- JWT (authentication)
- ESLint + Prettier

## Project Structure

```
src/
├── config/           # env, database, and multer configuration
├── database/
│   ├── migrations/
│   └── seeds/
├── modules/
│   ├── auth/
│   ├── employees/
│   ├── attendance/
│   └── reports/
├── middlewares/       # auth, error, validation, upload middlewares
├── common/
│   ├── errors/         # AppError and derived error classes
│   ├── utils/           # BaseRepository, BaseController, asyncHandler
│   └── types/           # shared/ambient TypeScript types
├── app.ts             # Express app setup
└── server.ts           # entry point
```

Each resource module follows a layered pattern: `routes -> controller -> service -> repository`.

## Prerequisites

- Node.js 18+
- PostgreSQL 13+

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the example environment file and fill in your local values:

   ```bash
   cp .env.example .env
   ```

3. Create the PostgreSQL database referenced by `DB_NAME` in your `.env`.

## Available Scripts

| Script                   | Description                                      |
| ------------------------ | ------------------------------------------------- |
| `npm run dev`             | Run the API in watch mode with `ts-node-dev`      |
| `npm run build`           | Compile TypeScript to `dist/`                     |
| `npm start`               | Run the compiled app from `dist/`                 |
| `npm run lint`            | Lint the codebase with ESLint                     |
| `npm run lint:fix`        | Lint and auto-fix issues                          |
| `npm run format`          | Format the codebase with Prettier                 |
| `npm run format:check`    | Check formatting without writing changes          |
| `npm run migrate`         | Run Knex migrations (`src/database/migrations`)   |
| `npm run migrate:rollback`| Roll back the last batch of migrations            |
| `npm run seed`            | Run Knex seed files (`src/database/seeds`)        |

## Health Check

Once running, verify the server is up:

```
GET /health
```

## Notes

- This repository currently contains only the project skeleton: configuration, folder structure,
  base OOP scaffolding (`BaseRepository`, `BaseController`), custom error classes, and core
  middlewares. Business logic, controllers, and route handlers for each module will be implemented
  in subsequent steps.
