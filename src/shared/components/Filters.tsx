import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Filter } from '@/shared/components/Filter';

// `filters: FilterConfig[]` es una lista heterogénea: cada entrada es internamente
// consistente (sus accessors calzan con `options`) en el sitio donde se construye
// (ver useListFilterConfigs), pero el array en sí necesita un T común para poder
// mezclar entradas de distinto tipo (Category, Currency, Month...).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface FilterConfig<T = any> {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly T[];  
  placeholder?: string;
  getOptionKey: (option: T) => string;
  getOptionValue: (option: T) => string;
  renderOption: (option: T) => React.ReactNode;
  className?: string;
}

interface FiltersProps {
  search: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  filters: FilterConfig[];
  onClearAll?: () => void;
  showClearButton?: boolean;
}

export const Filters = ({ 
  search, 
  filters, 
  onClearAll, 
  showClearButton = true 
}: FiltersProps) => {
  const { t } = useTranslation();
  const i18nString = (key: string) => t('filters.' + key);
  const hasActiveFilters = filters.some(f => f.value !== 'all') || search.value !== '';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder={search.placeholder || t('filters.search')}
          value={search.value}
          onChange={(e) => search.onChange(e.target.value)}
        />
      </div>

      {filters.map((filter) => (
        <Filter
          key={filter.id}
          value={filter.value}
          onValueChange={filter.onChange}
          items={filter.options}
          placeholder={filter.placeholder}
          className={filter.className}
          getKey={filter.getOptionKey}
          getValue={filter.getOptionValue}
          renderLabel={filter.renderOption}
          allLabel={i18nString('all')}
        />
      ))}

      {showClearButton && hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearAll}
          className="gap-1"
        >
          <X className="h-4 w-4" />
          {i18nString('clearAll')}
        </Button>
      )}
    </div>
  );
};