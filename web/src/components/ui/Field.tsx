import type { ComponentPropsWithoutRef, ReactNode } from 'react'

/**
 * Brand form primitives — light theme, navy focus ring, red required mark.
 * Shared across the signup form, edit modal and admin so every input matches.
 */

const inputBase =
  'h-11 w-full rounded-xl border border-line bg-white px-4 text-[14px] text-heading shadow-[0_1px_2px_rgba(7,10,51,0.03)] outline-none transition-all duration-200 placeholder:text-muted focus:border-ink-400 focus:ring-4 focus:ring-ink-700/10 disabled:cursor-not-allowed disabled:bg-paper-2 disabled:text-muted'

export function Label({
  children,
  htmlFor,
  required,
  hint,
}: {
  children: ReactNode
  htmlFor?: string
  required?: boolean
  hint?: ReactNode
}) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-2">
      <label htmlFor={htmlFor} className="text-[13px] font-semibold text-heading">
        {children}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {hint && <span className="text-[11px] font-medium text-muted">{hint}</span>}
    </div>
  )
}

export function TextInput({
  className = '',
  ...rest
}: ComponentPropsWithoutRef<'input'>) {
  return <input className={`${inputBase} ${className}`} {...rest} />
}

export function TextArea({
  className = '',
  rows = 4,
  ...rest
}: ComponentPropsWithoutRef<'textarea'>) {
  return (
    <textarea
      rows={rows}
      className={`w-full resize-none rounded-xl border border-line bg-white px-4 py-3 text-[14px] leading-relaxed text-heading shadow-[0_1px_2px_rgba(7,10,51,0.03)] outline-none transition-all duration-200 placeholder:text-muted focus:border-ink-400 focus:ring-4 focus:ring-ink-700/10 ${className}`}
      {...rest}
    />
  )
}

export function SelectInput({
  className = '',
  children,
  ...rest
}: ComponentPropsWithoutRef<'select'>) {
  return (
    <select
      className={`${inputBase} cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22 stroke=%22%23838aa2%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m4 6 4 4 4-4%22/></svg>')] bg-[length:16px] bg-[right_0.9rem_center] bg-no-repeat pr-10 ${className}`}
      {...rest}
    >
      {children}
    </select>
  )
}

/** Wraps a label + control with consistent vertical rhythm. */
export function FieldRow({
  label,
  htmlFor,
  required,
  hint,
  className = '',
  children,
}: {
  label: ReactNode
  htmlFor?: string
  required?: boolean
  hint?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor} required={required} hint={hint}>
        {label}
      </Label>
      {children}
    </div>
  )
}
