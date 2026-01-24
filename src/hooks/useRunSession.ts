import { useEffect, useRef, useState, useMemo } from 'react';
import { useGeolocation } from './useGeolocation';
import { haversineDistance } from '../utils/distance';

export type RunStatus = 'idle' | 'running';
export type LatLngPoint = { lat: number; lng: number };

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

  // Cronómetro
  useEffect(() => {
    if (status !== 'running') {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setElapsedMs((prev) => prev + 1000);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [status]);

  // Guardar path
  useEffect(() => {
    if (status !== 'running' || !position) return;

    setPath((prev) => [...prev, { lat: position.lat, lng: position.lng }]);
  }, [position, status]);

  // Distancia total calculada con useMemo
  const totalDistance = useMemo(() => {
    if (path.length < 2) return 0;
    return path.reduce((acc, curr, i, arr) => {
      if (i === 0) return 0;
      return acc + haversineDistance(arr[i - 1], curr);
    }, 0);
  }, [path]);

  return {
    status,
    isRunning: status === 'running',
    path,
    elapsedMs,
    totalDistance, // <--- agregamos
    start,
    stop,
  };
}
