import { Column, JobApplication } from '@/lib/models/models.types';
import JobApplicationCard from './job-application-card';

interface SortableJobCardProps {
  job: JobApplication;
  columns: Column[];
}

export default function SortableJobCard({ job, columns }: SortableJobCardProps) {
  return (
    <div>
      <JobApplicationCard job={job} columns={columns} />
    </div>
  );
}
