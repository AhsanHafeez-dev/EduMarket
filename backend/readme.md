**Course Platform Backend Documentation**

## 1. Project Overview

This repository implements the backend API for an online course platform. Instructors can create and manage courses, lectures, and media assets; students can browse courses, enroll, make purchases, and track their progress.

Key features:

- **User Authentication & Authorization** (register, login, JWT-based sessions)
- **Course Management** (create, update, retrieve courses)
- **Lecture & Media Handling** (video uploads via Cloudinary with single/bulk endpoints)
- **Purchases & Orders** (Stripe integration for payments)
- **Progress Tracking** (per-course and per-lecture progress for students)

## 2. Tech Stack

- **Frontend**: Next.js
- **Backend**: Node.js + Express
- **ORM**: Prisma Client (JavaScript)
- **Database**: Supabase (PostgreSQL)
- **Database**: Supabase (PostgreSQL)
- **File Storage**: Cloudinary
- **Authentication**: JSON Web Tokens (JWT)
- **Payments**: Stripe

## 3. Getting Started

### 3.1 Prerequisites

- Node.js v18+ and npm
- a Supabase project (PostgreSQL database)
- Cloudinary account
- and/or Stripe credentials (optional)

### 3.2 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/AhsanHafeez-dev/EduMarket.git
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**
   Create a `.env` file in the project root with the following variables:

   ```ini
   # Supabase (PostgreSQL) connection pooling
   DATABASE_URL="your_supabase_connection_string"

   # Direct DB connection (for migrations)
   DIRECT_URL="your_supabase_connection_string"

   CLIENT_URL="*"
   ACCESS_TOKEN_SECRET="chaiAurCode"
   ACCESS_TOKEN_EXPIRY="1d"
   REFRESH_TOKEN_SECRET="chaiAurCode"
   REFRESH_TOKEN_EXPIRY="10d"

   CLOUDINARY_CLOUD_NAME="<cloud_name>"
   CLOUDINARY_API_KEY="<api_key>"
   CLOUDINARY_API_SECRET="<api_secret>"
   HASH_ROUNDS=10

   STRIPE_SECRET_KEY="<your_stripe_secret_key>"
   ```

4. **Run Database Migrations**

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start in Development Mode**

   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3000` by default.

## 4. API Routes

All endpoints are prefixed by the base URL where the server is mounted (e.g., `http://localhost:3000`).

### 4.1 Authentication (`/auth`)

| Method | Path               | Middleware     | Handler        | Description                                    |
| ------ | ------------------ | -------------- | -------------- | ---------------------------------------------- |
| POST   | `/auth/register`   | —              | `registerUser` | Register a new user                            |
| POST   | `/auth/login`      | —              | `loginUser`    | Authenticate and issue access & refresh tokens |
| GET    | `/auth/check-auth` | `authenticate` | Inline         | Verify JWT and return authenticated user       |
| POST   | `/auth/logout`     | `authenticate` | `logoutUser`   | Invalidate the refresh token                   |

### 4.2 Media Management (`/media`)

| Method | Path                 | Handler / Middleware        | Description                                 |
| ------ | -------------------- | --------------------------- | ------------------------------------------- |
| POST   | `/media/upload`      | `upload.single('file')`     | Upload a single media file to Cloudinary    |
| DELETE | `/media/delete/:id`  | —                           | Delete an asset by its Cloudinary public ID |
| POST   | `/media/bulk-upload` | `upload.array('files', 10)` | Bulk upload up to 10 files to Cloudinary    |

### 4.3 Instructor Course Management (`/instructor/course`)

| Method | Path                                 | Handler            | Description                       |
| ------ | ------------------------------------ | ------------------ | --------------------------------- |
| POST   | `/instructor/course/add`             | `addNewCourse`     | Create a new course               |
| GET    | `/instructor/course/get`             | `getAllCourses`    | List all courses by instructor    |
| GET    | `/instructor/course/get/details/:id` | `getCourseDetails` | Get details for a specific course |
| PUT    | `/instructor/course/update/:id`      | `updateCourseById` | Update course metadata            |

### 4.4 Student Course Viewing (`/student/course`)

| Method | Path                                           | Handler                       | Description                        |
| ------ | ---------------------------------------------- | ----------------------------- | ---------------------------------- |
| GET    | `/student/course/get`                          | `getAllStudentViewCourses`    | List all published courses         |
| GET    | `/student/course/get/details/:id`              | `getStudentViewCourseDetails` | Get course + lecture details by ID |
| GET    | `/student/course/purchase-info/:id/:studentId` | `checkCoursePurchaseInfo`     | Check if student already purchased |

### 4.5 Student Orders (`/student/order`)

| Method | Path                    | Handler       | Description                         |
| ------ | ----------------------- | ------------- | ----------------------------------- |
| POST   | `/student/order/create` | `createOrder` | Create a new order (pay via Stripe) |

### 4.6 Student’s Purchased Courses (`/student/courses-bought`)

| Method | Path                                     | Handler                 | Description                       |
| ------ | ---------------------------------------- | ----------------------- | --------------------------------- |
| GET    | `/student/courses-bought/get/:studentId` | `getCoursesByStudentId` | List courses a student has bought |

### 4.7 Course Progress Tracking (`/student/course-progress`)

| Method | Path                                             | Handler                      | Description                            |
| ------ | ------------------------------------------------ | ---------------------------- | -------------------------------------- |
| GET    | `/student/course-progress/get/:userId/:courseId` | `getCurrentCourseProgress`   | Retrieve overall progress for a course |
| POST   | `/student/course-progress/mark-lecture-viewed`   | `markCurrentLectureAsViewed` | Mark a lecture as viewed               |
| POST   | `/student/course-progress/reset-progress`        | `resetCurrentCourseProgress` | Reset progress for a course            |

## 5. Additional Notes

- **Error Handling**: Use global error middleware to catch `ApiError` instances and return consistent JSON responses.
- **CORS**: Enable CORS with appropriate `CLIENT_URL` origins.
- **Logging**: Integrate `morgan` or similar for request logging (optional).
- **Testing**: Consider adding Jest or Mocha for unit/integration tests.
- **Deployment**: Dockerize with a `Dockerfile` and manage migrations in CI/CD pipelines.

---

_Generated on May 10, 2025_
