import { supabase } from "@/integrations/supabase/client";

export class ExpensesService {
  async getExpenses(userId?: string, limit?: number, page?: number): Promise<any> {
    const limitValue = limit || 0;
    const pageValue = page || 1;
    const from = (pageValue - 1) * limitValue;
    const to = from + limitValue - 1;

    let query =  supabase
      .from("expenses")
      .select("*, categories(name, color, type)", { count: "exact" })
      .order("date", { ascending: false })
      .range(from, to);

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);

    return {
      data: data || [],
      total: count || 0,
      limit,
      page,
    };
  }

  async createExpense(expenseData: any) {
    const { data, error } = await supabase
      .from("expenses")
      .insert(expenseData)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateExpense(id: string, updates: any) {
    const { data, error } = await supabase
      .from("expenses")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteExpense(id: string) {
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) throw error;
  } 
}