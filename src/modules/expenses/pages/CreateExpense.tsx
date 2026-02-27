// src/components/CreateExpensesModal.tsx
import { useNavigate } from 'react-router-dom';
import { Modal } from '@/shared/components/ui/Modal';

export function CreateExpense() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    navigate(-1);
  };

  return (
    <Modal>
      <form onSubmit={handleSubmit} className="space-y-4 border-4 border-green-500">
        <h2 className="text-xl font-bold">Nuevo gasto</h2>
      </form>
    </Modal>
  );
}