import { DragEndEvent } from '@dnd-kit/core';
import { Column, JobApplication } from '@/lib/models/models.types';
import { sortByOrder } from './utils';

export interface DragSource {
  job: JobApplication;
  column: Column;
  index: number;
}

export interface DropTarget {
  columnId: string;
  newOrder: number;
}

export function findDragSource(columns: Column[], jobId: string): DragSource | null {
  for (const column of columns) {
    const jobs = sortByOrder(column.jobApplications);
    const index = jobs.findIndex(j => j._id === jobId);

    if (index !== -1) return { job: jobs[index], column, index };
  }

  return null;
}

export function resolveDropTarget(
  columns: Column[],
  overId: string,
  source: DragSource,
  activeId: string,
): DropTarget | null {
  const targetColumn = columns.find(col => col._id === overId);
  if (targetColumn) return resolveDropOnColumn(targetColumn, activeId);

  const targetJob = columns.flatMap(col => col.jobApplications).find(job => job._id === overId);
  if (targetJob) return resolveDropOnJob(columns, targetJob, source, activeId);

  return null;
}

function resolveDropOnColumn(targetColumn: Column, activeId: string): DropTarget {
  const jobs = sortByOrder(targetColumn.jobApplications).filter(j => j._id !== activeId);

  return { columnId: targetColumn._id, newOrder: jobs.length };
}

function resolveDropOnJob(
  columns: Column[],
  targetJob: JobApplication,
  source: DragSource,
  activeId: string,
): DropTarget | null {
  const targetColumnId =
    targetJob.columnId ??
    columns.find(col => col.jobApplications.some(j => j._id === targetJob._id))?._id;

  if (!targetColumnId) return null;

  const targetColumn = columns.find(col => col._id === targetColumnId);
  if (!targetColumn) return null;

  const sortedJobs = sortByOrder(targetColumn.jobApplications);
  const filteredJobs = sortedJobs.filter(j => j._id !== activeId);

  const indexInSorted = sortedJobs.findIndex(j => j._id === targetJob._id);
  const indexInFiltered = filteredJobs.findIndex(j => j._id === targetJob._id);

  if (indexInFiltered === -1) return { columnId: targetColumnId, newOrder: filteredJobs.length };

  const isMovingDownWithinColumn =
    source.column._id === targetColumnId && source.index < indexInSorted;

  return {
    columnId: targetColumnId,
    newOrder: isMovingDownWithinColumn ? indexInFiltered + 1 : indexInFiltered,
  };
}

export function resolveDragEnd(
  event: DragEndEvent,
  columns: Column[],
  boardId: string,
): { activeId: string; target: DropTarget } | null {
  const { active, over } = event;

  if (!over || !boardId) return null;

  const activeId = active.id as string;
  const overId = over.id as string;

  const source = findDragSource(columns, activeId);
  if (!source) return null;

  const target = resolveDropTarget(columns, overId, source, activeId);
  if (!target) return null;

  return { activeId, target };
}

export function applyJobMove(
  columns: Column[],
  jobId: string,
  newColumnId: string,
  newOrder: number,
): Column[] {
  const cloned = columns.map(col => ({
    ...col,
    jobApplications: [...col.jobApplications],
  }));

  const sourceColumn = cloned.find(col => col.jobApplications.some(j => j._id === jobId));
  if (!sourceColumn) return columns;

  const job = sourceColumn.jobApplications.find(j => j._id === jobId);
  if (!job) return columns;

  sourceColumn.jobApplications = sourceColumn.jobApplications.filter(j => j._id !== jobId);

  const targetColumn = cloned.find(col => col._id === newColumnId);
  if (!targetColumn) return columns;

  targetColumn.jobApplications.splice(newOrder, 0, {
    ...job,
    columnId: newColumnId,
    order: newOrder * 100,
  });

  targetColumn.jobApplications = targetColumn.jobApplications.map((j, idx) => ({
    ...j,
    order: idx * 100,
  }));

  return cloned;
}
