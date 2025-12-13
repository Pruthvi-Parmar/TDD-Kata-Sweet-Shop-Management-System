# 🍬 Sweet Shop Management System

A full-stack Sweet Shop Management System built with **strict Test-Driven Development (TDD)** principles. This project demonstrates professional software development practices including the RED-GREEN-REFACTOR cycle, comprehensive testing, and clean code architecture.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [TDD Approach](#tdd-approach)
- [Commit History](#commit-history)

## 🎯 Overview

This Sweet Shop Management System allows users to:
- Browse and search for sweets
- Register and login with secure authentication
- Purchase sweets (decreases inventory)
- Admin users can add, update, delete sweets and manage inventory

The entire project was built following **strict TDD principles** with 46 commits demonstrating the RED-GREEN-REFACTOR cycle.

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| TypeScript | Type-safe JavaScript |
| MongoDB | Database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication |
| bcryptjs | Password hashing |
| express-validator | Request validation |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI library |
| TypeScript | Type-safe JavaScript |
| Vite | Build tool |
| React Router | Client-side routing |
| Axios | HTTP client |

### Testing
| Technology | Purpose |
|------------|---------|
| Jest | Backend testing framework |
| Supertest | HTTP assertions |
| Vitest | Frontend testing framework |
| React Testing Library | Component testing |

## ✨ Features

### 🔐 Authentication
- User registration with validation
- Secure login with JWT tokens
- Password hashing with bcryptjs
- Role-based access control (User/Admin)

### 🍭 Sweet Management
- View all sweets (public)
- Search by name, category, price range
- Create new sweets (authenticated)
- Update existing sweets (authenticated)
- Delete sweets (admin only)

### 📦 Inventory Management
- Purchase sweets (decreases quantity)
- Restock sweets (admin only)
- Stock validation (prevents overselling)
- Out-of-stock handling

## 📁 Project Structure

```
incutestversion2/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth & validation middleware
│   │   ├── models/          # Mongoose models
│   │   ├── repositories/    # Data access layer
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utilities (JWT)
│   │   ├── validators/      # Validation rules
│   │   ├── app.ts           # Express app setup
│   │   └── index.ts         # Server entry point
│   ├── tests/
│   │   ├── integration/     # API integration tests
│   │   └── setup.ts         # Test configuration
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/       # Admin components
│   │   │   ├── auth/        # Auth components
│   │   │   ├── common/      # Shared components
│   │   │   └── sweets/      # Sweet components
│   │   ├── services/        # API service
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tests/
│   │   └── components/      # Component tests
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
EOF

# Run development server
npm run dev

# Run tests
npm test
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "user": { ... },
  "token": "jwt_token_here"
}
```

### Sweets Endpoints

#### List All Sweets
```http
GET /api/sweets
```

**Response:** `200 OK`
```json
{
  "sweets": [
    {
      "_id": "...",
      "name": "Chocolate Truffle",
      "description": "Delicious chocolate truffle",
      "price": 5.99,
      "category": "Chocolate",
      "quantity": 100
    }
  ]
}
```

#### Search Sweets
```http
GET /api/sweets/search?name=chocolate&category=Chocolate&minPrice=5&maxPrice=10
```

#### Create Sweet (Auth Required)
```http
POST /api/sweets
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Vanilla Fudge",
  "description": "Creamy vanilla fudge",
  "price": 4.99,
  "category": "Fudge",
  "quantity": 50
}
```

**Response:** `201 Created`

#### Update Sweet (Auth Required)
```http
PUT /api/sweets/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 5.99,
  "quantity": 75
}
```

**Response:** `200 OK`

#### Delete Sweet (Admin Only)
```http
DELETE /api/sweets/:id
Authorization: Bearer <token>
```

**Response:** `200 OK`

#### Purchase Sweet (Auth Required)
```http
POST /api/sweets/:id/purchase
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 2  // Optional, defaults to 1
}
```

**Response:** `200 OK`

#### Restock Sweet (Admin Only)
```http
POST /api/sweets/:id/restock
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 50
}
```

**Response:** `200 OK`

### Error Responses

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Validation errors |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Admin access required |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Email already exists |
| 500 | Internal Server Error |

## 🧪 Testing

### Backend Tests (47 tests)

```bash
cd backend
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage report
```

**Test Coverage:**
- Authentication (13 tests)
  - Registration validation & success
  - Login validation & JWT generation
- Sweets CRUD (22 tests)
  - Create, Read, Update, Delete
  - Search & filtering
- Inventory (12 tests)
  - Purchase with stock validation
  - Restock (admin only)

### Frontend Tests (32 tests)

```bash
cd frontend
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage report
```

**Test Coverage:**
- Register Component (5 tests)
- Login Component (4 tests)
- SweetCard Component (5 tests)
- SweetList Component (4 tests)
- SearchBar Component (4 tests)
- AddSweet Component (4 tests)
- UpdateSweet Component (6 tests)

## 🔄 TDD Approach

This project strictly follows the **RED-GREEN-REFACTOR** cycle:

### 1. 🔴 RED - Write Failing Test
```bash
git commit -m "test: add failing test for user registration validation"
```

### 2. 🟢 GREEN - Make Test Pass
```bash
git commit -m "feat: add validation middleware for user registration"
```

### 3. 🔵 REFACTOR - Improve Code
```bash
git commit -m "refactor: extract validation rules to dedicated module"
```

### Commit Message Format
```
<type>: <description>

[Optional body]

Co-authored-by: Cursor AI <cursor@users.noreply.github.com>
```

**Types:**
- `test:` - Adding or modifying tests
- `feat:` - Implementing new features
- `refactor:` - Code improvements
- `fix:` - Bug fixes
- `chore:` - Build config, dependencies

## 📊 Commit History

Total Commits: **46**

| Phase | Commits | Description |
|-------|---------|-------------|
| Setup | 3 | Backend, Frontend, Database |
| Auth | 10 | Registration & Login (TDD) |
| Sweets CRUD | 14 | Create, Read, Update, Delete (TDD) |
| Inventory | 6 | Purchase & Restock (TDD) |
| Frontend | 13 | All components (TDD) |

### Key Statistics
- Backend Tests: 47 passing
- Frontend Tests: 32 passing
- Total Tests: **79 passing**
- Test Coverage: 80%+

## 👥 Contributors

- Developer with AI assistance
- Co-authored-by: Cursor AI

## 📄 License

This project is for educational/assessment purposes.

---

Built with ❤️ following Test-Driven Development principles

