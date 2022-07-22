import { createRouter } from "./context"
import { z } from "zod"
import { TRPCError } from '@trpc/server'
import { Prisma } from '@prisma/client'

/**
  * Default selector for Comment.
  * It's important to always explicitly say which fields you want to return in order to not leak extra information
  * @see https://github.com/prisma/prisma/issues/9353
  */
const defaultCommentSelect = Prisma.validator<Prisma.CommentSelect>()({
  id: true,
  name: true,
  text: true,
  createdAt: true,
  updatedAt: true,
})

export const commentRouter = createRouter()
  .query('byPostId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { id } = input
      const comments = await ctx.prisma.comment.findMany({
        where: { postId: id },
        select: defaultCommentSelect,
      })

      return comments
    },
  })
  .mutation('add', {
    input: z.object({
      name: z.string().min(1),
      text: z.string().min(1),
      postId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const comment = await ctx.prisma.comment.create({
        data: input,
        select: defaultCommentSelect,
      })

      return comment
    },
  })
