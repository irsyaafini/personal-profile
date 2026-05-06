import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  fetchMessages,
  sendMessage,
  markMessageRead,
  deleteMessage,
  fetchDashboardStats,
} from '@/services/messageService'
import { QUERY_KEYS } from '@/constants'

/**
 * Hook for sending a contact message (public)
 */
export function useSendMessage() {
  return useMutation({
    mutationFn: sendMessage,
    onSuccess: () => toast.success('Message sent! I\'ll get back to you soon.'),
    onError: (err) => toast.error(err.message ?? 'Failed to send message.'),
  })
}

/**
 * Hook for fetching all messages (admin)
 */
export function useMessages() {
  return useQuery({
    queryKey: QUERY_KEYS.MESSAGES,
    queryFn: fetchMessages,
  })
}

/**
 * Hook for marking a message as read
 */
export function useMarkMessageRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markMessageRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MESSAGES })
    },
    onError: (err) => toast.error(err.message),
  })
}

/**
 * Hook for deleting a message
 */
export function useDeleteMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MESSAGES })
      toast.success('Message deleted.')
    },
    onError: (err) => toast.error(err.message),
  })
}

/**
 * Hook for fetching admin dashboard stats
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: QUERY_KEYS.STATS,
    queryFn: fetchDashboardStats,
  })
}
