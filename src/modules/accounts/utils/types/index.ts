export type AccountCurrency = 'USD' | 'COP' | 'VES';
export type AccountType = 'savings' | 'investment' | 'owed_to_me' | 'cash';

export interface Account {
  id: string;
  user_id: string;
  name: string;
  currency: AccountCurrency;
  type: AccountType;
  color: string;
  is_active: boolean;
  created_at: string;
}

export interface AccountSnapshot {
  id: string;
  account_id: string;
  user_id: string;
  amount: number;
  year: number;
  month: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  account?: Account;
}

export type CreateAccountInput = Omit<Account, 'id' | 'created_at' | 'user_id'>;
export type UpsertSnapshotInput = {
  account_id: string;
  amount: number;
  year: number;
  month: number;
  notes?: string | null;
};
