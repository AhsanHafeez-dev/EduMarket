# LMS MANAGEMENT DBMS PROJECT

## Group Memeber

<ul>
<li>Ahsan</li>
<li>Subhan</li>
<li>Junaid</li>
<li>Daniyal</li>
<li>Aliyan</li>
</ul>



**Course Platform Documentation**

## 1. Project Overview

This repository consists of two main parts:

* **Frontend**: A Next.js application where students and instructors interact with the course platform.
* **Backend**: A Node.js + Express API that handles authentication, course management, media uploads, payments, and progress tracking.

Key features include:

* **User Authentication & Authorization** (JWT-based)
* **Course & Lecture Management**
* **Media Uploads** (Cloudinary single & bulk)
* **Payments** (Stripe)
* **Enrollment & Orders**
* **Progress Tracking**

## 2. Tech Stack

* **Frontend**: Next.js (React)
* **Backend**: Node.js + Express
* **ORM**: Prisma Client (JavaScript)
* **Database**: Supabase (PostgreSQL)
* **File Storage**: Cloudinary
* **Authentication**: JSON Web Tokens (JWT)
* **Payments**: Stripe
* **Environment Management**: dotenv

## 3. Getting Started

### 3.1 Prerequisites

* Node.js v18+ and npm (or yarn)
* Supabase project (PostgreSQL)
* Cloudinary account
* Stripe credentials

### 3.2 Common Setup

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd <project-root>
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Create `.env` file**

   ```ini
   # Backend
   DATABASE_URL="<your_supabase_connection_string>"
   DIRECT_URL="<your_supabase_connection_string>"
   CLIENT_URL="*"
   ACCESS_TOKEN_SECRET="chaiAurCode"
   ACCESS_TOKEN_EXPIRY="1d"
   REFRESH_TOKEN_SECRET="chaiAurCode"
   REFRESH_TOKEN_EXPIRY="10d"
   CLOUDINARY_CLOUD_NAME="<cloud_name>"
   CLOUDINARY_API_KEY="<api_key>"
   CLOUDINARY_API_SECRET="<api_secret>"
   HASH_ROUNDS=10
   STRIPE_SECRET_KEY="<stripe_secret>"

   # Frontend
   NEXT_PUBLIC_API_BASE_URL="http://localhost:3000"
   ```

## 4. Running the Project

### 4.1 Backend

1. **Run migrations**

   ```bash
   npx prisma migrate dev --name init
   ```
2. **Start server**

   ```bash
   npm run dev
   ```

   Backend listens on `http://localhost:3000`.

### 4.2 Frontend

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Run development server**

   ```bash
   npm run dev
   ```

   Frontend runs on `http://localhost:3001` (or as configured).

## 5. API Routes

### 5.1 Authentication (`/auth`)

| Method | Path               | Middleware     | Handler        | Description                          |
| ------ | ------------------ | -------------- | -------------- | ------------------------------------ |
| POST   | `/auth/register`   | —              | `registerUser` | Register a new user                  |
| POST   | `/auth/login`      | —              | `loginUser`    | Login & issue JWT tokens             |
| GET    | `/auth/check-auth` | `authenticate` | (inline)       | Validate token & return user details |
| POST   | `/auth/logout`     | `authenticate` | `logoutUser`   | Invalidate refresh token             |

### 5.2 Media (`/media`)

| Method | Path                 | Middleware        | Description                      |
| ------ | -------------------- | ----------------- | -------------------------------- |
| POST   | `/media/upload`      | `upload.single()` | Upload single file to Cloudinary |
| DELETE | `/media/delete/:id`  | —                 | Remove file by public ID         |
| POST   | `/media/bulk-upload` | `upload.array()`  | Bulk upload up to 10 files       |

### 5.3 Instructor Courses (`/instructor/course`)

| Method | Path                                 | Description                   |
| ------ | ------------------------------------ | ----------------------------- |
| POST   | `/instructor/course/add`             | Create a new course           |
| GET    | `/instructor/course/get`             | Get all courses by instructor |
| GET    | `/instructor/course/get/details/:id` | Get course details            |
| PUT    | `/instructor/course/update/:id`      | Update course by ID           |

### 5.4 Student Courses (`/student/course`)

| Method | Path                                           | Description                 |
| ------ | ---------------------------------------------- | --------------------------- |
| GET    | `/student/course/get`                          | List published courses      |
| GET    | `/student/course/get/details/:id`              | Get course & lectures by ID |
| GET    | `/student/course/purchase-info/:id/:studentId` | Check purchase status       |

### 5.5 Orders (`/student/order`)

| Method | Path                    | Description                    |
| ------ | ----------------------- | ------------------------------ |
| POST   | `/student/order/create` | Create order & process payment |

### 5.6 Purchased Courses (`/student/courses-bought`)

| Method | Path                                     | Description                       |
| ------ | ---------------------------------------- | --------------------------------- |
| GET    | `/student/courses-bought/get/:studentId` | List courses a student has bought |

### 5.7 Progress (`/student/course-progress`)

| Method | Path                                             | Description                       |
| ------ | ------------------------------------------------ | --------------------------------- |
| GET    | `/student/course-progress/get/:userId/:courseId` | Get course progress for a student |
| POST   | `/student/course-progress/mark-lecture-viewed`   | Mark a lecture as viewed          |
| POST   | `/student/course-progress/reset-progress`        | Reset course progress             |

## 6. Additional Considerations

* **Error Handling**: Centralized middleware for `ApiError` objects.
* **CORS**: Configure allowed origins via `CLIENT_URL` / `NEXT_PUBLIC_API_BASE_URL`.
* **Logging**: Optionally add `morgan` for HTTP request logging.
* **Testing**: Integrate Jest or Mocha for unit/integration tests.
* **Deployment**:

  * Dockerize both services with `Dockerfile` and `docker-compose`.
  

---


