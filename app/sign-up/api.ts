import { signUp } from '@/lib/auth/auth-client';
import { useMutation } from '@tanstack/react-query';
import { SignUpForm } from './schema';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useSignUpMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: SignUpForm) => {
      const { name, email, password } = data;
      const result = await signUp.email({ name, email, password });

      if (result.error) throw new Error(result.error.message ?? 'Unexpected error occurred');
      return result.data;
    },
    onSuccess: () => router.push('/dashboard'),
    onError: (error: Error) => toast.error(error.message),
  });
};
