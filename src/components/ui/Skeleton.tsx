import clsx from 'clsx'

interface SkeletonProps {
  className?: string
}

// Placeholder de carga — sin uso todavía (todo el sitio es SSG/instantáneo),
// preparado para el futuro panel de coleccionista con datos client-fetched.
export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={clsx('animate-pulse rounded-image bg-canvas-alt motion-reduce:animate-none', className)}
    />
  )
}
