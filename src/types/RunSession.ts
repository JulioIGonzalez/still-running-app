export type LatLngPoint = {
  lat: number;
  lng: number;
};

export type RunStatus = 'idle' | 'running';

export type RunSession = {
  id: string;
  date: string; // ISO string
  durationMs: number;
  distanceMeters: number;
  path: LatLngPoint[];
};
