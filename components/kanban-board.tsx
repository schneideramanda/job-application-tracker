'use client';

import { Board } from '@/lib/models/models.types';
import DroppableColumn from './droppable-column';
import {
  closestCorners,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';
import { COLUMN_CONFIG } from '@/constants/columns';
import { useId } from 'react';
import JobApplicationCard from './job-application-card';

interface KanbanBoardProps {
  board: Board;
  userId: string;
}

export default function KanbanBoard({ board, userId }: KanbanBoardProps) {
  const { activeId, sortedColumns, handleDragStart, handleDragEnd } = useKanbanBoard(board);
  const id = useId();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const activeJob = sortedColumns
    .flatMap(col => col.jobApplications || [])
    .find(job => job._id === activeId);

  return (
    <DndContext
      id={id}
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}>
      <div className="space-y-4">
        <div className="flex gap-4 pb-4 overflow-x-auto">
          {sortedColumns.map((col, key) => {
            const config = COLUMN_CONFIG[key] || COLUMN_CONFIG[0];

            return (
              <DroppableColumn
                key={key}
                column={col}
                config={config}
                boardId={board._id}
                sortedColumns={sortedColumns}
              />
            );
          })}
        </div>
      </div>
      <DragOverlay>
        {activeJob ? (
          <div className="opacity-50">
            <JobApplicationCard job={activeJob} columns={sortedColumns} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
