/**
 * @typedef WeightUnit
 * @description Defineix les unitats de pes que es poden utilitzar.
 * - `metric`: Unitats mètriques (ex: quilograms).
 * - `imperial`: Unitats imperials (ex: lliures).
 */
type WeightUnit = "metric" | "imperial";

/**
 * @typedef exercise
 * @description Defineix l'estructura d'un exercici.
 * @property {string} uuid - Identificador únic universal de l'exercici.
 * @property {string} name - Nom de l'exercici.
 * @property {"barbell" | "dumbell" | "machine" | "other" | "bodyweight" | "assisted-bodyweight" | "reps-only" | "cardio" | "duration" | "countdown"} type - Tipus d'exercici.
 *   - `barbell`: Exercici amb barra.
 *   - `dumbell`: Exercici amb manuelles.
 *   - `machine`: Exercici amb màquina.
 *   - `other`: Altre tipus d'exercici amb pes.
 *   - `bodyweight`: Exercici amb pes corporal.
 *   - `assisted-bodyweight`: Exercici amb pes corporal assistit.
 *   - `reps-only`: Exercici només de repeticions (sense pes).
 *   - `cardio`: Exercici cardiovascular (registra distància/temps).
 *   - `duration`: Exercici basat en durada (registra temps).
 *   - `countdown`: Exercici amb compte enrere.
 * @property {"none" | "arms" | "back" | "shoulders" | "cardio" | "chest" | "core" | "full-body" | "legs" | "olympic" | "other"} bodyPart - Part del cos principal treballada per l'exercici.
 *   - `none`: Cap part específica / no aplicable.
 *   - `arms`: Braços.
 *   - `back`: Esquena.
 *   - `shoulders`: Espatlles.
 *   - `cardio`: Cardiovascular.
 *   - `chest`: Pit.
 *   - `core`: Nucli (abdominals, lumbars).
 *   - `full-body`: Cos sencer.
 *   - `legs`: Cames.
 *   - `olympic`: Aixecaments olímpics.
 *   - `other`: Altra part del cos.
 * @property {string} [description] - Descripció opcional de l'exercici.
 */
type exercise = {
  uuid: string;
  name: string;
  type:
    | "barbell" // Barra
    | "dumbell" // Manuelles
    | "machine" // Màquina
    | "other" // Altres (amb pes)
    | "bodyweight" // Pes corporal
    | "assisted-bodyweight" // Pes corporal assistit
    | "reps-only" // Només repeticions
    | "cardio" // Cardio (distància/temps)
    | "duration" // Durada (temps)
    | "countdown"; // Compte enrere
  bodyPart:
    | "none" // Cap
    | "arms" // Braços
    | "back" // Esquena
    | "shoulders" // Espatlles
    | "cardio" // Cardio
    | "chest" // Pit
    | "core" // Core
    | "full-body" // Cos sencer
    | "legs" // Cames
    | "olympic" // Olímpic
    | "other"; // Altres
  description?: string; // Descripció opcional
};

/**
 * @typedef exerciseList
 * @description Defineix un element d'una llista d'exercicis, estenent el tipus `exercise`.
 * S'utilitza per a exercicis que poden ser predeterminats o personalitzats.
 * @property {boolean} isDefault - Indica si l'exercici és un exercici predeterminat del sistema.
 * @property {string} default_exercise_uuid - Si `isDefault` és `false` (exercici personalitzat),
 *                                            aquest camp pot contenir l'UUID de l'exercici predeterminat
 *                                            en el qual es basa (si escau).
 */
type exerciseList = exercise & {
  isDefault: boolean; // Indica si és un exercici per defecte
  default_exercise_uuid: string; // UUID de l'exercici per defecte base (si no és per defecte)
};

/**
 * @typedef exerciseSet
 * @description Defineix una sèrie dins d'un exercici d'entrenament.
 * @property {number} reps - Nombre de repeticions realitzades o objectiu.
 * @property {number} weight - Pes utilitzat en la sèrie (en la unitat especificada a `workoutExercise`).
 *                             Pot ser 0 si no s'aplica pes (ex: exercicis de pes corporal o només repeticions).
 * @property {boolean} [complete] - Indica si la sèrie s'ha completat. Opcional.
 * @property {"normal" | "dropset" | "failture"} type - Tipus de sèrie.
 *   - `normal`: Sèrie estàndard.
 *   - `dropset`: Sèrie descendent (reducció de pes sense descans).
 *   - `failture`: Sèrie portada a la fallada muscular.
 */
type exerciseSet = {
  reps: number; // Repeticions
  weight: number; // Pes
  complete?: boolean; // Indica si la sèrie està completada
  type: "normal" | "dropset" | "failture"; // Tipus de sèrie
};

/**
 * @typedef workoutExercise
 * @description Defineix un exercici dins d'un entrenament específic, incloent les seves sèries.
 * @property {exercise} exercise - L'objecte de l'exercici base.
 * @property {exerciseSet[]} sets - Array de sèries realitzades o planificades per a aquest exercici.
 * @property {WeightUnit} [weightUnit] - Unitat de pes utilitzada per a les sèries d'aquest exercici (`metric` o `imperial`). Opcional.
 * @property {number} [restCountdownDuration] - Durada del compte enrere de descans (en segons) després d'aquest exercici. Opcional.
 */
type workoutExercise = {
  exercise: exercise; // L'exercici en si
  sets: exerciseSet[]; // Les sèries de l'exercici
  weightUnit?: WeightUnit; // Unitat de pes per a aquest exercici
  restCountdownDuration?: number; // Durada del descans en segons
};

/**
 * @typedef workout
 * @description Defineix l'estructura d'un entrenament completat o planificat.
 * @property {string} [uuid] - Identificador únic universal de l'entrenament. Opcional (pot no existir si l'entrenament encara no s'ha desat).
 * @property {string} title - Títol de l'entrenament.
 * @property {number} timestamp - Marca de temps Unix (en mil·lisegons) de quan es va realitzar o es va crear l'entrenament.
 * @property {number} duration - Durada total de l'entrenament en segons.
 * @property {string} description - Descripció o notes addicionals sobre l'entrenament.
 * @property {workoutExercise[]} exercises - Array d'exercicis que componen l'entrenament.
 */
type workout = {
  uuid?: string; // UUID de l'entrenament, opcional
  title: string; // Títol de l'entrenament
  timestamp: number; // Data i hora (Unix timestamp en ms)
  duration: number; // Durada en segons
  description: string; // Descripció
  exercises: workoutExercise[]; // Llista d'exercicis de l'entrenament
};

/**
 * @typedef message
 * @description Defineix l'estructura d'un missatge de xat.
 * @property {number} timestamp - Marca de temps Unix (en mil·lisegons) de quan es va enviar el missatge.
 * @property {string} content - Contingut textual del missatge.
 * @property {boolean} sentByTrainer - Indica si el missatge va ser enviat per l'entrenador (`true`) o per l'usuari (`false`).
 */
type message = {
  timestamp: number; // Data i hora (Unix timestamp en ms)
  content: string; // Contingut del missatge
  sentByTrainer: boolean; // True si l'envia l'entrenador, false si l'envia l'usuari
};

/**
 * @typedef user
 * @description Defineix l'estructura d'un usuari.
 * @property {string} uuid - Identificador únic universal de l'usuari.
 * @property {string} username - Nom d'usuari.
 * @property {string} name - Nom complet de l'usuari.
 * @property {string} [description] - Descripció opcional de l'usuari.
 */
type user = {
  uuid: string;
  username: string;
  name: string;
  description?: string;
};