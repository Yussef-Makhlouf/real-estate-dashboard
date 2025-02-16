import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 ease-in-out active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#20284DE5]  text-white shadow-lg shadow-[#20284DE5]/30 hover:from-[#AA9554] hover:to-[#C7B371] dark:shadow-[#AA9554]/30",
        destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:from-red-600 hover:to-red-700 dark:shadow-red-900/30",
        outline: "border-2 border-[#AA9554] bg-transparent text-[#AA9554] hover:bg-[#AA9554]/20 dark:border-[#C7B371] dark:text-[#C7B371] dark:hover:bg-[#C7B371]/20",
        secondary: "bg-gradient-to-r from-[#AA9554] to-[#C7B371] text-white shadow-lg shadow-[#AA9554]/30 hover:from-[#C7B371] hover:to-[#EACB9F]",
        ghost: "text-[#AA9554] hover:bg-[#AA9554]/10 hover:text-[#C7B371] dark:text-[#C7B371] dark:hover:bg-[#C7B371]/10",
        link: "text-[#AA9554] underline-offset-2 hover:underline dark:text-[#C7B371]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 rounded-md text-xs",
        lg: "h-12 px-6 rounded-md text-base",
        icon: "h-10 w-10",
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