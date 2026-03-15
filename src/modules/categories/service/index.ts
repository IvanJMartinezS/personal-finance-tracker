import { supabase } from "@/integrations/supabase/client";
import type { Category } from "@/modules/categories/utils/types";

export class CategoriesService {

  /**
   * Obtiene categorias con paginación opcional.
   * @param userId - ID del usuario 
   * @param limit - Número de registros por página (si no se provee, no aplica paginación)
   * @param page - Número de página (por defecto 1)
   */
  async getCategories(type?: 'expense' | 'income', userId?: string, limit?: number, page: number = 1): Promise<{ data: Category[]; total: number; limit: number; page: number }> {

    let query =  supabase
      .from("categories")
      .select("*", { count: "exact" })
      .order("name", { ascending: true });

    if (userId) {
      query = query.eq("user_id", userId);
    }

    if (type) {
        query = query.eq('type', type);
      }

    if (limit && limit > 0) {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);

    return {
      data: data || [],
      total: count || 0,
      limit: limit || 0,
      page,
    };
  }

  /**
   * Crea una nueva categoria.
   * @param categoryData - Datos de la categoria (sin id, created_at, updated_at)
   */
  async createCategory(
    userId: string,
    categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Category> {
    const { data, error } = await supabase
      .from("categories")
      .insert({ ...categoryData, user_id: userId })
      .select()
      .single();

    if (error) throw new Error(`Error al crear categoría: ${error.message}`);
    return data as Category;
  }

  /**
   * Elimina una categoría.
   * @param id - ID de la categoría
   */
  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw new Error(`Error al eliminar categoría: ${error.message}`);
  } 
}