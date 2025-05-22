import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// Es divideix en dos contextos separats per optimitzar les re-renderitzacions.
// Els components que només necessiten controlar el temporitzador no es tornaran a renderitzar
// quan canviï el temps restant, i viceversa.

/**
 * @typedef TimerControlType
 * @description Defineix el tipus per a les propietats i funcions de control del temporitzador.
 * @property {boolean} isRunning - Indica si el temporitzador està en marxa.
 * @property {(customDuration?: number) => void} start - Funció per iniciar el temporitzador. Pot acceptar una durada personalitzada opcional.
 * @property {() => void} skip - Funció per aturar/saltar el temporitzador actual.
 * @property {number} duration - La durada configurada per l'usuari per al temporitzador (per defecte o l'última establerta).
 * @property {number} currentDuration - La durada real del cicle de temporitzador actual (pot ser `customDuration` o `duration`).
 * @property {React.Dispatch<React.SetStateAction<number>>} setDuration - Funció per actualitzar la durada per defecte del temporitzador.
 */
type TimerControlType = {
  isRunning: boolean;
  start: (customDuration?: number) => void;
  skip: () => void;
  duration: number; // Durada configurada per l'usuari
  currentDuration: number; // Durada del cicle actual
  setDuration: React.Dispatch<React.SetStateAction<number>>;
};

/**
 * @typedef TimerDisplayType
 * @description Defineix el tipus per a les propietats de visualització del temporitzador.
 * @property {number} remainingTime - El temps restant en segons.
 * @property {string} formattedTime - El temps restant formatat com a cadena (MM:SS).
 */
type TimerDisplayType = {
  remainingTime: number;
  formattedTime: string;
};

// Creació de contextos separats

/**
 * @constant TimerControlContext
 * @description Context de React per proporcionar les funcions de control del temporitzador.
 * @type {React.Context<TimerControlType | undefined>}
 */
const TimerControlContext = createContext<TimerControlType | undefined>(
  undefined,
);

/**
 * @constant TimerDisplayContext
 * @description Context de React per proporcionar les dades de visualització del temporitzador.
 * @type {React.Context<TimerDisplayType | undefined>}
 */
const TimerDisplayContext = createContext<TimerDisplayType | undefined>(
  undefined,
);

/**
 * @component RestCountdownProvider
 * @description Proveïdor de context que gestiona la lògica del temporitzador de compte enrere
 * i proporciona accés a les seves funcions de control i dades de visualització
 * a través de contextos separats.
 * @param {object} props - Propietats del component.
 * @param {React.ReactNode} props.children - Components fills que tindran accés als contextos del temporitzador.
 * @returns {JSX.Element} El proveïdor de context amb els seus fills.
 */
export const RestCountdownProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Estat per al temps transcorregut des de l'inici del temporitzador actual
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  // Estat per indicar si el temporitzador està en marxa
  const [isRunning, setIsRunning] = useState<boolean>(false);
  // Estat per a la durada del cicle de temporitzador actual
  const [duration, setDuration] = useState<number>(0);
  // Estat per a la durada per defecte configurada per l'usuari (inicialitzada a 60 segons)
  const [userDuration, setUserDuration] = useState<number>(60);

  // Ref per emmagatzemar l'ID de l'interval per poder netejar-lo
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // Ref per emmagatzemar el timestamp de l'última actualització per calcular el delta de temps
  const lastTimeRef = useRef<number>(0);

  /**
   * @function formatTime
   * @description Formata un temps donat en segons a una cadena MM:SS.
   * @param {number} timeInSeconds - El temps en segons a formatar.
   * @returns {string} El temps formatat.
   */
  const formatTime = useCallback((timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    const formattedMinutes = minutes.toString();
    const formattedSeconds = seconds.toString().padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  }, []);

  /**
   * @function start
   * @description Inicia el temporitzador.
   * Si ja està en marxa, no fa res.
   * Utilitza `customDuration` si es proporciona, si no utilitza `userDuration`.
   * @param {number} [customDuration] - Durada opcional en segons per al cicle actual del temporitzador.
   */
  const start = useCallback(
    (customDuration?: number) => {
      // Si ja està en marxa, no fem res
      if (isRunning) return;

      // Determina la durada real per a aquest cicle del temporitzador
      const actualDuration = customDuration ? customDuration : userDuration;

      setDuration(actualDuration); // Estableix la durada per al cicle actual
      setElapsedTime(0); // Reinicia el temps transcorregut
      setIsRunning(true); // Marca el temporitzador com a actiu
      lastTimeRef.current = Date.now(); // Emmagatzema el temps d'inici

      // Neteja qualsevol interval previ existent
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Configura un nou interval per actualitzar el temps transcorregut
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        // Calcula el temps transcorregut des de l'última actualització
        const deltaTime = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now; // Actualitza l'últim temps

        setElapsedTime((prevTime) => {
          const newTime = prevTime + deltaTime;
          // Si el nou temps supera o iguala la durada, atura el temporitzador
          if (newTime >= actualDuration) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            setIsRunning(false); // Marca el temporitzador com a inactiu
            return actualDuration; // Assegura que el temps transcorregut no superi la durada
          }
          return newTime; // Actualitza el temps transcorregut
        });
      }, 100); // L'interval s'executa cada 100ms per una actualització fluida
    },
    [isRunning, userDuration], // Dependències de la funció `start`
  );

  /**
   * @function skip
   * @description Atura el temporitzador actual i el marca com a no actiu.
   * Neteja l'interval si n'hi ha un.
   */
  const skip = useCallback(() => {
    // Neteja l'interval si existeix
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false); // Marca el temporitzador com a inactiu
  }, []); // No té dependències, ja que només modifica refs i estat

  // Efecte de neteja per quan el component es desmunta
  useEffect(() => {
    return () => {
      // Assegura que l'interval es neteja en desmuntar el component
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []); // S'executa només un cop en muntar/desmuntar

  // Calcula el temps restant, assegurant que no sigui negatiu
  const remainingTime = Math.max(0, duration - elapsedTime);

  // Memoïza el valor del context de control.
  // Aquest valor només canvia si `isRunning`, `start`, `skip`, `duration` (actual) o `userDuration` canvien.
  // `start` i `skip` estan embolicats en `useCallback` i només canvien si les seves dependències canvien.
  const controlValue = useMemo(
    () => ({
      isRunning,
      start,
      skip,
      duration: userDuration, // Exposa la durada configurada per l'usuari
      currentDuration: duration, // Exposa la durada del cicle actual
      setDuration: setUserDuration, // Permet canviar la durada per defecte
    }),
    [isRunning, start, skip, duration, userDuration],
  );

  // Memoïza el valor del context de visualització.
  // Aquest valor canvia freqüentment (cada vegada que `remainingTime` canvia).
  // `formatTime` està embolicat en `useCallback` i és estable.
  const displayValue = useMemo(
    () => ({
      remainingTime,
      formattedTime: formatTime(remainingTime),
    }),
    [remainingTime, formatTime],
  );

  // Proporciona els valors dels contextos als components fills
  return (
    <TimerControlContext.Provider value={controlValue}>
      <TimerDisplayContext.Provider value={displayValue}>
        {children}
      </TimerDisplayContext.Provider>
    </TimerControlContext.Provider>
  );
};

// Hooks personalitzats per accedir als contextos de forma separada

/**
 * @hook useRestCountdownControl
 * @description Hook personalitzat per accedir a les funcions de control del temporitzador.
 * Llança un error si s'utilitza fora d'un `RestCountdownProvider`.
 * @returns {TimerControlType} L'objecte amb les funcions i estats de control del temporitzador.
 * @throws {Error} Si el hook no s'utilitza dins d'un `RestCountdownProvider`.
 */
export const useRestCountdownControl = (): TimerControlType => {
  const context = useContext(TimerControlContext);
  // Comprova si el context és undefined, la qual cosa indica que el hook no s'està utilitzant dins del proveïdor
  if (context === undefined) {
    throw new Error(
      "useRestCountdownControl ha d'utilitzar-se dins d'un RestCountdownProvider",
    );
  }
  return context;
};

/**
 * @hook useRestCountdownDisplay
 * @description Hook personalitzat per accedir a les dades de visualització del temporitzador.
 * Llança un error si s'utilitza fora d'un `RestCountdownProvider`.
 * @returns {TimerDisplayType} L'objecte amb les dades de visualització del temporitzador.
 * @throws {Error} Si el hook no s'utilitza dins d'un `RestCountdownProvider`.
 */
export const useRestCountdownDisplay = (): TimerDisplayType => {
  const context = useContext(TimerDisplayContext);
  // Comprova si el context és undefined
  if (context === undefined) {
    throw new Error(
      "useRestCountdownDisplay ha d'utilitzar-se dins d'un RestCountdownProvider",
    );
  }
  return context;
};

/**
 * @hook useRestCountdown
 * @description Hook personalitzat per accedir tant a les funcions de control com a les dades de visualització del temporitzador.
 * Combina els resultats de `useRestCountdownControl` i `useRestCountdownDisplay`.
 * @returns {TimerControlType & TimerDisplayType} Un objecte que combina les propietats de control i visualització.
 * @throws {Error} Si el hook no s'utilitza dins d'un `RestCountdownProvider` (delegat als hooks interns).
 */
export const useRestCountdown = (): TimerControlType & TimerDisplayType => {
  const control = useRestCountdownControl();
  const display = useRestCountdownDisplay();
  // Combina els dos objectes de context en un de sol
  return { ...control, ...display };
};
