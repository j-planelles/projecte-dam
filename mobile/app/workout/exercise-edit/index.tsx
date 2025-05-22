import ExerciseEditPage from "./[uuid]";

/**
 * Pàgina per crear un nou exercici personalitzat.
 * Simplement reutilitza el component d'edició d'exercicis (`ExerciseEditPage`)
 * en mode creació.
 * @returns {JSX.Element} El component de la pàgina de creació d'exercicis.
 */
export default function ExerciseCreatePage() {
  return <ExerciseEditPage />;
}
