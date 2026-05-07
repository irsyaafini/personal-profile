import { useUIStore } from '@/app/store/ui.store'
import { translations } from './translations'

/**
 * Tiny translation helper. Usage: const { t } = useTranslation(); t('nav.about')
 */
export function useTranslation() {
  const language = useUIStore((s) => s.language)
  const dict = translations[language] ?? translations.en

  const t = (key, fallback = '') => {
    const parts = key.split('.')
    let cur = dict
    for (const p of parts) {
      if (cur && typeof cur === 'object' && p in cur) cur = cur[p]
      else return fallback || key
    }
    return typeof cur === 'string' ? cur : fallback || key
  }

  return { t, language }
}
