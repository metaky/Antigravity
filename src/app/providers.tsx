'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from "next/navigation"

function PostHogPageView() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Track pageviews
        if (pathname && posthog) {
            let url = window.origin + pathname
            if (searchParams?.toString()) {
                url = url + `?${searchParams.toString()}`
            }
            posthog.capture('$pageview', {
                '$current_url': url,
            })
        }
    }, [pathname, searchParams])

    return null
}

export function PHProvider({
    children,
}: {
    children: React.ReactNode
}) {
    useEffect(() => {
        // Only init if we have a key and are on the client
        if (typeof window !== 'undefined') {
            if (!process.env.NEXT_PUBLIC_POSTHOG_KEY || !process.env.NEXT_PUBLIC_POSTHOG_HOST) {
                console.warn('⚠️ PostHog missing keys:', {
                    hasKey: !!process.env.NEXT_PUBLIC_POSTHOG_KEY,
                    hasHost: !!process.env.NEXT_PUBLIC_POSTHOG_HOST
                })
            } else {
                if (!posthog.__loaded) {
                    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
                        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
                        person_profiles: 'identified_only',
                        capture_pageview: false, // Manually handled in PostHogPageView
                        persistence: 'localStorage+cookie',
                        debug: true, // Enable debug mode for now
                    })
                    console.log('✅ PostHog initialized')
                }
            }
        }
    }, [])

    return (
        <PostHogProvider client={posthog}>
            <Suspense fallback={null}>
                <PostHogPageView />
            </Suspense>
            {children}
        </PostHogProvider>
    )
}
