import { useId, type TextareaHTMLAttributes } from 'react'
import clsx from 'clsx'
import { focusRingClassName } from '@/styles/tokens/focus'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export default function Textarea({ label, error, id, className, ...props }: TextareaProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId
  const errorId = error ? `${textareaId}-error` : undefined

  return (
    <div>
      {label && (
        <label htmlFor={textareaId} className="mb-1.5 block text-sm font-medium text-ink/70">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={clsx(
          'w-full rounded-field border bg-white px-4 py-2.5 text-sm outline-none transition-colors',
          error ? 'border-red-400' : 'border-ink/15 focus:border-accent/50',
          focusRingClassName,
          className,
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
