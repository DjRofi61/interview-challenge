# Oxyera Full-Stack Challenge

## Project Overview
This project is a full-stack mini-app for managing patients, medications, and their treatment assignments for a digital health workflow. It features:
- A NestJS backend with a SQLite database
- A modern React/Next.js frontend (CSS only, no Tailwind)
- Full CRUD for patients, medications, and assignments
- Calculation of remaining treatment days
- Validation, error handling, and user-friendly UI

## How to Run the Project

### Backend (NestJS)
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm run start:dev
   ```
   The backend will run at [http://localhost:8080](http://localhost:8080)

### Frontend (Next.js)
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend server:
   ```bash
   npm run dev
   ```
   The frontend will run at [http://localhost:3000](http://localhost:3000)

## Running Unit Tests

The backend includes unit tests for the core calculation logic (e.g., remaining days for assignments).

To run all backend tests:
```bash
cd backend
npm install
npm run test
```

To run only the assignment calculation logic test:
```bash
npm run test assignment
```

You should see output like:
```
PASS  src/assignment/assignment.service.spec.ts
  AssignmentService
    ✓ should calculate remaining days correctly (future end date)
    ✓ should return 0 if treatment is finished
```

All test files are located in `backend/src/` and end with `.spec.ts`.

## Features Implemented
- CRUD for Patients, Medications, Assignments (Create, Read, Update, Delete)
- Assign medications to patients with start date and duration
- Calculation and display of remaining treatment days
- Input validation and error handling (with user-friendly messages)
- Modern, responsive UI (CSS only)
- Custom modals for delete confirmations and error explanations
- Toast notifications for feedback
- Navigation bar for easy access to all sections
- Unit tests for core calculation logic

## Special Notes
- You cannot delete a patient or medication if it is still referenced by assignments. The UI will show a clear message and link to manage assignments.
- All backend and frontend code is written in TypeScript.
- The SQLite database is located at `backend/database.sqlite`.
- For any questions, see the code comments or contact the author.

---

**Thank you for reviewing this challenge!**

