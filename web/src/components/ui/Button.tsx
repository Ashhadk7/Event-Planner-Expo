import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type Variant = 'primary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-red-500 text-white shadow-[0_10px_40px_-8px_rgba(255,0,0,0.6)] hover:bg-red-600 focus-visible:outline-red-500',
  outline:
    'border border-white/25 text-white hover:border-white hover:bg-white/5 focus-visible:outline-white',
  ghost: 'text-white/80 hover:text-white hover:bg-white/5 focus-visible:outline-white',
}

const SIZES: Record<Size, string> = {
  sm: 'h-10 px-5 text-[13px]',
  md: 'h-12 px-7 text-sm',
  lg: 'h-14 px-9 text-[15px]',
}

const base =
  'group/btn inline-flex items-center justify-center gap-2 rounded-full font-semibold cursor-pointer transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

interface BaseProps {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: BaseProps & ComponentPropsWithoutRef<'button'>) {
  return (
    <button className={`${base} ${VARIANTS[variant]} ${SIZES[size]} ${className}`} {...rest}>
      {children}
    </button>
  )
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: BaseProps & ComponentPropsWithoutRef<'a'>) {
  return (
    <a className={`${base} ${VARIANTS[variant]} ${SIZES[size]} ${className}`} {...rest}>
      {children}
    </a>
  )
}
