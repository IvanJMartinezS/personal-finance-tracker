import { useTranslation } from 'react-i18next';

export const useModuleTranslation = (module: string) => {
  const { t } = useTranslation();
  return (key: string, opts?: Record<string, unknown>) =>
    t(`${module}.${key}`, opts ?? {});
};
