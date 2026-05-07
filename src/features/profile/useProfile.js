import { useQuery } from '@tanstack/react-query'
import { profileService } from '@/services/profile.service'
import { QUERY_KEYS } from '@/constants'

export function useProfile() {
  return useQuery({
    queryKey: QUERY_KEYS.PROFILE,
    queryFn: () => profileService.getProfile(),
  })
}
