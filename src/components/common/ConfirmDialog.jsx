import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

/**
 * Confirmation dialog for destructive actions
 * @param {{
 *   isOpen: boolean,
 *   onClose: function,
 *   onConfirm: function,
 *   title?: string,
 *   message?: string,
 *   isLoading?: boolean
 * }} props
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Delete',
  message = 'This action cannot be undone. Are you sure?',
  isLoading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-slate-600 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
          Delete
        </Button>
      </div>
    </Modal>
  )
}
