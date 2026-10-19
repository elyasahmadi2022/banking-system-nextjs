// proxy.ts
import { type NextRequest, NextResponse } from "next/server"
import { getLoggedInUser } from "./lib/actions/user.actions"

export default async  function proxy(request: NextRequest) {
  const isUser = await getLoggedInUser()
  const pathname = request.nextUrl.pathname
  // 1. Define all routes that should be accessible WITHOUT logging in
  const publicAuthRoutes = ["/sign-in", "/sign-up", "/forgot-password"]
  const isAuthPage = publicAuthRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // 2. Prevent infinite interception of background static files
  if (pathname.includes(".")) {
    return NextResponse.next()
  }

  // 3. Logged out AND trying to view a protected dashboard page -> Redirect to Sign-In
  if (!isUser && !isAuthPage) {
    const signInUrl = new URL("/sign-in", request.url)
    return NextResponse.redirect(signInUrl)
  }

  // 4. Logged in AND trying to view an auth page -> Redirect to Home
  if (isUser && isAuthPage) {
    const homeUrl = new URL("/", request.url)
    const response = NextResponse.redirect(homeUrl)

    // Force Next.js router to wipe its cache and read fresh cookies
    response.headers.set("x-middleware-cache", "no-cache")
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/",
    "/my-banks",
    "/payment-transfer",
    "/transaction-history",
  ],
}
