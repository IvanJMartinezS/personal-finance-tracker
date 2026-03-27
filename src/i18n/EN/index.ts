export const EN = {
  loading:{
    default: 'Loading...',
  },

  header: {
    welcome: 'Welcome to Personal Finance Tracker',
  },

  dashboard: {
    totalIncome: 'Incomes',
    totalExpenses: 'Expenses',
    balance: 'Balance',
    expensesPerCategory: 'Expenses by Category',
    recentTransactions: 'Recent Transactions',
    noTransactions: 'No recent transactions',
  },
  
  auth:{
    login: 'Login',
    loading: 'Loading',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    fullName: 'Full Name',
    loginDescription: 'Login to your FinTrack account',
    registerDescription: 'Register to get started',
    noAccount: 'Don\'t have an account?',
    alreadyAccount: 'Already have an account?',
    yourName: 'Your name',
    yourEmail: 'your@email.com',
    espanish: 'Spanish',
    english: 'English',
    checkEmail: 'Check your email to confirm your account',
  },

  sideNavBar: {
    title: 'FinTrack',
    description: 'Personal Finance',
    dashboard: 'Dashboard',
    expenses: 'Expenses',
    incomes: 'Incomes',
    categories: 'Categories',
    settings: 'Settings',
    summary: 'Yearly summary',
  },

  expenses:{
    title: 'Expenses',
    resumen: ' register · Total: ',
    newExpense: 'New Expense',
    registerExpense: 'Register Expense',
    date: 'Date',
    category: 'Category',
    item: 'Item',
    amount: 'Amount',
    currency: 'Currency',
    exchangeRate: 'Exchange Rate to COP',
    notes: 'Notes',
    save: 'Save',
    selectCategory: 'Select Category',
    exampleItem: 'E.g: Supermarket',
    descriptionNote: 'Additional Notes...',
    allLabel: 'All',
    noRecords: 'No expenses recorded',
    searchExpenses: 'Search expenses...',
    deleteExpense: 'Delete Expense?',
    deleteExpenseDescription: 'Are you sure you want to delete this expense? This action cannot be undone.',
    cancel: 'Cancel',
    delete: 'Delete',
    filterMonth: 'Months',
    filterCategory: 'Category',
    filterCurrency: 'Currency',
    createSuccess: 'Expense successfully created',
    createError: 'Error creating the expense',
    exampleItemExchange: 'E.g: 4200',
    deleteSuccess: 'Expense deleted',
    deleteError: 'Error deleting expense',
    deleting: 'Deleting...',
    saving: 'Saving...',
  },

  incomes:{
    title: 'Incomes',
    resumen: ' records · Total: ',
    newIncome: 'New Income',
    registerIncome: 'Register Income',
    date: 'Date',
    category: 'Category',
    item: 'Item',
    amount: 'Amount',
    currency: 'Currency',
    exchangeRate: 'Exchange Rate to COP',
    notes: 'Notes',
    save: 'Save',
    saving: 'Saving...',
    selectCategory: 'Select Category',
    source: 'Source',
    exampleSource: 'E.g: Salary',
    exampleItemExchange: 'E.g: 4200',
    descriptionNote: 'Additional Notes...',
    allLabel: 'All',
    noRecords: 'No incomes recorded',
    searchIncomes: 'Search incomes...',
    deleteIncome: 'Delete Income?',
    deleteIncomeDescription: 'Are you sure you want to delete this income? This action cannot be undone.',
    cancel: 'Cancel',
    delete: 'Delete',
    deleting: 'Deleting...',
    deleteSuccess: 'Income deleted',
    deleteError: 'Error deleting income',
    filterMonth: 'Months',
    filterCategory: 'Category',
    filterCurrency: 'Currency',
  },

  categories:{
    categories: 'Categories',
    newCategory: 'New category',
    configCategories: 'Settings Categories',
    name: 'Name',
    type: 'Type',
    expense: 'Expense',
    income: 'Income',
    color: 'Color',
    saveCategory: 'Save category',
    saving: 'Saving...',
    selectCategory: 'Select category',
    exampleItem: 'E.g: Salary',
    nameCategory: 'Category name',
    incomes: 'Incomes categories',
    expenses: 'Expenses categories',
    deleteCategory: 'Delete category?',
    deleteCategoryDescription: 'Expenses/incomes with this category will be left without an assigned category.',
    deleteSuccess: 'Category deleted',
    deleteError: 'Error deleting category',
    cancel: 'Cancel',
    delete: 'Delete',
    deleting: 'Deleting...',
    noCategories: 'No categories',
  },

  summary: {
    title: 'Summary {{year}}',
    subtitle: 'Expenses by category',
    monthsRegistered_one: '{{count}} month registered',
    monthsRegistered_other: '{{count}} months registered',
    category: 'Category',
    total: 'Total',
    noCategories: 'No expense categories registered',
    usdNote: '* USD values are calculated using the exchange rate recorded on each expense. COP expenses are converted using a reference rate of $3,700.',
  },

  months: {
    ene: 'Jan', feb: 'Feb', mar: 'Mar', abr: 'Apr',
    may: 'May', jun: 'Jun', jul: 'Jul', ago: 'Aug',
    sep: 'Sep', oct: 'Oct', nov: 'Nov', dic: 'Dec',
  },

  settings: {
    setting: 'Settings',
    description: 'Manage your profile and preferences',
    profile: 'Profile',
    user: 'User',
    fullName: 'Full name',
    saving: 'Saving...',
    saveChanges: 'Save changes',
    account: 'Account',
    logIn: 'Log out',
  },

  filters: {
    all: 'Todas',
    clearAll: 'Clear',
  },

  schemas: {
    expenses: {
      date: {
        required: "Date is required"
      },
      category_id: {
        required: "Please select a category"
      },
      item: {
        required: "Concept is required"
      },
      amount: {
        required: "Amount is required",
        invalid_type: "Amount must be a number",
        positive: "Amount must be positive"
      },
      currency: {
        required: "Currency is required"
      },
      exchange_rate: {
        invalid_type: "Exchange rate must be a number",
        required_for_foreign: "Exchange rate is required for foreign currency",
        positive: "Exchange rate must be positive"
      }
    },
    incomes: {
      date: {
        required: "Date is required"
      },
      category_id: {
        required: "Please select a category"
      },
      source: {
        required: "Source is required"
      },
      amount: {
        required: "Amount is required",
        invalid_type: "Amount must be a number",
        positive: "Amount must be positive"
      },
      currency: {
        required: "Currency is required"
      },
      exchange_rate: {
        invalid_type: "Exchange rate must be a number",
        required_for_foreign: "Exchange rate is required for foreign currency",
        positive: "Exchange rate must be positive"
      }
    }
  }
}