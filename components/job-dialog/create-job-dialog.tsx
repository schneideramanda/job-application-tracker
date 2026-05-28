import { PlusIcon } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { initialValues, JobDialogForm, jobDialogSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { createJobApplication } from '@/lib/actions/job-applications';
import { useServerAction } from '@/hooks/use-server-action';

interface CreateJobApplicationDialogProps {
  columnId: string;
  boardId: string;
}

export default function CreateJobApplicationDialog({
  columnId,
  boardId,
}: CreateJobApplicationDialogProps) {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<JobDialogForm>({
    resolver: zodResolver(jobDialogSchema),
    defaultValues: initialValues,
  });

  const { mutate: createApplication, isPending } = useServerAction(createJobApplication, {
    successMessage: 'Job application added!',
    onSuccess: () => {
      form.reset();
      setOpen(false);
    },
  });

  const onSubmit = (data: JobDialogForm) => {
    createApplication({
      ...data,
      columnId,
      boardId,
      tags: data.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full mb-4 justify-start text-muted-foreground border-dashed border-2 hover:border-solid hover:bg-muted/50"
          onClick={() => {
            form.reset();
            setOpen(true);
          }}>
          <PlusIcon className="h-4 w-4" />
          Add Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Job Application</DialogTitle>
          <DialogDescription>Track a new job application</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="company"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="company">Company *</FieldLabel>
                    <Input {...field} id="company" aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="position"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="position">Position *</FieldLabel>
                    <Input {...field} id="position" aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="location"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="location">Location</FieldLabel>
                    <Input {...field} id="location" aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="salary"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="salary">Salary</FieldLabel>
                    <Input
                      {...field}
                      id="salary"
                      placeholder="e.g. $100k - $150k"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
            <Controller
              name="jobUrl"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="jobUrl">Job Url</FieldLabel>
                  <Input
                    {...field}
                    id="jobUrl"
                    placeholder="https://..."
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="tags"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="tags">Tags (comma-separated)</FieldLabel>
                  <Input
                    {...field}
                    id="tags"
                    placeholder="React, Tailwind, High Pay"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea
                    {...field}
                    id="description"
                    rows={3}
                    placeholder="Brief description of the role"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="notes"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="notes">Notes</FieldLabel>
                  <Textarea {...field} id="notes" rows={3} aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!form.formState.isValid || isPending}>
              {isPending ? 'Adding Application...' : 'Add Application'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
