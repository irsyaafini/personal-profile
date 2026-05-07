import { useQuery } from '@tanstack/react-query'
import { galleryService } from '@/services/gallery.service'
import { QUERY_KEYS } from '@/constants'

export function useGallery(opts = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.GALLERY, opts],
    queryFn: () => galleryService.list(opts),
  })
}
