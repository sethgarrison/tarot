import { useTranslations } from './translationUtils';

export const usePageTitle = () => {
  const { t } = useTranslations();

  const updatePageTitle = (titleKey: string = 'pageTitle.main') => {
    const title = t(titleKey);
    document.title = title;
  };

  return { updatePageTitle };
}; 