// src/components/CreateExpensesModal.tsx
import { useNavigate } from 'react-router-dom';
import { Modal } from './Modal';

export function CreateExpenseModal() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    navigate(-1);
  };

  return (
    <Modal>
      <form onSubmit={handleSubmit} className="space-y-4 border-4 border-green-500">
        <h2 className="text-xl font-bold">Nuevo gasto (MODAL)</h2>
        ...
      </form>
    </Modal>
  );
}