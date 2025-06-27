import { useGlobalVariables } from './globalContext';
import translations from '../assets/translations';

type Language = keyof typeof translations;
type TranslationKey = keyof typeof translations['English'];

// Custom hook to handle translations based on the selected language
export default function useTranslation() {
  const { selectedLanguage } = useGlobalVariables();

  function t(key: TranslationKey): string {
    return translations[selectedLanguage as Language]?.[key] || "";
  }

  return { t };
}
