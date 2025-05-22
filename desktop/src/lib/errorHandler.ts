import { AxiosError } from "axios";

/**
 * Processa un error de tipus desconegut i retorna un missatge d'error llegible per l'usuari.
 * Intenta extreure informació específica si l'error és una instància d'AxiosError
 * o un objecte amb una propietat 'message'.
 *
 * @param {unknown} error - L'error a processar. Pot ser de qualsevol tipus.
 * @returns {string} Un missatge d'error descriptiu i llegible per l'usuari.
 *
 * @example
 * try {
 *   // Codi que pot llançar un error
 * } catch (e) {
 *   const errorMessage = handleError(e);
 *   console.log(errorMessage); // Mostra el missatge d'error processat
 * }
 */
export function handleError(error: unknown): string {
  // Mostra l'error original a la consola per a propòsits de depuració.
  console.error(error);

  // Comprova si l'error és una instància d'AxiosError (errors de peticions HTTP amb Axios, utilitzat per Zodios).
  if (error instanceof AxiosError) {
    // Intenta obtenir el codi d'estat de la resposta o de la petició.
    const status = error.response?.status || error.request?.status;
    // Intenta obtenir el missatge d'error de les dades de la resposta,
    // del text d'estat de la resposta, o del missatge de l'error d'Axios.
    const message =
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message;

    return `Error HTTP ${status}: ${message}`;
  }

  // Comprova si l'error és un objecte que té una propietat 'message' de tipus string.
  // Això cobreix errors personalitzats o objectes d'error que no són instàncies d'Error.
  if (isErrorWithMessage(error)) {
    return error.message;
  }

  // Comprova si l'error és una instància genèrica d'Error.
  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again later.";
}

/**
 * Funció de guàrdia de tipus (type guard) per comprovar si un objecte desconegut
 * té una propietat 'message' de tipus string.
 *
 * @param {unknown} error - L'objecte a comprovar.
 * @returns {error is { message: string }} Retorna `true` si l'objecte té una propietat
 *                                         `message` de tipus string, si no, `false`.
 * @private
 */
function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    // Comprova si 'error' és un objecte.
    typeof error === "object" &&
    // Comprova si 'error' no és nul.
    error !== null &&
    // Comprova si 'message' és una propietat de l'objecte 'error'.
    "message" in error &&
    // Comprova si la propietat 'message' de l'objecte 'error' és de tipus string.
    // Es fa un cast a { message: unknown } per satisfer el compilador de TypeScript
    // dins d'aquesta comprovació més detallada.
    typeof (error as { message: unknown }).message === "string"
  );
}
