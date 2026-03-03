interface SupabaseError {
  message: string;
  code?: string;
  status?: number;
}

export const errorMessages: Record<string, string> = {
  invalid_credentials: 'Credenciales inválidas. Revisa tu email y contraseña.',
  email_not_confirmed: 'Debes confirmar tu correo electrónico antes de iniciar sesión.',
  user_not_found: 'No existe un usuario con ese correo.',
  password_recovery_disabled: 'La recuperación de contraseña no está habilitada.',
  '23505': 'Ya existe un registro con ese valor único.', 
  '42501': 'No tienes permisos para realizar esta operación.',
  over_rate_limit: 'Demasiadas solicitudes. Intenta de nuevo más tarde.',
};

/**
 * Obtiene un mensaje de error amigable en español.
 * @param error - Error devuelto por Supabase u otro origen.
 * @returns Mensaje traducido o genérico.
 */
export function getErrorMessage(error: unknown): string {
  if (!error) return 'Error inesperado.';

  const supabaseError = error as SupabaseError;

  if (supabaseError.code && errorMessages[supabaseError.code]) {
    return errorMessages[supabaseError.code];
  }
  if (supabaseError.message) {
    return supabaseError.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Ocurrió un error inesperado.';
}