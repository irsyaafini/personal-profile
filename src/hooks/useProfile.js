import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { fetchProfile, updateProfile, uploadProfilePhoto } from '@/services/profileService'
import { QUERY_KEYS } from '@/constants'

/**
 * Hook for fetching the portfolio profile
 */
export function useProfile() {
  return useQuery({
    queryKey: QUERY_KEYS.PROFILE,
    queryFn: fetchProfile,
  })
}

/**
 * Hook for updating the profile (admin)
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }) => updateProfile(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE })
      toast.success('Profile updated!')
    },
    onError: (err) => toast.error(err.message),
  })
}

/**
 * Hook for uploading a profile photo
 */
export function useUploadPhoto() {
  return useMutation({
    mutationFn: uploadProfilePhoto,
    onError: (err) => toast.error(err.message),
  })
}
