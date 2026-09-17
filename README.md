# Personal Finance Tracker

Aplicación web para organizar y consultar las finanzas personales desde un solo lugar. Permite registrar ingresos y gastos, administrar categorías y cuentas, y consultar balances y resúmenes anuales.

## Funcionalidades

- Autenticación de usuarios y recuperación de contraseña.
- Dashboard con ingresos, gastos, balance y transacciones recientes.
- Registro, edición y eliminación de ingresos y gastos.
- Gestión de categorías.
- Gestión de cuentas y snapshots de balance.
- Resumen anual con visualizaciones.
- Filtros para consultar transacciones.
- Interfaz disponible en español e inglés.
- Diseño responsive con componentes accesibles.

## Tecnologías

- React 19 y TypeScript.
- Vite como herramienta de desarrollo y build.
- Supabase para autenticación y persistencia de datos.
- React Router para el enrutamiento.
- TanStack React Query para consultar y sincronizar datos.
- Tailwind CSS, Radix UI y componentes propios para la interfaz.
- React Hook Form y Zod para formularios y validación.
- i18next para internacionalización.
- Recharts para gráficos.
- Vitest y Testing Library para pruebas.
- ESLint para calidad y consistencia del código.

Para consultar la descripción técnica y la arquitectura del proyecto, revisa [`docs/PROJECT_OVERVIEW.md`](./docs/PROJECT_OVERVIEW.md).

## Requisitos

- Node.js 18 o superior.
- npm.
- Un proyecto de Supabase.

## Instalación

```bash
npm install
```

Crea un archivo `.env.local` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_PUBLISHABLE_KEY=tu_clave_publicable_de_supabase
```

## Comandos disponibles

```bash
# Iniciar el servidor de desarrollo
npm run dev

# Ejecutar el build de producción
npm run build

# Ejecutar el linter
npm run lint

# Ejecutar las pruebas
npm run test

# Previsualizar el build de producción
npm run preview
```

## Estructura principal

```text
src/
├── modules/       # Funcionalidades organizadas por dominio
├── shared/        # Componentes y lógica reutilizable
├── integrations/  # Integraciones externas, como Supabase
├── routes/        # Configuración de rutas
├── schemas/       # Esquemas de validación
└── i18n/          # Traducciones
```

## Documentación

- [`docs/PROJECT_OVERVIEW.md`](./docs/PROJECT_OVERVIEW.md): descripción detallada del proyecto, arquitectura y tecnologías.
