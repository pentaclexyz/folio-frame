import { publicProcedure, router } from './trpc';
import { getProjectById, getAllProjectsByFarcasterHandle } from '@lib/db/queries/pop';
import { z } from 'zod';

export const appRouter = router({
  getProjectById: publicProcedure.input(z.number()).query(async (opts) => {
    return getProjectById(opts.input);
  }),
  getAllProjectsByFarcasterHandle: publicProcedure.input(z.string()).query(async (opts) => {
    return getAllProjectsByFarcasterHandle(opts.input);
  }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
