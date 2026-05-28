import { z } from 'zod';

export const initialValues: JobDialogForm = {
  company: '',
  position: '',
  location: '',
  notes: '',
  salary: '',
  jobUrl: '',
  tags: '',
  description: '',
};

export const jobDialogSchema = z.object({
  company: z.string().min(1, { message: 'Company is required' }),
  position: z.string().min(1, { message: 'Position is required' }),
  location: z.string(),
  notes: z.string(),
  salary: z.string(),
  jobUrl: z.string(),
  tags: z.string(),
  description: z.string(),
});

export type JobDialogForm = z.infer<typeof jobDialogSchema>;
