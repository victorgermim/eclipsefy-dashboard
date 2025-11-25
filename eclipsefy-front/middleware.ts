import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 1. Defensive check: Skip Next.js internals and static files
    // This is redundant with the matcher but adds an extra layer of safety
    // to prevent infinite loops or processing of assets.
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static') ||
        pathname.includes('.') // Skip any file with an extension (images, css, etc.)
    ) {
        return NextResponse.next()
    }

    const token = request.cookies.get('auth_token')
    const isLoginPage = pathname === '/login'

    // 2. Auth Logic
    // If user is not logged in and trying to access a protected route
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
    // Standard matcher to exclude common static paths
    // We keep this simple to avoid ReDoS (Regex Denial of Service) or parsing errors
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
