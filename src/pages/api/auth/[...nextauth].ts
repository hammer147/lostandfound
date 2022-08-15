import NextAuth, { type NextAuthOptions } from "next-auth"
import EmailProvider from 'next-auth/providers/email'

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "../../../server/db/client"
import { env } from "../../../server/env.mjs"

export const authOptions: NextAuthOptions = {
  // For more information on each option (and a full list of options) go to
  // https://next-auth.js.org/configuration/options

  // We will use the 'jwt' session strategy because databases at the Edge ar not mature enough
  // https://next-auth.js.org/configuration/nextjs#caveats
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt' // overwrite 'database' which is the default when using an adapter
    // maxAge: 30 * 24 * 60 * 60, // seconds until an idle session expires (default 30 days)
  },
  callbacks: {
    // Include user.role on token (so it can be used in middleware.ts to protect pages)
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    // Include user.id on session (so it can be used in our routers, for example in post.ts)
    // note that we get it from token (not from user) because we use jwt strategy (not database)
    // same for user.role
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub
        session.user.role = token.role as 'USER' | 'ADMIN' // Note that we added this in next-auth.d.ts
      }
      return session
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    // https://next-auth.js.org/providers/email
    // EmailProvider({
    //   server: {
    //     host: env.EMAIL_SERVER_HOST,
    //     port: env.EMAIL_SERVER_PORT,
    //     auth: {
    //       user: env.EMAIL_SERVER_USER,
    //       pass: env.EMAIL_SERVER_PASSWORD
    //     }
    //   },
    //   from: env.EMAIL_FROM
    //   // maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
    // })
    EmailProvider({
      server: `smtp://${env.EMAIL_SERVER_USER}:${env.EMAIL_SERVER_PASSWORD}@${env.EMAIL_SERVER_HOST}`,
      from: process.env.EMAIL_FROM,
    }),
  ],
  theme: {
    colorScheme: "light", // "auto" | "dark" | "light"
    brandColor: "#16a34a", // Hex color code
    logo: "/logo.png" // Absolute URL to image
  },
}

export default NextAuth(authOptions)
