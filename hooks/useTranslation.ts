import { useGlobalVariables } from '../app/globalContext';
import translations from '../assets/translations';

type Language = keyof typeof translations;
type TranslationKey = keyof typeof translations['English'];

export default function useTranslation() {
  const { selectedLanguage } = useGlobalVariables();

  function t(key: TranslationKey): string {
    return translations[selectedLanguage as Language]?.[key] || "";
  }

  return { t };
}
