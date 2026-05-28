import KanbanBoard from '@/components/kanban-board';
import { getSession } from '@/lib/auth/auth';
import connectDB from '@/lib/db';
import { Board } from '@/lib/models';
import { normalizeDBEntry } from '@/lib/utils';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect('/sign-in');
  }

  await connectDB();
  const board = await Board.findOne({ userId: session.user.id, name: 'Job Hunt' }).populate({
    path: 'columns',
    populate: {
      path: 'jobApplications',
    },
  });

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{board.name}</h1>
          <p className="text-muted-foreground">Track your job applications</p>
        </div>
        <KanbanBoard board={normalizeDBEntry(board)} userId={session.user.id} />
      </div>
    </div>
  );
}
