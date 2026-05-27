import { signIn } from '@/lib/auth/auth-client';
import { useMutation } from '@tanstack/react-query';
import { SignInForm } from './schema';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useSignInMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: SignInForm) => {
      const { email, password } = data;
      const result = await signIn.email({ email, password });

      if (result.error) throw new Error(result.error.message ?? 'Unexpected error occurred');
      return result.data;
    },
    onSuccess: () => router.push('/dashboard'),
    onError: (error: Error) => toast.error(error.message),
  });
};
