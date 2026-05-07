import { cn } from '@/utils'

export function Card({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag className={cn('card', className)} {...props}>
      {children}
    </Tag>
  )
}

export function CardBody({ className = '', children, ...props }) {
  return (
    <div className={cn('p-6 sm:p-7', className)} {...props}>
      {children}
    </div>
  )
}
