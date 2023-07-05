import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const postsRouter = createTRPCRouter({

 /* getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),*/

  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input: {content }, ctx}) => {
      return await ctx.prisma.post.create({ data: {content, userId: ctx.session.user.id}, })
    })
});
