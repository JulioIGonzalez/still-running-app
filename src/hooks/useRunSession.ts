import { useEffect, useRef, useState, useMemo } from 'react';
import { useGeolocation } from './useGeolocation';
import type { LatLngPoint, RunStatus, RunSession } from '../types/RunSession';

// ======================
// Utils
// ======================
export function haversineDistance(p1: LatLngPoint, p2: LatLngPoint) {
  const R = 6371000; // metros
  const toRad = (x: number) => (x * Math.PI) / 180;

  const dLat = toRad(p2.lat - p1.lat);
  const dLon = toRad(p2.lng - p1.lng);

  const lat1 = toRad(p1.lat);
  const lat2 = toRad(p2.lat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// ======================
// Hook
// ======================
export function useRunSession() {
  const [status, setStatus] = useState<RunStatus>('idle');
  const [path, setPath] = useState<LatLngPoint[]>([]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const { position } = useGeolocation();

  // ----------------------
  // Controls
  // ----------------------
  const start = () => {
    setPath([]);
    setElapsedMs(0);
    setStatus('running');
    setIsPaused(false);
  };

  const stop = (): RunSession | null => {
    if (path.length < 2) {
      setStatus('idle');
      return null;
    }

    const session: RunSession = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      durationMs: elapsedMs,
      distanceMeters: totalDistance,
      path,
    };

    setStatus('idle');
    setElapsedMs(0);
    setIsPaused(false);
    setPath([]);

    return session;
  };

  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);

  // ----------------------
  // Timer
  // ----------------------
  useEffect(() => {
    if (status !== 'running' || isPaused) {
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
  }, [status, isPaused]);

  // ----------------------
  // Track path
  // ----------------------
  useEffect(() => {
    if (status !== 'running' || isPaused || !position) return;

    setPath((prev) => [
      ...prev,
      { lat: position.lat, lng: position.lng },
    ]);
  }, [position, status, isPaused]);

  // ----------------------
  // Metrics
  // ----------------------
  const totalDistance = useMemo(() => {
    if (path.length < 2) return 0;

    return path.reduce((acc, curr, i, arr) => {
      if (i === 0) return 0;
      return acc + haversineDistance(arr[i - 1], curr);
    }, 0);
  }, [path]);

  const pace = useMemo(() => {
    if (elapsedMs === 0 || totalDistance === 0) return 0;

    const km = totalDistance / 1000;
    const minutes = elapsedMs / 1000 / 60;
    return minutes / km; // min/km
  }, [elapsedMs, totalDistance]);

  // ----------------------
  // API
  // ----------------------
  return {
    status,
    isRunning: status === 'running',
    isPaused,
    path,
    elapsedMs,
    totalDistance,
    pace,
    start,
    stop,
    pause,
    resume,
  };
}
