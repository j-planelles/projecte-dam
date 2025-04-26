import { useState, useEffect, useRef, useCallback } from "react";

export const useTimer = (
  initialTime = 0,
): {
  isRunning: boolean;
  elapsedTime: number;
  formattedTime: string;
  start: (startTime: number) => void;
  pause: () => void;
  reset: () => void;
} => {
  const [elapsedTime, setElapsedTime] = useState<number>(initialTime);
  const [isRunning, setIsRunning] = useState<boolean>(false);

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
    (startTime: number) => {
      if (isRunning) return;

      setIsRunning(true);
      lastTimeRef.current = startTime;

      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const deltaTime = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;

        setElapsedTime((prevTime) => prevTime + deltaTime);
      }, 100);
    },
    [isRunning],
  );

  const pause = useCallback(() => {
    if (!isRunning) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsRunning(false);
  }, [isRunning]);

  const reset = useCallback(() => {
    pause();
    setElapsedTime(initialTime);
  }, [pause, initialTime]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isRunning,
    elapsedTime,
    formattedTime: formatTime(elapsedTime),
    start,
    pause,
    reset,
  };
};
