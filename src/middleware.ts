import { NextMiddleware, NextRequest, NextResponse } from 'next/server'
import type { JWT } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"


const middleware: NextMiddleware = (req) => {
  const token = (req as NextRequest & { nextauth: { token: JWT | null } }).nextauth.token
  console.log("Middleware token", token)
  return NextResponse.next()
}

export default withAuth(
  middleware,
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (!token) return false

        // for now authentication is enough (we will look at role later)
        return true

        // if (req.nextUrl.pathname.startsWith('/protected')) return true
        // if (req.nextUrl.pathname.startsWith('/member')) {
        //   return (token.role === "member" || token.role === "admin")
        // }
        // if (req.nextUrl.pathname.startsWith('/admin')) {
        //   return token.role === "admin"
        // }

        // return false
      },
    },
  }
)

// The middleware function will only be invoked if the authorized callback returns true.
// The user is redirected to the sign-in page if the authorized callback returns false.

// Supports both a single string value or an array of matchers
export const config = {
  matcher: ['/protected/:path*',],
  // matcher: ['/protected/:path*', '/member/:path*', '/admin/:path*'],
}
