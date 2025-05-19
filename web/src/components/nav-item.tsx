'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import type React from 'react'

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isOpen: boolean
  active?: boolean
}

export function NavItem({ href, icon, label, isOpen, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
        active ? 'bg-primary text-primary-contrast' : 'text-neutral-300 hover:bg-neutral-700 hover:text-neutral-100'
      )}
    >
      <span className="mr-3">{icon}</span>
      <span className={cn('transition-opacity', isOpen ? 'opacity-100' : 'opacity-0 hidden')}>{label}</span>
    </Link>
  )
}
