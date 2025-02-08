import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border transition-all duration-200",
          "bg-white/50 backdrop-blur-sm dark:bg-zinc-900/50",
          "border-zinc-200 dark:border-zinc-800",
          "px-4 py-3 text-base md:text-sm",
          "shadow-sm hover:shadow-md",
          "text-zinc-800 dark:text-zinc-200",
          "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
          "ring-offset-background",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "focus:border-indigo-500 dark:focus:border-indigo-400",
          "focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20",
          "focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transform-gpu",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
