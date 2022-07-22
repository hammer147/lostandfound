import { createRouter } from "./context"
import { z } from "zod"
import { TRPCError } from '@trpc/server'
import { Prisma } from '@prisma/client'

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultPostSelect = Prisma.validator<Prisma.PostSelect>()({
  id: true,
  title: true,
  text: true,
  createdAt: true,
  updatedAt: true,
})

export const postRouter = createRouter()
  // create
  .mutation('add', {
    input: z.object({
      title: z.string().min(1).max(32),
      text: z.string().min(1),
    }),
    async resolve({ input, ctx }) {
      const post = await ctx.prisma.post.create({
        // data: input,
        data: { userId: ctx.session?.user?.id, ...input },
        select: defaultPostSelect,
      })
      return post
    },
  })
  // read
  .query('all', {
    async resolve({ ctx }) {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */

      return ctx.prisma.post.findMany({
        select: defaultPostSelect,
      })
    },
  })
  .query('byId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { id } = input
      const post = await ctx.prisma.post.findUnique({
        where: { id },
        select: defaultPostSelect,
      })
      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No post with id '${id}'`,
        })
      }
      return post
    },
  })
  // update
  .mutation('edit', {
    input: z.object({
      id: z.string(),
      data: z.object({
        title: z.string().min(1).max(32).optional(),
        text: z.string().min(1).optional(),
      }),
    }),
    async resolve({ input, ctx }) {
      const { id, data } = input
      const post = await ctx.prisma.post.update({
        where: { id },
        data,
        select: defaultPostSelect,
      })
      return post
    },
  })
  // delete
  .mutation('delete', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { id } = input
      await ctx.prisma.post.delete({ where: { id } })
      return {
        id,
      }
    },
  })
