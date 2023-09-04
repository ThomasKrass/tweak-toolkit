import classNames from 'classnames'
import { ButtonHTMLAttributes, PropsWithChildren } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  PropsWithChildren & {
    variant?: 'primary' | 'warn'
  }

export default function Button({
  variant = 'primary',
  children,
  className,
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      className={classNames(
        'inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md',
        className,
        {
          ['bg-editing/90 hover:bg-editing']: variant === 'primary',
          ['bg-error/90 hover:bg-error']: variant === 'warn',
        },
      )}
      {...buttonProps}
    >
      {children}
    </button>
  )
}
