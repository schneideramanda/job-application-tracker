'use client';

import { Column } from '@/lib/models/models.types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { MoreVerticalIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import CreateJobApplicationDialog from './job-dialog/create-job-dialog';
import SortableJobCard from './sortable-job-card';
import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { sortByOrder } from '@/lib/utils';
import { ColConfig } from '@/constants/columns';

interface DroppableColumnProps {
  column: Column;
  config: ColConfig;
  boardId: string;
  sortedColumns: Column[];
}

export default function DroppableColumn({
  column,
  config,
  boardId,
  sortedColumns,
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column._id,
    data: {
      type: 'column',
      columnId: column._id,
    },
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const sortedJobs = sortByOrder(column.jobApplications);

  return (
    <Card className="min-w-75 shrink-0 shadow-md gap-0 p-0">
      <CardHeader className={`${config.color} rounded-t-lg pb-3 pt-3 text-white`}>
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
      <CardContent
        ref={setNodeRef}
        className={`space-y-2 pt-4 bg-secondary min-h-100 ${isOver ? 'ring-2 ring-blue-500' : ''}`}>
        {sortedJobs.map((job, key) => (
          <SortableContext
            key={key}
            items={sortedJobs.map(job => job._id)}
            strategy={verticalListSortingStrategy}>
            <SortableJobCard
              job={{ ...job, columnId: job.columnId || column._id }}
              columns={sortedColumns}
            />
          </SortableContext>
        ))}

        <Button
          variant="outline"
          className="mb-4 justify-start text-muted-foreground border-dashed border-2 hover:border-solid hover:bg-muted/50"
          onClick={() => setDialogOpen(true)}>
          <PlusIcon className="h-4 w-4" />
          Add Job
        </Button>
        <CreateJobApplicationDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          columnId={column._id}
          boardId={boardId}
        />
      </CardContent>
    </Card>
  );
}
