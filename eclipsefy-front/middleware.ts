import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    try {
        const token = request.cookies.get('auth_token')
        const { pathname } = request.nextUrl
        const isLoginPage = pathname === '/login'

        // If user is not logged in and trying to access a protected route
        if (!token && !isLoginPage) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        // If user is logged in and trying to access login page
        if (token && isLoginPage) {
            const url = request.nextUrl.clone()
            url.pathname = '/'
            return NextResponse.redirect(url)
        }

        return NextResponse.next()
    } catch (error) {
        console.error('Middleware error:', error)
        // Fail open to avoid 500 errors during presentation
        return NextResponse.next()
    }
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/projects/:path*',
    ],
}
