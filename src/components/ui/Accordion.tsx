'use client'

import * as RadixAccordion from '@radix-ui/react-accordion'
import type { ComponentProps } from 'react'
import clsx from 'clsx'
import { focusRingClassName } from '@/styles/tokens/focus'

export const Accordion = RadixAccordion.Root
export const AccordionItem = RadixAccordion.Item

export function AccordionTrigger({ className, children, ...props }: ComponentProps<typeof RadixAccordion.Trigger>) {
  return (
    <RadixAccordion.Header>
      <RadixAccordion.Trigger
        className={clsx(
          'flex w-full items-center justify-between border-b border-ink/10 py-4 text-left text-sm font-medium',
          '[&[data-state=open]>span]:rotate-45',
          focusRingClassName,
          className,
        )}
        {...props}
      >
        {children}
        <span aria-hidden="true" className="text-lg transition-transform">
          +
        </span>
      </RadixAccordion.Trigger>
    </RadixAccordion.Header>
  )
}

export function AccordionContent({ className, ...props }: ComponentProps<typeof RadixAccordion.Content>) {
  return (
    <RadixAccordion.Content
      className={clsx('overflow-hidden text-sm text-ink/70 data-[state=open]:py-3', className)}
      {...props}
    />
  )
}
