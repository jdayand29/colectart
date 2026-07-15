'use client'

import * as RadixTabs from '@radix-ui/react-tabs'
import type { ComponentProps } from 'react'
import clsx from 'clsx'
import { focusRingClassName } from '@/styles/tokens/focus'

export const Tabs = RadixTabs.Root
export const TabsContent = RadixTabs.Content

export function TabsList({ className, ...props }: ComponentProps<typeof RadixTabs.List>) {
  return <RadixTabs.List className={clsx('flex gap-1 border-b border-ink/10', className)} {...props} />
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof RadixTabs.Trigger>) {
  return (
    <RadixTabs.Trigger
      className={clsx(
        'border-b-2 border-transparent px-4 py-2 text-sm font-medium text-ink/60 transition-colors',
        'data-[state=active]:border-ink data-[state=active]:text-ink',
        focusRingClassName,
        className,
      )}
      {...props}
    />
  )
}
