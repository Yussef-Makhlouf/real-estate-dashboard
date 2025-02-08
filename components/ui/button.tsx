import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-600 hover:to-indigo-700 dark:shadow-indigo-900/30",
        destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:from-red-600 hover:to-red-700 dark:shadow-red-900/30",
        outline: "border-2 border-zinc-200 bg-white/50 text-zinc-800 backdrop-blur-sm hover:bg-zinc-50 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 dark:hover:bg-zinc-900 dark:hover:border-zinc-700",
        secondary: "bg-gradient-to-r from-zinc-100 to-zinc-200 text-zinc-900 shadow-lg shadow-zinc-200/30 hover:from-zinc-200 hover:to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-100 dark:shadow-zinc-900/30 dark:hover:from-zinc-700 dark:hover:to-zinc-800",
        ghost: "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
        link: "text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-4 rounded-lg text-xs",
        lg: "h-12 px-8 rounded-xl text-base",
        icon: "h-11 w-11",
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
