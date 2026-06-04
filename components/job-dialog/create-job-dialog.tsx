import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { initialValues, JobDialogForm, jobDialogSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { Textarea } from '../ui/textarea';
import {
  createJobApplication,
  updateJobApplication,
  UpdateJobApplicationInput,
} from '@/lib/actions/job-applications.actions';
import { useServerAction } from '@/hooks/useServerAction';
import { formatFormTags } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

interface CreateJobApplicationDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  columnId: string;
  boardId?: string;
  jobId?: string;
  fieldValues?: JobDialogForm;
}

export default function CreateJobApplicationDialog({
  open,
  setOpen,
  columnId,
  boardId,
  jobId,
  fieldValues,
}: CreateJobApplicationDialogProps) {
  const isUpdate = !!fieldValues;

  const form = useForm<JobDialogForm>({
    resolver: zodResolver(jobDialogSchema),
    defaultValues: initialValues,
    mode: 'onChange',
  });

  const { mutate: createApplication, isPending: isCreationPending } = useServerAction(
    createJobApplication,
    {
      successMessage: 'Job application added!',
      onSuccess: () => {
        form.reset();
        setOpen(false);
      },
    },
  );

  const { mutate: updateApplication, isPending: isUpdatePending } = useServerAction(
    input => updateJobApplication(jobId ?? '', input as UpdateJobApplicationInput),
    {
      successMessage: 'Job application updated!',
      onSuccess: () => {
        form.reset();
        setOpen(false);
      },
    },
  );

  const isPending = isCreationPending || isUpdatePending;

  const onUpdate = (data: JobDialogForm) => {
    updateApplication({
      ...data,
      columnId,
      tags: formatFormTags(data.tags),
    });
  };

  const onSubmit = (data: JobDialogForm) => {
    createApplication({
      ...data,
      columnId,
      boardId: boardId ?? '',
      tags: formatFormTags(data.tags),
    });
  };

  useEffect(() => {
    if (fieldValues) {
      form.reset(fieldValues);
      form.trigger();
    }
  }, [fieldValues, form]);

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        if (!isOpen) form.reset();
        setOpen(isOpen);
      }}>
      <DialogContent className="sm:max-w-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>{`${isUpdate ? 'Update' : 'Add'} Job Application`}</DialogTitle>
          <DialogDescription>{`${isUpdate ? 'Update your job application' : 'Track a new job application'}`}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(data => (isUpdate ? onUpdate(data) : onSubmit(data)))}>
          <ScrollArea className="flex-1 h-[calc(100vh-20rem)] py-4">
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
          </ScrollArea>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setOpen(false);
              }}>
              Cancel
            </Button>
            <Button type="submit" disabled={!form.formState.isValid || isPending}>
              {isPending
                ? `${isUpdate ? 'Updating' : 'Adding'} Application...`
                : `${isUpdate ? 'Update' : 'Add'} Application`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
