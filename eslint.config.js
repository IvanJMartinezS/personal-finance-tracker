import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    // Componentes generados/gestionados por shadcn (`components.json`): exportan
    // a propósito una variante `cva` (o, en sonner.tsx, el `toast` de la
    // librería) junto al componente. Reestructurarlos para cumplir esta regla
    // de Fast Refresh iría en contra de cómo los regenera el CLI de shadcn.
    files: [
      'src/shared/components/ui/badge.tsx',
      'src/shared/components/ui/button.tsx',
      'src/shared/components/ui/sonner.tsx',
    ],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
