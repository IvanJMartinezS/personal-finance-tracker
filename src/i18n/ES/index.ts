export const ES = {
  loading:{
    default: 'Cargando...',
  },

  header: {
    welcome: 'Bienvenido a Personal Finance Tracker',
  },

  dashboard: {
    totalIncome: 'Ingresos',
    totalExpenses: 'Gastos',
    balance: 'Balance',
    expensesPerCategory: 'Gastos por categoría',
    recentTransactions: 'Últimas transacciones',
    noTransactions: 'No hay transacciones recientes',
  },

  auth:{
    login: 'Iniciar sesión',
    loading: 'Cargando',
    register: 'Crear cuenta',
    email: 'Correo electrónico',
    password: 'Contraseña',
    fullName: 'Nombre completo',
    loginDescription: 'Ingresa a tu cuenta de FinTrack',
    registerDescription: 'Regístrate para comenzar',
    noAccount: '¿No tienes cuenta?',
    alreadyAccount: '¿Ya tienes cuenta?',
    yourName: 'Tu nombre',
    yourEmail: 'tu@email.com',
    espanish: 'Español',
    english: 'English',
    checkEmail: 'Revisa tu email para confirmar tu cuenta',
  },

  sideNavBar: {
    title: 'FinTrack',
    description: 'Finanzas personales',
    dashboard: 'Dashboard',
    expenses: 'Gastos',
    incomes: 'Ingresos',
    categories: 'Categorías',
    settings: 'Configuración',
    accounts: 'Cuentas',
    summary: 'Resumen anual',
  },

  expenses:{
    title: 'Gastos',
    resumen: ' registros · Total: ',
    newExpense: 'Nuevo Gasto',
    registerExpense: 'Registrar gasto',
    date: 'Fecha',
    category: 'Categoría',
    item: 'Item',
    amount: 'Monto',
    currency: 'Moneda',
    exchangeRate: 'Tasa de cambio a COP',
    notes: 'Notas',
    save: 'Guardar',
    selectCategory: 'Seleccionar categoría',
    exampleItem: 'Ej: Supermercado Éxito',
    descriptionNote: 'Notas adicionales...',
    allLabel: 'Todas',
    noRecords: 'No hay gastos registrados',
    searchExpenses: 'Buscar gastos...',
    deleteExpense: 'Eliminar gasto?',
    deleteExpenseDescription: '¿Estás seguro de que quieres eliminar este gasto? Esta acción no se puede deshacer.',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    filterMonth: 'Mes',
    filterCategory: 'Categoria',
    filterCurrency: 'Moneda',
    createSuccess: 'Gasto creado con exito',
    createError: 'Error al crear el gasto',
    exampleItemExchange: 'Ej: 4200',
    deleteSuccess: 'Gasto eliminado',
    deleteError: 'Error al eliminar el gasto',
    deleting: 'Eliminando...',
    saving: 'Guardando...',
  },

  incomes:{
    title: 'Ingresos',
    resumen: ' registros · Total: ',
    newIncome: 'Nuevo Ingreso',
    registerIncome: 'Registrar ingreso',
    date: 'Fecha',
    category: 'Categoría',
    item: 'Item',
    amount: 'Monto',
    currency: 'Moneda',
    exchangeRate: 'Tasa de cambio a COP',
    notes: 'Notas',
    save: 'Guardar',
    saving: 'Guardando...',
    selectCategory: 'Seleccionar categoría',
    source: 'Fuente',
    exampleSource: 'Ej: Salario',
    exampleItemExchange: 'Ej: 4200',
    descriptionNote: 'Notas adicionales...',
    allLabel: 'Todas',
    noRecords: 'No hay ingresos registrados',
    searchIncomes: 'Buscar ingresos...',
    deleteIncome: 'Eliminar ingreso?',
    deleteIncomeDescription: '¿Estás seguro de que quieres eliminar este ingreso? Esta acción no se puede deshacer.',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    deleting: 'Eliminando...',
    deleteSuccess: 'Ingreso eliminado',
    deleteError: 'Error al eliminar el ingreso',
    filterMonth: 'Mes',
    filterCategory: 'Categoria',
  },

  categories:{
    categories: 'Categorias',
    newCategory: 'Nueva Categoria',
    configCategories: 'Categorias configuradas',
    name: 'Nombre',
    type: 'Tipo',
    expense: 'Gasto',
    income: 'Ingreso',
    color: 'Color',
    saveCategory: 'Guardar categoria',
    saving: 'Guardando...',
    selectCategory: 'Seleccionar categoría',
    exampleItem: 'Ej: Alimentacion',
    nameCategory: 'Nombre',
    incomes: 'Categorias de Ingresos',
    expenses: 'Categorias de gastos',
    filterCategory: 'Categoria',
    deleteCategory: '¿Eliminar categoría?',
    deleteCategoryDescription: 'Los gastos/ingresos con esta categoría quedarán sin categoría asignada.',
    deleteSuccess: 'Categoría eliminada',
    deleteError: 'Error al eliminar la categoría',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    deleting: 'Eliminando...',
    noCategories: 'Sin categorías',
  },

  accounts: {
    title: 'Mis Cuentas',
    subtitle: 'Saldos actuales',
    newAccount: 'Nueva Cuenta',
    accountName: 'Nombre de la cuenta',
    accountNamePlaceholder: 'Ej: Binance, Nequi, Efectivo',
    currency: 'Moneda',
    accountType: 'Tipo',
    typeSavings: 'Ahorros',
    typeInvestment: 'Inversión',
    typeOwedToMe: 'Me deben',
    typeCash: 'Efectivo',
    type_savings: 'Ahorros',
    type_investment: 'Inversión',
    type_owed_to_me: 'Me deben',
    type_cash: 'Efectivo',
    color: 'Color',
    save: 'Guardar',
    saving: 'Guardando...',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    deleting: 'Eliminando...',
    deleteAccount: '¿Eliminar cuenta?',
    deleteAccountDescription: 'La cuenta se desactivará. El historial de saldos se conserva.',
    deleteSuccess: 'Cuenta eliminada',
    deleteError: 'Error al eliminar la cuenta',
    registerBalance: 'Registrar saldo',
    amount: 'Saldo',
    notes: 'Notas',
    notesPlaceholder: 'Ej: Incluye sueldo de marzo',
    noBalance: 'Sin saldo este mes',
    noAccounts: 'No tienes cuentas registradas',
    totalUSD: 'Total en USD',
    monthlyHistory: 'Historial mensual',
    month: 'Mes',
    diff: 'Diferencia',
  },

  summary: {
    title: 'Resumen {{year}}',
    subtitle: 'Gastos por categoría',
    monthsRegistered_one: '{{count}} mes registrado',
    monthsRegistered_other: '{{count}} meses registrados',
    category: 'Categoría',
    total: 'Total',
    noCategories: 'No hay categorías de gastos registradas',
    usdNote: '* Los valores en USD se calculan usando la tasa de cambio registrada en cada gasto. Los gastos en COP se convierten usando una tasa referencial de $3.700.',
  },

  months: {
    ene: 'Ene', feb: 'Feb', mar: 'Mar', abr: 'Abr',
    may: 'May', jun: 'Jun', jul: 'Jul', ago: 'Ago',
    sep: 'Sep', oct: 'Oct', nov: 'Nov', dic: 'Dic',
  },

  settings: {
    setting: 'Configuracion',
    description: 'Gestiona tu perfil y preferencias',
    profile: 'Perfil',
    user: 'Usuario',
    fullName: 'Nombre completo',
    saving: 'Guardando...',
    saveChanges: 'Guardar cambios',
    account: 'Cuenta',
    logIn: 'Cerrar sesion',
  },

  filters: {
    all: 'Todas',
    clearAll: 'Borrar Filtro',
  },

  schemas: {
    expenses: {
      date: {
        required: "La fecha es requerida"
      },
      category_id: {
        "required": "Selecciona una categoría"
      },
      item: {
        required: "El concepto es requerido"
      },
      amount: {
        required: "El monto es requerido",
        invalid_type: "El monto debe ser un número",
        positive: "El monto debe ser positivo"
      },
      currency: {
        required: "La moneda es requerida"
      },
      exchange_rate: {
        invalid_type: "La tasa debe ser un número",
        required_for_foreign: "La tasa de cambio es requerida para moneda extranjera",
        positive: "La tasa de cambio debe ser positiva"
      }
    },
    incomes: {
      date: {
        required: "La fecha es requerida"
      },
      category_id: {
        required: "Selecciona una categoría"
      },
      source: {
        required: "La fuente es requerida"
      },
      amount: {
        required: "El monto es requerido",
        invalid_type: "El monto debe ser un número",
        positive: "El monto debe ser positivo"
      },
      currency: {
        required: "La moneda es requerida"
      },
      exchange_rate: {
        invalid_type: "La tasa debe ser un número",
        required_for_foreign: "La tasa de cambio es requerida para moneda extranjera",
        positive: "La tasa de cambio debe ser positiva"
      }
    }
  }
}