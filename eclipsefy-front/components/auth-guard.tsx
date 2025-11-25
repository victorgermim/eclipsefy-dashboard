"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        // Check for auth_token cookie
        const hasToken = document.cookie.split(';').some((item) => item.trim().startsWith('auth_token='))
        const isLoginPage = pathname === '/login'

        if (!hasToken && !isLoginPage) {
            // Not logged in and not on login page -> Redirect to login
            router.replace('/login')
        } else if (hasToken && isLoginPage) {
            // Logged in and on login page -> Redirect to dashboard
            router.replace('/')
        } else {
            // Valid state, show content
            setIsChecking(false)
        }
    }, [pathname, router])

    // Prevent flash of protected content while checking
    if (isChecking) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        )
    }

    return <>{children}</>
}
