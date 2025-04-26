import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";

// Split into two separate contexts
type TimerControlType = {
  isRunning: boolean;
  start: (customDuration?: number) => void;
  skip: () => void;
  duration: number;
  currentDuration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
};

type TimerDisplayType = {
  remainingTime: number;
  formattedTime: string;
};

// Create separate contexts
const TimerControlContext = createContext<TimerControlType | undefined>(
  undefined,
);
const TimerDisplayContext = createContext<TimerDisplayType | undefined>(
  undefined,
);

export const RestCountdownProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [userDuration, setUserDuration] = useState<number>(60);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimeRef = useRef<number>(0);

  const formatTime = useCallback((timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    const formattedMinutes = minutes.toString();
    const formattedSeconds = seconds.toString().padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  }, []);

  const start = useCallback(
    (customDuration?: number) => {
      if (isRunning) return;

      const actualDuration = customDuration ? customDuration : userDuration;

      setDuration(actualDuration);
      setElapsedTime(0);
      setIsRunning(true);
      lastTimeRef.current = Date.now();

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const deltaTime = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;

        setElapsedTime((prevTime) => {
          const newTime = prevTime + deltaTime;
          if (newTime >= actualDuration) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            setIsRunning(false);
            return actualDuration;
          }
          return newTime;
        });
      }, 100);
    },
    [isRunning, userDuration],
  );

  const skip = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const remainingTime = Math.max(0, duration - elapsedTime);

  // Memoize the control context value (changes infrequently)
  const controlValue = useMemo(
    () => ({
      isRunning,
      start,
      skip,
      duration: userDuration,
      currentDuration: duration,
      setDuration: setUserDuration,
    }),
    [isRunning, start, skip, duration, userDuration],
  );

  // Display context value (changes frequently)
  const displayValue = useMemo(
    () => ({
      remainingTime,
      formattedTime: formatTime(remainingTime),
    }),
    [remainingTime, formatTime],
  );

  return (
    <TimerControlContext.Provider value={controlValue}>
      <TimerDisplayContext.Provider value={displayValue}>
        {children}
      </TimerDisplayContext.Provider>
    </TimerControlContext.Provider>
  );
};

// Separate hooks for different needs
export const useRestCountdownControl = (): TimerControlType => {
  const context = useContext(TimerControlContext);
  if (context === undefined) {
    throw new Error(
      "useRestCountdownControl must be used within a RestCountdownProvider",
    );
  }
  return context;
};

export const useRestCountdownDisplay = (): TimerDisplayType => {
  const context = useContext(TimerDisplayContext);
  if (context === undefined) {
    throw new Error(
      "useRestCountdownDisplay must be used within a RestCountdownProvider",
    );
  }
  return context;
};

// Provide the complete API for components that need everything
export const useRestCountdown = (): TimerControlType & TimerDisplayType => {
  const control = useRestCountdownControl();
  const display = useRestCountdownDisplay();
  return { ...control, ...display };
};
