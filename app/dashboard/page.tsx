import KanbanBoard from '@/components/kanban-board';
import { getSession } from '@/lib/auth/auth';
import connectDB from '@/lib/db';
import { Board } from '@/lib/models';
import { normalizeDBEntry } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

/**
 * With this function we can have the request cached without passing it to the entire component
 */
async function getBoard(userId: string) {
  'use cache';
  await connectDB();

  const boardDoc = await Board.findOne({ userId, name: 'Job Hunt' }).populate({
    path: 'columns',
    populate: {
      path: 'jobApplications',
    },
  });

  if (!boardDoc) return null;

  return normalizeDBEntry(boardDoc);
}

async function Dashboard() {
  const session = await getSession();
  const board = await getBoard(session?.user.id ?? '');

  if (!session?.user) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{board.name}</h1>
          <p className="text-muted-foreground">Track your job applications</p>
        </div>
        <KanbanBoard board={board} userId={session.user.id} />
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Dashboard />
    </Suspense>
  );
}
