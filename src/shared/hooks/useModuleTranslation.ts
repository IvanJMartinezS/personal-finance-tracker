import { useTranslation } from 'react-i18next';

export const useModuleTranslation = (module: string) => {
  const { t } = useTranslation();
  return (key: string) => t(`${module}.${key}`);
};
