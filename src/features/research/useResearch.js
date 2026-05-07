import { useQuery } from '@tanstack/react-query'
import { researchService } from '@/services/research.service'
import { QUERY_KEYS } from '@/constants'

export function useResearchList(opts = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.RESEARCH, opts],
    queryFn: () => researchService.list(opts),
  })
}

export function useResearch(id) {
  return useQuery({
    queryKey: QUERY_KEYS.RESEARCH_DETAIL(id),
    queryFn: () => researchService.getById(id),
    enabled: Boolean(id),
  })
}
