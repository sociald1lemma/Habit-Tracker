'use client'

import type { ComponentProps } from 'react'
import { useFormStatus } from 'react-dom'

export default function SubmitButton({ children, disabled, ...props }: ComponentProps<'button'>) {
  const { pending } = useFormStatus()
  return (
    <button {...props} type="submit" disabled={disabled || pending} aria-busy={pending}>
      {pending ? 'Подождите…' : children}
    </button>
  )
}