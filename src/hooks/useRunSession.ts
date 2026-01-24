import { useEffect, useRef, useState } from 'react';
import { useGeolocation } from './useGeolocation';

export type RunStatus = 'idle' | 'running';

export type LatLngPoint = {
  lat: number;
  lng: number;
};

export function useRunSession() {
  const [status, setStatus] = useState<RunStatus>('idle');
  const [path, setPath] = useState<LatLngPoint[]>([]);
  const [elapsedMs, setElapsedMs] = useState(0);

  const intervalRef = useRef<number | null>(null);
  const { position } = useGeolocation();

  const start = () => {
    setPath([]);
    setElapsedMs(0);
    setStatus('running');
  };

  const stop = () => {
    setStatus('idle');
  };

  // 🕒 CRONÓMETRO
  useEffect(() => {
    if (status !== 'running') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setElapsedMs((prev) => prev + 1000);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status]);

  // 📍 GPS PATH
  useEffect(() => {
    if (status !== 'running' || !position) return;

    setPath((prev) => [
      ...prev,
      { lat: position.lat, lng: position.lng },
    ]);
  }, [position, status]);

  return {
    status,
    isRunning: status === 'running',
    path,
    elapsedMs,
    start,
    stop,
  };
}
