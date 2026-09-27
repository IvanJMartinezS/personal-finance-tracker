# Project Overview

## Release

V1.0.3


## Descripción

Personal Finance Tracker es una aplicación web para gestionar finanzas personales. Su objetivo es ofrecer una vista clara de los ingresos, gastos, cuentas y balances del usuario, además de facilitar el análisis de la información mediante dashboards y resúmenes anuales.

La aplicación cuenta con autenticación, persistencia de datos y una interfaz localizada en español e inglés.

## Funcionalidades principales

### Autenticación

- Registro e inicio de sesión.
- Confirmación de correo electrónico.
- Recuperación y actualización de contraseña.
- Rutas protegidas para las funcionalidades privadas.

### Gestión financiera

- Registro, edición y eliminación de ingresos.
- Registro, edición y eliminación de gastos.
- Organización de movimientos por categorías.
- Administración de cuentas.
- Consulta de snapshots de balance.

### Análisis

- Dashboard con totales de ingresos, gastos y balance.
- Visualización de gastos por categoría.
- Listado de transacciones recientes.
- Resumen anual.
- Filtros para facilitar la consulta de movimientos.

### Experiencia de usuario

- Interfaz responsive.
- Componentes accesibles basados en Radix UI.
- Mensajes de validación y notificaciones.
- Soporte para español e inglés.

## Tecnologías utilizadas

| Área | Tecnología | Uso |
| --- | --- | --- |
| Frontend | React 19 | Construcción de la interfaz y composición de componentes |
| Lenguaje | TypeScript | Tipado estático y mantenimiento del código |
| Tooling | Vite | Servidor de desarrollo y build de producción |
| Backend as a service | Supabase | Autenticación, base de datos y acceso a datos |
| Enrutamiento | React Router | Navegación y rutas protegidas |
| Datos remotos | TanStack React Query | Consultas, caché y sincronización de datos |
| Estilos | Tailwind CSS | Utilidades de estilos y diseño responsive |
| Componentes | Radix UI | Primitivas accesibles para la interfaz |
| Formularios | React Hook Form | Estado y manejo de formularios |
| Validación | Zod | Validación de datos de formularios |
| Internacionalización | i18next | Traducciones a español e inglés, con el idioma seleccionado persistido en `localStorage` |
| Gráficos | Recharts | Visualización de resúmenes financieros |
| Testing | Vitest y Testing Library | Pruebas unitarias y de componentes |
| Calidad | ESLint | Detección de problemas y consistencia del código |

## Arquitectura

El código de la aplicación está organizado por dominios funcionales dentro de `src/modules`. Cada módulo puede contener sus páginas, componentes, hooks, rutas, servicios y tipos relacionados.

```text
src/
├── modules/
│   ├── accounts/
│   ├── auth/
│   ├── categories/
│   ├── dashboard/
│   ├── expenses/
│   ├── incomes/
│   ├── notFound/
│   ├── settings/
│   └── summary/
├── shared/
│   ├── auth/
│   ├── components/
│   └── hooks/
├── integrations/
│   └── supabase/
├── database/
├── routes/
├── schemas/
├── i18n/
├── hooks/
├── lib/
├── assets/
└── types/
```

`database/` contiene los scripts SQL de esquema y migraciones de Supabase. `hooks/` y `lib/` agrupan utilidades y hooks compartidos que no pertenecen a un módulo concreto (por ejemplo, manejo de mensajes de error y helpers de estilos).

### Flujo general

1. El usuario se autentica mediante Supabase.
2. `ProtectedLayout` restringe el acceso a las rutas privadas.
3. Las páginas de cada módulo usan hooks y servicios para consultar o modificar datos.
4. TanStack React Query administra el estado de las consultas y sus actualizaciones.
5. Los componentes compartidos centralizan la interfaz, los formularios, los filtros y las notificaciones.

## Configuración local

La aplicación requiere estas variables de entorno:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_PUBLISHABLE_KEY=tu_clave_publicable_de_supabase
```

Los archivos `.env` y `.env.*.local` están excluidos del repositorio mediante `.gitignore`. No se deben subir credenciales ni valores sensibles.

## Desarrollo y validación

```bash
npm install
npm run dev
npm run lint
npm run test
npm run build
```

## Despliegue

El proyecto incluye configuración para desplegarse como una aplicación Vite. El archivo `vercel.json` configura el rewrite necesario para que las rutas del cliente funcionen correctamente al recargar una página.

