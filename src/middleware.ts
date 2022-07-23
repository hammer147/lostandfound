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
        // if there is no token then the user is not authenticated and has no access to the paths in the matcher
        if (!token) return false 

        // authentication is enough
        if (req.nextUrl.pathname.startsWith('/posts')) return true
        if (req.nextUrl.pathname.startsWith('/profile')) return true

        // authentication and role must be 'ADMIN'
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token.role === "ADMIN"
        }

        return false
      },
    },
  }
)

// The middleware function will only be invoked if the authorized callback returns true.
// The user is redirected to the sign-in page if the authorized callback returns false.

// Supports both a single string value or an array of matchers
export const config = {
  matcher: ['/posts/:path*', '/profile/:path*', '/admin/:path*'],
}
