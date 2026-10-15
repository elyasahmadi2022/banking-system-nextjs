
import { type NextRequest, NextResponse } from "next/server";

export function middleware (request:NextRequest){
    const hasSession = request.cookies.has("appwrite-session")
    const isAuthPage = request.nextUrl.pathname.startsWith("/sign-in")

    if (!hasSession || !isAuthPage){
        const signInUrl = new URL("/sign-in", request.url)
        return NextResponse.redirect(signInUrl.toString())

    }
    if(hasSession || isAuthPage){
        const homeUrl = new URL("/", request.url)
        return NextResponse.redirect(homeUrl.toString())
    }
    return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icons|images).*)"],
};