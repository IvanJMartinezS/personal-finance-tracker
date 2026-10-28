import { useLocation } from "react-router-dom";

/**
 * Páginas de listado (Gastos, Ingresos, Categorías, Presupuesto) renderizan
 * sus propios diálogos de crear/editar/eliminar como respaldo para cuando se
 * navega directamente a esa URL sin pasar por un botón de la app — por
 * ejemplo, al refrescar la página con un diálogo abierto, lo que pierde el
 * `state` de React Router (`backgroundLocation`) que usa `Modals.tsx`.
 *
 * `Modals.tsx` ya cubre la navegación normal (la que sí trae
 * `backgroundLocation`) — este respaldo debe activarse ÚNICAMENTE cuando ese
 * estado NO está presente. Sin ese chequeo, el respaldo se montaba SIEMPRE
 * que la URL coincidiera, duplicando el diálogo (uno desde `Modals.tsx`, otro
 * desde la página) en el flujo normal — causaba el guardado por duplicado y
 * las notificaciones superpuestas al crear/editar un registro.
 */
export function useDialogRouteFallback() {
  const location = useLocation();
  const hasBackgroundLocation = !!(location.state as { backgroundLocation?: unknown } | null)?.backgroundLocation;

  return {
    isCreateDialog: !hasBackgroundLocation && location.pathname.includes("/create"),
    isEditDialog: !hasBackgroundLocation && location.pathname.includes("/edit/"),
    isDeleteDialog: !hasBackgroundLocation && location.pathname.includes("/delete/"),
    // Solo lo usa Presupuesto (corregir el monto de un mes pasado), pero
    // vive aquí para no duplicar el chequeo de `hasBackgroundLocation`.
    isCorrectMonthDialog: !hasBackgroundLocation && location.pathname.includes("/correct-month"),
  };
}
