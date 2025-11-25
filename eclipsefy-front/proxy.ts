import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const token = request.cookies.get('auth_token')
    const isLoginPage = request.nextUrl.pathname === '/login'

    // If user is not logged in and trying to access a protected route
    // The matcher ensures this only runs on protected routes + login
    if (!token && !isLoginPage) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // If user is logged in and trying to access login page
    if (token && isLoginPage) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    // Only run middleware on these specific paths
    matcher: [
        '/',
        '/login',
        '/projects/:path*',
    ],
}
