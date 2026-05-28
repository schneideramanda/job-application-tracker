'use server';

import { getSession } from '../auth/auth';
import connectDB from '../db';
import { Board, Column, JobApplication } from '../models';
import { normalizeDBEntry } from '../utils';

interface JobApplicationData {
  company: string;
  position: string;
  location?: string;
  salary?: string;
  jobUrl?: string;
  tags?: string[];
  description?: string;
  notes?: string;
  columnId: string;
  boardId: string;
}

export async function createJobApplication(data: JobApplicationData) {
  const session = await getSession();
  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  await connectDB();

  const { company, position, columnId, boardId, ...rest } = data;
  if (!company || !position || !columnId || !boardId) return { error: 'Missing required fields' };

  // Verify board ownership
  const board = await Board.findOne({
    _id: boardId,
    userId: session.user.id,
  });
  if (!board) return { error: 'Board not found' };

  // Verify column belongs to board
  const column = await Column.findOne({
    _id: columnId,
    boardId: boardId,
  });
  if (!column) return { error: 'Column not found' };

  const maxOrder = (await JobApplication.findOne({ columnId })
    .sort({ order: -1 })
    .select('order')
    .lean()) as { order: number } | null;

  const jobApplication = await JobApplication.create({
    ...rest,
    company,
    position,
    columnId,
    boardId,
    userId: session.user.id,
    status: 'applied',
    order: maxOrder ? maxOrder.order + 1 : 0,
    tags: rest.tags ?? [],
  });

  await Column.findByIdAndUpdate(columnId, {
    $push: { jobApplications: jobApplication._id },
  });

  return { data: normalizeDBEntry(jobApplication) };
}
