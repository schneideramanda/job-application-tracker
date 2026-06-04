# Job Application Tracker

A Fullstack job application tracking system built with NextJS, featuring a Kanban board interface
for managing your job search. Other functionalities include: authentication flow, drag-and-drop and
real-time updates.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Database**: MongoDB with Mongoose
- **Authentication**: Better Auth
- **Drag & Drop**: dnd-kit
- **UI Components**: Shadcn

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud)
- npm, yarn, pnpm, or bun

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser. <br> <br>
5. Creating mocked data (Optional):

```bash
npm run seed:jobs
```

## Project Structure

```
job-application-tracker/
├── app/                        # Next.js App Router pages
│   ├── api/                    # API routes
│   ├── dashboard/              # Main dashboard page
│   └── sign-in/                # Authentication pages
├── components/                 # React components
│   ├── ui/                     # Reusable UI components
│   └── kanban-board.tsx        # Main Kanban component
├── actions/                    # Layer 1 — Server actions
│   └── job-application.actions.ts
├── services/                   # Layer 2 — Business logic
│   └── job-application.service.ts
├── repositories/               # Layer 3 — Database access
│   └── job-application.repo.ts
├── lib/
│   ├── auth/
│   │   ├── auth.ts             # Authentication setup
│   │   └── require-session.ts  # Session guard used by actions
│   ├── models/                 # Mongoose models
│   ├── errors.ts               # AppError class
│   └── db.ts                   # Database connection
└── scripts/
    └── seed.ts                 # Database seeding
```
