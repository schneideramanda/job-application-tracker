import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useState } from 'react';
import { useBoards } from './useBoards';
import { Board, Column } from '@/lib/models/models.types';
import { sortByOrder } from '@/lib/utils';
import { resolveDragEnd } from '@/lib/dnd';

interface UseKanbanBoardReturn {
  activeId: string | null;
  sortedColumns: Column[];
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
}

export const useKanbanBoard = (board: Board): UseKanbanBoardReturn => {
  const { columns, moveJob } = useBoards(board);

  const [activeId, setActiveId] = useState<string | null>(null);

  const sortedColumns = sortByOrder(columns);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);

    const resolved = resolveDragEnd(event, sortedColumns, board._id);
    if (!resolved) return;

    await moveJob(resolved.activeId, resolved.target.columnId, resolved.target.newOrder);
  }

  return { activeId, sortedColumns, handleDragStart, handleDragEnd };
};
