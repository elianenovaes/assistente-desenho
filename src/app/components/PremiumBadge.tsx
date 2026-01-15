'use client'

import { Crown } from 'lucide-react'

interface PremiumBadgeProps {
  size?: 'sm' | 'md' | 'lg'
}

export function PremiumBadge({ size = 'md' }: PremiumBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  return (
    <span className={`inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black rounded-full ${sizeClasses[size]}`}>
      <Crown className={iconSizes[size]} />
      PREMIUM
    </span>
  )
}
