# Expense Management API

REST API built with **Node.js, Express.js, MongoDB and Mongoose**.
Features: user creation, expense CRUD, filtering, pagination, date-range filter, expense summary, validation and centralized error handling.

## Setup

1. Install Node.js 18+ and have a MongoDB instance (local or MongoDB Atlas).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the env file and fill it in:
   ```bash
   cp .env.example .env
   ```
   ```
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/expense_db
   ```
4. Run:
   ```bash
   npm run dev   
   npm start     
   ```

## Project structure

```
src/
  config/        DB connection
  models/        Mongoose schemas
  validations/   express-validator rules
  services/      business logic
  controllers/   request/response handling
  routes/        endpoints (no business logic)
  middleware/    validate, 404 and global error handler
  utils/         AppError, asyncHandler
```

## Database schema (MongoDB has no migrations, schemas are defined in `src/models`)

**users**: `_id`, `name` (required), `email` (required, unique, lowercase), `createdAt`, `updatedAt`

**expenses**: `_id`, `userId` (ref users, required), `title` (required), `amount` (> 0), `category` (required), `description` (optional), `createdAt`, `updatedAt`

Relationship: one User has many Expenses.
> Note: MongoDB uses ObjectIds, so `userId` / `id` are 24-character hex strings (not integers like 1).

## Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| POST | `/users` | Create user |
| POST | `/expenses` | Create expense |
| GET | `/expenses` | List expenses (filters + pagination) |
| GET | `/expenses/summary` | Total and per-category summary |
| GET | `/expenses/:id` | Get one expense |
| PUT | `/expenses/:id` | Update expense |
| DELETE | `/expenses/:id` | Delete expense |

Query params for `GET /expenses` and `/expenses/summary`: `userId`, `category` (case-insensitive), `fromDate`, `toDate` (YYYY-MM-DD, toDate is inclusive). `GET /expenses` also accepts `page` (default 1) and `limit` (default 10, max 100).

### Examples

```
POST /users
{ "name": "John Doe", "email": "john@example.com" }

POST /expenses
{ "userId": "<user _id>", "title": "Lunch", "amount": 350, "category": "Food", "description": "Lunch with friends" }

GET /expenses?userId=<id>&category=Food&fromDate=2026-08-01&toDate=2026-08-21&page=1&limit=10
```

Paginated response:
```json
{ "success": true, "data": [], "pagination": { "page": 1, "limit": 10, "total": 25, "totalPages": 3 } }
```

Summary response:
```json
{ "success": true, "data": { "totalAmount": 850, "totalCount": 2, "byCategory": [{ "category": "Food", "total": 850, "count": 2 }] } }
```

### Errors

All errors look like `{ "success": false, "message": "Error description" }`.

| Status | When |
|--------|------|
| 400 | missing fields, invalid email/amount/ID/pagination/date, invalid JSON |
| 404 | user, expense or route not found |
| 409 | duplicate email |
| 500 | database or unexpected error |

## Postman

Import `postman_collection.json` and set the `baseUrl` variable (local or deployed URL). `userId` and `expenseId` are saved automatically after the create requests.

