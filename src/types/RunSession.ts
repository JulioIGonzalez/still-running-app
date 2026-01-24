export type LatLngPoint = {
  lat: number;
  lng: number;
};

export type RunSession = {
  id: string;
  date: number; // Date.now()
  durationMs: number;
  distanceMeters: number;
  path: LatLngPoint[];
};
