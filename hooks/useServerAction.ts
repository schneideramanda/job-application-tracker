import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { toast } from 'sonner';

type ServerActionResult<TData> = { data?: TData; error?: string };

type UseServerActionOptions<TInput, TData> = {
  onSuccess?: (data: TData, variables: TInput) => void;
  onError?: (error: string) => void;
  successMessage?: string;
  queryKey?: QueryKey; // if provided, invalidates this query on success
};

export function useServerAction<TInput, TData>(
  action: (input: TInput) => Promise<ServerActionResult<TData>>,
  options?: UseServerActionOptions<TInput, TData>,
) {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TInput>({
    mutationFn: async (input: TInput) => {
      const result = await action(input);
      if (result.error) throw new Error(result.error);
      return result.data as TData;
    },
    onSuccess: (data, variables) => {
      if (options?.successMessage) toast.success(options.successMessage);
      if (options?.queryKey) queryClient.invalidateQueries({ queryKey: options.queryKey });
      options?.onSuccess?.(data, variables);
    },
    onError: error => {
      const message = error.message ?? 'Unexpected error occurred';
      toast.error(message);
      options?.onError?.(message);
    },
  });
}
