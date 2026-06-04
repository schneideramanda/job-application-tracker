'use server';

import { revalidatePath } from 'next/cache';
import { requireSession } from '../auth/require-session';
import connectDB from '../db';
import { ActionResult, AppError, withActionHandler } from '../errors';
import { normalizeDBEntry } from '../utils';
import {
  createJobApplication as createJobApplicationService,
  updateJobApplication as updateJobApplicationService,
} from '../services/job-applications.service';

export interface CreateJobApplicationInput {
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

export interface UpdateJobApplicationInput {
  company?: string;
  position?: string;
  location?: string;
  salary?: string;
  jobUrl?: string;
  tags?: string[];
  description?: string;
  notes?: string;
  order?: number;
  columnId?: string;
}

export async function createJobApplication(
  input: CreateJobApplicationInput,
): Promise<ActionResult<ReturnType<typeof normalizeDBEntry>>> {
  return withActionHandler(async () => {
    const session = await requireSession();
    await connectDB();

    const job = await createJobApplicationService({ ...input, userId: session.user.id });

    revalidatePath('/dashboard');
    return normalizeDBEntry(job);
  });
}

export async function updateJobApplication(
  id: string,
  updates: UpdateJobApplicationInput,
): Promise<ActionResult<ReturnType<typeof normalizeDBEntry>>> {
  return withActionHandler(async () => {
    const session = await requireSession();
    await connectDB();

    const job = await updateJobApplicationService(id, updates);

    if (job.userId !== session.user.id) throw new AppError('Unauthorized', 401);

    revalidatePath('/dashboard');
    return normalizeDBEntry(job);
  });
}
