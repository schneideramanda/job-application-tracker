'use client';

import { Board } from '@/lib/models/models.types';
import { AwardIcon, CalendarIcon, CheckCircle2Icon, MicIcon, XCircleIcon } from 'lucide-react';
import { ReactNode } from 'react';
import DroppableColumn from './droppable-column';
import { useBoards } from '@/hooks/useBoards';

interface KanbanBoardProps {
  board: Board;
  userId: string;
}

export interface ColConfig {
  color: string;
  icon: ReactNode;
}

const COLUMN_CONFIG: Array<ColConfig> = [
  {
    color: 'bg-cyan-500',
    icon: <CalendarIcon className="h-4 w-4" />,
  },
  {
    color: 'bg-purple-500',
    icon: <CheckCircle2Icon className="h-4 w-4" />,
  },
  {
    color: 'bg-green-500',
    icon: <MicIcon className="h-4 w-4" />,
  },
  {
    color: 'bg-yellow-500',
    icon: <AwardIcon className="h-4 w-4" />,
  },
  {
    color: 'bg-red-500',
    icon: <XCircleIcon className="h-4 w-4" />,
  },
];

export default function KanbanBoard({ board, userId }: KanbanBoardProps) {
  const { columns, moveJob } = useBoards(board);

  const sortedColumns = columns?.sort((a, b) => a.order - b.order) || [];

  return (
    <div>
      <div>
        {columns.map((col, key) => {
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
  );
}
