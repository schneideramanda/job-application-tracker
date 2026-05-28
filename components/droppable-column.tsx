'use client';

import { Column } from '@/lib/models/models.types';
import { ColConfig } from './kanban-board';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { MoreVerticalIcon, Trash2Icon } from 'lucide-react';
import CreateJobApplicationDialog from './job-dialog/create-job-dialog';

interface DroppableColumnProps {
  column: Column;
  config: ColConfig;
  boardId: string;
}

export default function DroppableColumn({ column, config, boardId }: DroppableColumnProps) {
  return (
    <Card className="min-w-75 shrink-0 shadow-md gap-0 p-0">
      <CardHeader className={`${config.color} rounded-t-lg pb-3 pt-3 text-secondary`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {config.icon}
            <CardTitle className="text-base font-semibold">{column.name}</CardTitle>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Trash2Icon />
                Delete Column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-4 bg-secondary min-h-100 rounded-b-lg">
        <CreateJobApplicationDialog columnId={column._id} boardId={boardId} />
      </CardContent>
    </Card>
  );
}
