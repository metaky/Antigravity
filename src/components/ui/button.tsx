import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground shadow hover:bg-primary/90",
                destructive:
                    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
                outline:
                    "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",

                // Watercolor primary button - flowing blue gradient
                watercolor: `
                    relative overflow-hidden
                    bg-gradient-to-r from-[#6B8FAD] via-[#89A8C4] to-[#7A9E7E]
                    text-white font-semibold
                    shadow-lg shadow-[#6B8FAD]/25
                    hover:shadow-xl hover:shadow-[#6B8FAD]/30
                    hover:scale-[1.02]
                    border border-white/20
                    before:absolute before:inset-0 
                    before:bg-gradient-to-t before:from-black/10 before:to-white/10
                    before:opacity-0 hover:before:opacity-100 before:transition-opacity
                `,

                // Ochre/warm secondary button
                ochre: `
                    bg-gradient-to-r from-[#D4A574] to-[#E5C4A0]
                    text-[#5D4E37] font-semibold
                    shadow-md shadow-[#D4A574]/20
                    hover:shadow-lg hover:shadow-[#D4A574]/30
                    hover:scale-[1.02]
                    border border-white/30
                `,

                // Organic outline with hand-drawn feel
                "outline-organic": `
                    bg-transparent
                    border-2 border-[#D4A574]/60
                    text-[#8B6F47]
                    hover:bg-[#F5F0E8] hover:border-[#D4A574]
                    rounded-[0.75rem_1rem_0.75rem_1rem]
                `,

                // Ghost with watercolor hover
                "ghost-warm": `
                    text-[#8B6F47]
                    hover:bg-gradient-to-r hover:from-[#F5E6D8]/50 hover:to-[#E3EBF1]/50
                `,

                // Legacy premium (keeping for backwards compatibility)
                premium: `
                    bg-gradient-to-r from-[#6B8FAD] via-[#89A8C4] to-[#7A9E7E]
                    text-white font-semibold
                    shadow-lg shadow-[#6B8FAD]/25
                    hover:shadow-xl hover:shadow-[#6B8FAD]/30
                    hover:scale-105
                    border border-white/20
                    transition-all duration-300
                `,
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-8",
                xl: "h-14 rounded-full px-10 text-lg",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
