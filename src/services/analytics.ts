import posthog from 'posthog-js'

const analytics = {
    init: () => {
        if (typeof window !== 'undefined') {
            if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
                console.warn('⚠️ PostHog missing key')
                return
            }

            // Only init if not already loaded
            if (!(posthog as any).__loaded) {
                posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
                    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
                    person_profiles: 'identified_only',
                    capture_pageview: false, // Manually handled in Next.js App Router
                    autocapture: true, // Automatically track clicks, inputs, etc.
                    debug: true, // Enable debug mode for troubleshooting
                })
                console.log('✅ PostHog initialized via Service')
            }
        }
    },

    identifyUser: (userId: string) => {
        if (typeof window !== 'undefined') {
            posthog.identify(userId)
        }
    },

    trackEvent: (eventName: string, properties?: Record<string, any>) => {
        if (typeof window !== 'undefined') {
            posthog.capture(eventName, properties)
        }
    }
}

export default analytics
