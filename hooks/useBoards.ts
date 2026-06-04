'use client';

import { Board, Column } from '@/lib/models/models.types';
import { useState } from 'react';

interface UseBoardsReturn {
  board: Board | null;
  columns: Column[];
  error: string | null;
  moveJob: (jobApplicationId: string, newColumnId: string, newOrder: number) => void;
}

export const useBoards = (initialBoard?: Board | null): UseBoardsReturn => {
  const [boardOverride, setBoardOverride] = useState<Board | null>(null);
  const [columnsOverride, setColumnsOverride] = useState<Column[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const board = boardOverride ?? initialBoard ?? null;
  const columns = columnsOverride ?? initialBoard?.columns ?? [];

  async function moveJob(jobApplicationId: string, newColumnId: string, newOrder: number) {}

  return {
    board,
    columns,
    error,
    moveJob,
  };
};
