/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

  // feed
  infiniteFeed: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { limit = 20, cursor }, ctx }) => {
      const currentUserId = ctx.session?.user.id;

      const feed = await ctx.prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: {
          id: true,
          content: true,
          createdAt: true,
          _count: { select: { likes: true } },
          likes:
            currentUserId == null
              ? false
              : { where: { userId: currentUserId } },
          user: {
            select: { name: true, id: true, image: true },
          },
        },
      });

      let nextCursor: typeof cursor | undefined
        if (feed.length > limit) {
          const nextItem = feed.pop()
          if (nextItem != null) {
          nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt, }
          }
        }

      return {posts: feed.map((post) => {
        return {
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,
        likeCount: post._count.likes,
        user: post.user,
        likedByMe: post.likes?.length > 0,
      };
      }), nextCursor}
    }),

  // crating post
  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input: { content }, ctx }) => {
      return await ctx.prisma.post.create({
        data: { content, userId: ctx.session.user.id },
      });
    }),
});
