'use client'

import * as ToastPrimitives from '@radix-ui/react-toast'
import { X } from 'lucide-react'
import { useToasts } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const variantStyles: Record<string, string> = {
  default: 'border bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50',
  success: 'border-emerald-500 bg-emerald-500 text-white dark:border-emerald-600 dark:bg-emerald-600',
  destructive: 'border-red-500 bg-red-500 text-zinc-50 dark:border-red-900 dark:bg-red-900',
  warning: 'border-amber-500 bg-amber-500 text-white dark:border-amber-600 dark:bg-amber-600',
}

export function Toaster() {
  const { toasts, dismissToast } = useToasts()

  return (
    <>
      {toasts.map((t) => (
        <ToastPrimitives.Root
          key={t.id}
          open={true}
          onOpenChange={() => dismissToast(t.id)}
          className={cn(
            'pointer-events-auto flex w-full items-center justify-between gap-4 rounded-md border p-4 shadow-lg',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out',
            'data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
            'data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]',
            variantStyles[t.variant || 'default']
          )}
        >
          <div className="grid gap-1">
            <ToastPrimitives.Title className="text-sm font-semibold">
              {t.title}
            </ToastPrimitives.Title>
            {t.description && (
              <ToastPrimitives.Description className="text-sm opacity-90">
                {t.description}
              </ToastPrimitives.Description>
            )}
          </div>
          <ToastPrimitives.Close className="shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100">
            <X className="h-4 w-4" />
          </ToastPrimitives.Close>
        </ToastPrimitives.Root>
      ))}
    </>
  )
}
