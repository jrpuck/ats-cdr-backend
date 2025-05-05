# ATS CDR Backend

A robust, real-time Call Detail Records (CDR) processing service built with Node.js, Express, and TypeScript. It authenticates to a remote API, streams CDR data, validates and stores it in MySQL via Prisma, and exposes REST endpoints for querying details, summaries, and paginated logs. Swagger documentation, Zod validation, and comprehensive logging ensure reliability and maintainability.

---

## 🛠️ Features

- **Real-Time Streaming**: Automatically authenticates and maintains a keep-alive stream to ingest CDRs.
- **Validation**: Uses Zod to ensure incoming CDR records match the expected schema.
- **Persistence**: Stores CDRs and activity logs in MySQL via Prisma ORM.
- **RESTful API**:
  - `GET /details?cust_id={id}`: Retrieve raw CDR records by customer.
  - `GET /summary?cust_id={id}`: Retrieve daily CDR counts by customer.
  - `GET /logs?page={n}&pageSize={m}`: Paginated activity logs.
- **Logging**: Unified logging with Winston writing directly to MySQL.
- **Swagger UI**: API documentation available at `/docs`.
- **ESLint & Prettier**: Enforced code style and formatting.
- **Testing**: Jest-based unit tests for core logic.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16+ (LTS)
- **PNPM** package manager
- **MySQL** database instance

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/jrpuck/ats-cdr-backend.git
   cd ats-cdr-backend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment variables**
   Copy `.env.example` to `.env` and fill in the values:
   ```dotenv
    PORT=your_port
    DATABASE_URL=your_database_url
    API_URL=your_api_url
    API_PORT=your_api_port
    API_USERNAME=your_username
    API_PASSWORD=your_password
   ```

4. **Database setup**
   You have two options to sync your Prisma schema with your database:

   - **With Migrations (recommended)**:
     ```bash
     pnpm prisma migrate dev --name init
     pnpm prisma generate
     ```
   - **Without migrations (quick)**:
     ```bash
     pnpm prisma db push
     pnpm prisma generate
     ```

---

## ⚙️ Available Scripts

- **`pnpm dev`**: Run in development mode (`ts-node src/server.ts`).
- **`pnpm build`**: Compile TypeScript to JavaScript in `dist/`.
- **`pnpm start`**: Start the compiled app from `dist/`.
- **`pnpm test`**: Run Jest tests with coverage.
- **`pnpm lint`**: Run ESLint.
- **`pnpm lint:fix`**: Auto-fix linting issues.
- **`pnpm format`**: Format code with Prettier.
- **`pnpm format:check`**: Check formatting.

---

## 📖 API Documentation

Once running, visit:

```
http://localhost:${os.getenv('PORT', '3000')}/docs
```

to view interactive Swagger UI for all endpoints.

---

## 🛡️ Logging & Monitoring

- **Activity Logs**: Every operation (auth, streaming, parse/store) is logged to the `logs` table in MySQL.
- **Error Handling**: Centralized error handler returns JSON errors and logs stack traces.

---

## ✅ Testing

- Core services are covered by Jest tests in `tests/`.
- Run `pnpm test` for coverage reports.

