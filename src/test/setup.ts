// Setup global de Vitest (referenciado desde vitest.config.ts).
// Añade los matchers de @testing-library/jest-dom (toBeInTheDocument, etc.)
// a `expect`, usados por las pruebas de componentes.
import '@testing-library/jest-dom/vitest';
