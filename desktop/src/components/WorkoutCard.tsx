import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

/**
 * Targeta resum d'un entrenament.
 * Mostra el títol, descripció, data, durada i un resum dels exercicis.
 * Permet personalitzar la visualització i afegir un handler de clic.
 * @param workout L'entrenament a mostrar.
 * @param onClick Handler opcional per al clic a la targeta.
 * @param className Classe CSS opcional.
 * @param showDescription Si es mostra la descripció (per defecte true).
 * @param showTimestamp Si es mostra la data i durada (per defecte true).
 * @returns {JSX.Element} El component de targeta d'entrenament.
 */
export default function WorkoutCard({
  workout,
  onClick,
  className,
  showDescription = true,
  showTimestamp = true,
}: {
  workout: workout;
  onClick?: () => void;
  className?: string;
  showDescription?: boolean;
  showTimestamp?: boolean;
}) {
  return (
    <Card variant="outlined" onClick={onClick} className={className}>
      <CardActionArea>
        <CardContent>
          <Typography variant="h6" component="div">
            {workout.title}
          </Typography>
          {showDescription && workout.description && (
            <Typography gutterBottom variant="body1" component="div">
              {workout.description}
            </Typography>
          )}
          {showTimestamp && workout.timestamp && (
            <Typography gutterBottom variant="body2" component="div">
              {parseTimestamp(workout.timestamp, workout.duration)}
            </Typography>
          )}
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {parseExercises(workout.exercises).map((exercise, index) => (
              <div key={index}>{exercise}</div>
            ))}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

/**
 * Dona format a la data i durada de l'entrenament.
 * @param timestamp Data d'inici de l'entrenament (en ms).
 * @param duration Durada de l'entrenament (en segons).
 * @returns {string} Data i durada en format llegible.
 */
const parseTimestamp = (timestamp: number, duration: number) => {
  const timestampDate = new Date(timestamp);
  const durationSeconds = Math.trunc(duration % 60);
  const durationMinutes = Math.trunc(duration / 60);
  const durationText = `${durationMinutes}:${String(durationSeconds).padStart(2, "0")}`;

  return `${timestampDate.toLocaleString()} for ${durationText}`;
};

/**
 * Dona format a la llista d'exercicis per mostrar un resum.
 * Mostra fins a 4 exercicis, després indica quants més n'hi ha.
 * @param exercises Llista d'exercicis de l'entrenament.
 * @returns {string[]} Resum dels exercicis.
 */
const parseExercises = (exercises: workoutExercise[]) =>
  exercises.length <= 4
    ? exercises.map((value) => `${value.sets.length}x ${value.exercise.name}`)
    : [
        ...exercises
          .slice(0, 3)
          .map((value) => `${value.sets.length}x ${value.exercise.name}`),
        `${exercises.slice(3).length} exercises more...`,
      ];
