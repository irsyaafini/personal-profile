import { useMutation } from '@tanstack/react-query'
import { messagesService } from '@/services/messages.service'

export function useSendMessage() {
  return useMutation({
    mutationFn: (payload) => messagesService.create(payload),
  })
}
