import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  fetchResearch,
  fetchResearchById,
  createResearch,
  updateResearch,
  deleteResearch,
} from '@/services/researchService'
import { QUERY_KEYS } from '@/constants'

/**
 * Hook for fetching all research projects
 * @returns {import('@tanstack/react-query').UseQueryResult<import('@/services/researchService').ResearchProject[]>}
 */
export function useResearchList() {
  return useQuery({
    queryKey: QUERY_KEYS.RESEARCH,
    queryFn: fetchResearch,
  })
}

/**
 * Hook for fetching a single research project
 * @param {string} id
 * @returns {import('@tanstack/react-query').UseQueryResult<import('@/services/researchService').ResearchProject>}
 */
export function useResearchDetail(id) {
  return useQuery({
    queryKey: QUERY_KEYS.RESEARCH_DETAIL(id),
    queryFn: () => fetchResearchById(id),
    enabled: !!id,
  })
}

/**
 * Hook for creating a research project
 */
export function useCreateResearch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createResearch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESEARCH })
      toast.success('Research project created!')
    },
    onError: (err) => toast.error(err.message),
  })
}

/**
 * Hook for updating a research project
 */
export function useUpdateResearch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }) => updateResearch(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESEARCH })
      toast.success('Research project updated!')
    },
    onError: (err) => toast.error(err.message),
  })
}

/**
 * Hook for deleting a research project
 */
export function useDeleteResearch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteResearch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESEARCH })
      toast.success('Research project deleted.')
    },
    onError: (err) => toast.error(err.message),
  })
}
