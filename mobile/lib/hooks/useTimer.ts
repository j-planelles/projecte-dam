import { useState, useEffect, useRef, useCallback } from "react";

/**
 * @typedef TimerHookResult
 * @description L'objecte retornat pel hook `useTimer`.
 * @property {boolean} isRunning - Indica si el cronòmetre està actualment en marxa.
 * @property {number} elapsedTime - El temps total transcorregut en segons.
 * @property {string} formattedTime - El temps transcorregut formatat com una cadena "MM:SS".
 * @property {(startTime: number) => void} start - Funció per iniciar o reprendre el cronòmetre.
 *                                                `startTime` hauria de ser `Date.now()` en el moment de començar.
 * @property {() => void} pause - Funció per pausar el cronòmetre.
 * @property {() => void} reset - Funció per aturar el cronòmetre i restablir el temps transcorregut al seu valor inicial.
 */
type TimerHookResult = {
  isRunning: boolean;
  elapsedTime: number;
  formattedTime: string;
  start: (startTime: number) => void;
  pause: () => void;
  reset: () => void;
};

/**
 * Hook personalitzat de React per gestionar la funcionalitat d'un cronòmetre.
 *
 * @param {number} [initialTime=0] - El temps inicial en segons amb el qual començarà el cronòmetre.
 *                                   Per defecte és 0.
 * @returns {TimerHookResult} Un objecte amb l'estat del cronòmetre i funcions per controlar-lo.
 */
export const useTimer = (initialTime = 0): TimerHookResult => {
  // Estat per al temps transcorregut en segons
  const [elapsedTime, setElapsedTime] = useState<number>(initialTime);
  // Estat per indicar si el cronòmetre està en marxa
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Ref per emmagatzemar l'ID de l'interval per poder netejar-lo
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // Ref per emmagatzemar el timestamp de l'última actualització per calcular el delta de temps amb precisió
  const lastTimeRef = useRef<number>(0);

  /**
   * Formata un temps donat en segons a una cadena MM:SS.
   * @param {number} timeInSeconds - El temps en segons a formatar.
   * @returns {string} El temps formatat.
   */
  const formatTime = useCallback((timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    const formattedMinutes = minutes.toString();
    const formattedSeconds = seconds.toString().padStart(2, "0"); // Afegeix un zero al davant si és necessari

    return `${formattedMinutes}:${formattedSeconds}`;
  }, []); // Aquesta funció no té dependències ja que no depèn de cap variable externa

  /**
   * Inicia o reprèn el cronòmetre.
   * @param {number} startTime - El timestamp (obtingut amb `Date.now()`) del moment en què es crida a start.
   *                             S'utilitza com a referència per calcular el temps transcorregut de manera precisa.
   */
  const start = useCallback(
    (startTime: number) => {
      // Si ja està en marxa, no fem res
      if (isRunning) return;

      setIsRunning(true);
      // Estableix el punt de referència temporal per al càlcul del delta
      lastTimeRef.current = startTime;

      // Neteja qualsevol interval previ per seguretat (encara que `isRunning` ho hauria d'evitar)
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Configura un nou interval per actualitzar el temps transcorregut
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        // Calcula el temps transcorregut des de l'última actualització
        const deltaTime = (now - lastTimeRef.current) / 1000; // Convertir a segons
        lastTimeRef.current = now; // Actualitza l'últim temps registrat

        // Actualitza el temps transcorregut acumulant el delta
        setElapsedTime((prevTime) => prevTime + deltaTime);
      }, 100); // Interval d'actualització (100ms per un recompte fluid)
    },
    [isRunning], // Depèn de `isRunning` per evitar múltiples intervals
  );

  /**
   * Pausa el cronòmetre.
   * Atura l'interval d'actualització i marca el cronòmetre com a no actiu.
   */
  const pause = useCallback(() => {
    // Si no està en marxa, no fem res
    if (!isRunning) return;

    // Neteja l'interval si existeix
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null; // Allibera la referència de l'interval
    }

    setIsRunning(false); // Marca el cronòmetre como a inactiu
  }, [isRunning]); // Depèn de `isRunning`

  /**
   * Reinicia el cronòmetre.
   * Atura el cronòmetre (si està en marxa) i restableix el temps transcorregut al valor inicial.
   */
  const reset = useCallback(() => {
    pause(); // Primer, pausa el cronòmetre per aturar qualsevol interval
    setElapsedTime(initialTime); // Restableix el temps transcorregut a l'estat inicial
  }, [pause, initialTime]); // Depèn de `pause` i `initialTime`

  // Efecte de neteja per quan el component que utilitza el hook es desmunta.
  // Això és crucial per evitar fuites de memòria i execucions d'intervals no desitjades.
  useEffect(() => {
    return () => {
      // Assegura que l'interval es neteja en desmuntar el component
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); // S'executa només un cop en muntar (per retornar la funció de neteja) i desmuntar

  // Retorna l'estat actual del cronòmetre i les funcions per controlar-lo.
  return {
    isRunning,
    elapsedTime,
    formattedTime: formatTime(elapsedTime), // El temps formatat es calcula en cada renderització si `elapsedTime` canvia
    start,
    pause,
    reset,
  };
};
