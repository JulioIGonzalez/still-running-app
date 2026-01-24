import { useEffect, useState } from 'react';
import { useGeolocation } from './useGeolocation';

export type RunStatus = 'idle' | 'running';

export type LatLngPoint = {
  lat: number;
  lng: number;
};

export function useRunSession() {
  const [status, setStatus] = useState<RunStatus>('idle');
  const [path, setPath] = useState<LatLngPoint[]>([]);

  const { position } = useGeolocation();

  const start = () => {
    setPath([]);
    setStatus('running');
  };

  const stop = () => {
    setStatus('idle');
  };

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
    position,
    start,
    stop,
  };
}
