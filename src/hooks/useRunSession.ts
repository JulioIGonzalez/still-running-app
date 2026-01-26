import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useGeolocation } from './useGeolocation';
import type { LatLngPoint } from '../types/RunTypes';
import { saveSession } from '../types/RunStorage';


export type RunStatus = 'idle' | 'running' | 'paused';

export function haversineDistance(p1: LatLngPoint, p2: LatLngPoint) {
  const R = 6371000;
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

export function useRunSession() {
  const [status, setStatus] = useState<RunStatus>('idle');
  const [path, setPath] = useState<LatLngPoint[]>([]);
  const [elapsedMs, setElapsedMs] = useState(0);

  const totalDistance = useMemo(() => {
    if (path.length < 2) return 0;

    let dist = 0;
    for (let i = 1; i < path.length; i++) {
      dist += haversineDistance(path[i - 1], path[i]);
    }
    return dist;
  }, [path]);

  const intervalRef = useRef<number | null>(null);
  const { position } = useGeolocation();

  /* =========================
     CONTROLES
  ========================= */

  const start = useCallback(() => {
    setPath([]);
    setElapsedMs(0);
    setStatus('running');
  }, []);

  const pause = useCallback(() => {
    setStatus('paused');
  }, []);

  const resume = useCallback(() => {
    setStatus('running');
  }, []);

  const stop = useCallback(() => {
    if (path.length > 1) {
      saveSession({
        id: crypto.randomUUID(),
        date: Date.now(),
        durationMs: elapsedMs,
        distanceMeters: totalDistance,
        path,
      });
    }

    setStatus('idle');
    setElapsedMs(0);
    setPath([]);
  }, [path, elapsedMs, totalDistance]);

  /* =========================
     CRONÓMETRO
  ========================= */

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

  /* =========================
     GEOLOCALIZACIÓN
  ========================= */

  useEffect(() => {
    if (status !== 'running' || !position) return;

    setPath((prev) => [...prev, { lat: position.lat, lng: position.lng }]);
  }, [position, status]);

  /* =========================
     MÉTRICAS
  ========================= */



  const pace = useMemo(() => {
    if (elapsedMs === 0 || totalDistance === 0) return 0;
    return elapsedMs / 60000 / (totalDistance / 1000);
  }, [elapsedMs, totalDistance]);

  return {
    status,
    isRunning: status !== 'idle',
    isPaused: status === 'paused',
    path,
    elapsedMs,
    totalDistance,
    pace,
    start,
    pause,
    resume,
    stop,
  };
}
