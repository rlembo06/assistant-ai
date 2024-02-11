import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  validation?: { message: string; active: boolean }
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, validation, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <input
          type={type}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />
        {validation?.active && (
          <p className="text-red-500 text-xs italic">{validation.message}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
