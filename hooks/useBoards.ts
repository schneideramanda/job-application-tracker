'use client';

import { updateJobApplication } from '@/lib/actions/job-applications.actions';
import { applyJobMove } from '@/lib/dnd';
import { Board, Column, JobApplication } from '@/lib/models/models.types';
import { useState } from 'react';

interface UseBoardsReturn {
  board: Board | null;
  columns: Column[];
  moveJob: (jobApplicationId: string, newColumnId: string, newOrder: number) => void;
}

export const useBoards = (initialBoard?: Board | null): UseBoardsReturn => {
  const [board, setBoard] = useState<Board | null>(initialBoard || null);
  const [columns, setColumns] = useState<Column[]>(initialBoard?.columns || []);

  // Keep a ref if initialBoard changes so that we can have the updates
  const [prevBoard, setPrevBoard] = useState(initialBoard);
  if (prevBoard !== initialBoard) {
    setPrevBoard(initialBoard);
    setBoard(initialBoard ?? null);
    setColumns(initialBoard?.columns || []);
  }

  async function moveJob(jobApplicationId: string, newColumnId: string, newOrder: number) {
    setColumns(prev => applyJobMove(prev, jobApplicationId, newColumnId, newOrder));

    try {
      await updateJobApplication(jobApplicationId, { columnId: newColumnId, order: newOrder });
    } catch (err) {
      console.error('Failed to move job:', err);
    }
  }

  return {
    board,
    columns,
    moveJob,
  };
};
