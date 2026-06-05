import { AppError } from '../errors';
import { Board, Column } from '../models';
import {
  addJobToColumn,
  createJob,
  getJobById,
  getJobsInColumn,
  getMaxOrderInColumn,
  removeJobById,
  removeJobFromColumn,
  shiftJobOrdersDown,
  shiftJobOrdersUp,
  updateJobById,
} from '../repositories/job-applications.repo';

interface CreateJobData {
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
  userId: string;
}

interface UpdateJobData {
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

export async function assertBoardOwnership(boardId: string, userId: string) {
  const board = await Board.findOne({ _id: boardId, userId });
  if (!board) throw new AppError('Board not found', 404);
}

export async function assertColumnBelongsToBoard(columnId: string, boardId: string) {
  const column = await Column.findOne({ _id: columnId, boardId });
  if (!column) throw new AppError('Column not found', 404);
}

export async function createJobApplication(data: CreateJobData) {
  const { company, position, columnId, boardId, userId, ...rest } = data;

  await assertBoardOwnership(boardId, userId);
  await assertColumnBelongsToBoard(columnId, boardId);

  const maxOrder = await getMaxOrderInColumn(columnId);
  const order = maxOrder ? maxOrder.order + 1 : 0;

  const job = await createJob({
    ...rest,
    company,
    position,
    columnId,
    boardId,
    userId,
    status: 'applied',
    order,
    tags: rest.tags ?? [],
  });

  await addJobToColumn(columnId, job._id.toString());

  return job;
}

export async function updateJobApplication(id: string, updates: UpdateJobData) {
  const job = await getJobById(id);
  if (!job) throw new AppError('Job application not found', 404);

  const { columnId, order, ...fields } = updates;
  const currentColumnId = job.columnId.toString();
  const isMovingColumns = !!columnId && columnId !== currentColumnId;

  const positionUpdates = isMovingColumns
    ? await resolveColumnMove(id, currentColumnId, columnId, order)
    : order !== undefined
      ? await resolveReorder(id, currentColumnId, job.order, order)
      : {};

  return updateJobById(id, { ...fields, ...positionUpdates });
}

export async function deleteJobApplication(jobId: string, columnId: string) {
  const job = await getJobById(jobId);
  if (!job) throw new AppError('Job application not found', 404);

  await removeJobById(jobId, columnId);

  return job;
}

async function resolveColumnMove(
  jobId: string,
  fromColumnId: string,
  toColumnId: string,
  targetIndex?: number,
) {
  await removeJobFromColumn(fromColumnId, jobId);

  const jobsInTarget = await getJobsInColumn(toColumnId, { excludeId: jobId });

  let newOrder: number;

  if (targetIndex !== undefined) {
    newOrder = targetIndex * 100;
    await shiftJobOrdersUp(jobsInTarget.slice(targetIndex));
  } else {
    const last = jobsInTarget.at(-1);
    newOrder = last ? last.order + 100 : 0;
  }

  await addJobToColumn(toColumnId, jobId);

  return { columnId: toColumnId, order: newOrder };
}

async function resolveReorder(
  jobId: string,
  columnId: string,
  currentOrder: number,
  newIndex: number,
) {
  const others = await getJobsInColumn(columnId, { excludeId: jobId });

  const oldIndex = others.findIndex(j => j.order > currentOrder);
  const resolvedOldIndex = oldIndex === -1 ? others.length : oldIndex;

  if (newIndex < resolvedOldIndex) {
    await shiftJobOrdersUp(others.slice(newIndex, resolvedOldIndex));
  } else if (newIndex > resolvedOldIndex) {
    await shiftJobOrdersDown(others.slice(resolvedOldIndex, newIndex));
  }

  return { order: newIndex * 100 };
}
