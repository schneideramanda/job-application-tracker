import { JobApplication, Column } from '../models';

export async function getJobById(id: string) {
  return JobApplication.findById(id);
}

export async function getJobsInColumn(columnId: string, options: { excludeId?: string } = {}) {
  const query: Record<string, unknown> = { columnId };
  if (options.excludeId) query._id = { $ne: options.excludeId };
  return JobApplication.find(query).sort({ order: 1 }).lean();
}

export async function getMaxOrderInColumn(columnId: string) {
  return JobApplication.findOne({ columnId })
    .sort({ order: -1 })
    .select('order')
    .lean() as Promise<{ order: number } | null>;
}

export async function createJob(data: Record<string, unknown>) {
  return JobApplication.create(data);
}

export async function updateJobById(id: string, updates: Record<string, unknown>) {
  return JobApplication.findByIdAndUpdate(id, updates, { new: true });
}

export async function removeJobById(jobId: string, columnId: string) {
  await Column.findByIdAndUpdate(columnId, {
    $pull: { jobApplications: jobId },
  });

  await JobApplication.deleteOne({ _id: jobId });
}

export async function shiftJobOrdersUp(jobs: { _id: unknown; order: number }[]) {
  if (!jobs.length) return;
  await JobApplication.bulkWrite(
    jobs.map(job => ({
      updateOne: {
        filter: { _id: job._id },
        update: { $set: { order: job.order + 100 } },
      },
    })),
  );
}

export async function shiftJobOrdersDown(jobs: { _id: unknown; order: number }[]) {
  if (!jobs.length) return;
  await JobApplication.bulkWrite(
    jobs.map(job => ({
      updateOne: {
        filter: { _id: job._id },
        update: { $set: { order: Math.max(0, job.order - 100) } },
      },
    })),
  );
}

export async function addJobToColumn(columnId: string, jobId: string) {
  return Column.findByIdAndUpdate(columnId, { $push: { jobApplications: jobId } });
}

export async function removeJobFromColumn(columnId: string, jobId: string) {
  return Column.findByIdAndUpdate(columnId, { $pull: { jobApplications: jobId } });
}
