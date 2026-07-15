import clsx from 'clsx'

interface DividerProps {
  className?: string
}

export default function Divider({ className }: DividerProps) {
  return <hr className={clsx('border-t border-ink/10', className)} />
}
