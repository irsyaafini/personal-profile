import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  fetchPublications,
  createPublication,
  updatePublication,
  deletePublication,
} from '@/services/publicationService'
import { QUERY_KEYS } from '@/constants'

/**
 * Hook for fetching all publications
 */
export function usePublications() {
  return useQuery({
    queryKey: QUERY_KEYS.PUBLICATIONS,
    queryFn: fetchPublications,
  })
}

/**
 * Hook for creating a publication
 */
export function useCreatePublication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createPublication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PUBLICATIONS })
      toast.success('Publication added!')
    },
    onError: (err) => toast.error(err.message),
  })
}

/**
 * Hook for updating a publication
 */
export function useUpdatePublication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }) => updatePublication(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PUBLICATIONS })
      toast.success('Publication updated!')
    },
    onError: (err) => toast.error(err.message),
  })
}

/**
 * Hook for deleting a publication
 */
export function useDeletePublication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deletePublication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PUBLICATIONS })
      toast.success('Publication deleted.')
    },
    onError: (err) => toast.error(err.message),
  })
}
