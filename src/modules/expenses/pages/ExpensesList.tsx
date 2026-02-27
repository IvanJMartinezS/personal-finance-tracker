import { useLocation, Link } from "react-router-dom";

export const ExpensesList = () => {
    const location = useLocation();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Expenses</h1>
      <p className="text-muted-foreground">Expenses Page</p>
       <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <Link
        to="create-expense"
        state={{ backgroundLocation: location }}
        className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded"
      >
        Crear gastosss
      </Link>
    </div>
    </div>
  );
}