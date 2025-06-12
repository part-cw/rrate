import { useSettings } from '../app/globalContext';
import translations from '../assets/translations';

type Language = keyof typeof translations;
type TranslationKey = keyof typeof translations['English'];

export function useTranslation() {
  const { selectedLanguage } = useSettings();

  function t(key: TranslationKey): string {
    return translations[selectedLanguage as Language]?.[key] || "";
  }

  return { t };
}
