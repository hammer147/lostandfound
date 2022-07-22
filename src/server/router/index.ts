// src/server/router/index.ts
import { createRouter } from "./context"
import superjson from "superjson"

import { authRouter } from "./auth"
import { postRouter } from './post'
import { commentRouter } from './comments'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", authRouter)
  .merge("post.", postRouter)
  .merge("comments.", commentRouter)

// export type definition of API
export type AppRouter = typeof appRouter
