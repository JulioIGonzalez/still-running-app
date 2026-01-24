import type { LatLngPoint } from './RunTypes';

export type StoredRunSession = {
  id: string;
  date: number; // 👈 TIMESTAMP
  durationMs: number;
  distanceMeters: number;
  path: LatLngPoint[];
};

const STORAGE_KEY = 'run_sessions';

export function getSessions(): StoredRunSession[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as StoredRunSession[];
  } catch {
    return [];
  }
}

export function saveSession(session: StoredRunSession) {
  const sessions = getSessions();
  sessions.unshift(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}
