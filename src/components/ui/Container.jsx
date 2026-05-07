import { cn } from '@/utils'

export function Container({ size = 'xl', className = '', children, ...props }) {
  const cls = size === 'lg' ? 'container-lg' : 'container-xl'
  return (
    <div className={cn(cls, className)} {...props}>
      {children}
    </div>
  )
}
