import { getSession } from './auth';
import { AppError } from '../errors';

export async function requireSession() {
  const session = await getSession();
  if (!session?.user) throw new AppError('Unauthorized', 401);
  return session;
}
