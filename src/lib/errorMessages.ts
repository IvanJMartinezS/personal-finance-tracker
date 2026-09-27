interface SupabaseError {
  message: string;
  code?: string;
  status?: number;
}

/**
 * Forma del error que lanzan los servicios de la app al crear/actualizar un
 * registro (ver `createTransactionCrud`): un `Error` estándar con un `code`
 * opcional (código de error de Postgres/Supabase, p. ej. `22P02`).
 */
export type AppError = Error & { code?: string };

export const errorMessages: Record<string, string> = {  
  invalid_credentials: 'invalid_credentials',
  email_not_confirmed: 'email_not_confirmed',
  user_not_found: 'user_not_found',
  password_recovery_disabled: 'password_recovery_disabled',
  '23505': 'unique_violation', 
  '42501': 'permission_denied',
  over_rate_limit: 'rate_limit_exceeded',
  // Código y mensaje literal que devuelve Supabase Auth cuando se supera el
  // límite de correos que puede ENVIAR el proyecto (confirmación de registro,
  // magic link, reset de contraseña) — no depende del correo, navegador o IP
  // del usuario, es un límite global del proyecto (ver el mensaje de
  // AuthPage.tsx). Se mapean ambas formas porque según la versión del SDK de
  // Supabase, el error trae `code` o solo `message`.
  over_email_send_rate_limit: 'emailRateLimitExceeded',
  "Email rate limit exceeded": 'emailRateLimitExceeded',
  "Invalid API key": 'invalid_api_key',
  "EMAIL_ALREADY_REGISTERED": 'emailAlreadyRegistered',
};

/**
 * Obtiene un código de error que puede ser traducido.
 * @param error - Error devuelto por Supabase u otro origen.
 * @returns Código de error para traducción.
 */
export function getErrorMessage(error: unknown): string {
  if (!error) return 'unexpected_error';

  const supabaseError = error as SupabaseError;

  if (supabaseError.code && errorMessages[supabaseError.code]) {
    return errorMessages[supabaseError.code];
  }
  
  if (error instanceof Error) {
    const errorMessage = error.message;
    if (errorMessages[errorMessage]) {
      return errorMessages[errorMessage];
    }
    return errorMessage;
  }

  if (typeof error === 'string') {
    if (errorMessages[error]) {
      return errorMessages[error];
    }
    return error;
  }

  return 'unexpected_error';
}