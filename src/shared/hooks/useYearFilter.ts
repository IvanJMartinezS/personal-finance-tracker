import { useSearchParams } from 'react-router-dom';
import { getDefaultYear, getSelectableYears, MIN_YEAR } from '@/lib/dateUtils';

/**
 * Año seleccionado en un reporte anual (resumen, cuentas), persistido en el
 * query param `?year=` — mismo patrón que `useListFilters` para los filtros
 * de gastos/ingresos: queda en la URL, así que es compartible y sobrevive a
 * recargar la página.
 */
export const useYearFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const years = getSelectableYears();

  const yearParam = Number(searchParams.get('year'));
  const year = years.includes(yearParam) ? yearParam : getDefaultYear();

  const setYear = (value: number) => {
    setSearchParams(prev => {
      if (value === getDefaultYear()) prev.delete('year');
      else prev.set('year', String(value));
      return prev;
    });
  };

  return { year, years, setYear, minYear: MIN_YEAR };
};
