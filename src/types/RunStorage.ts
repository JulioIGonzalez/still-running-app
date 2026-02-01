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

export function getSessionById(id: string): StoredRunSession | null {
  return getSessions().find((s) => s.id === id) ?? null;
}

export function deleteSession(id: string) {
  const sessions = getSessions().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function saveSession(session: StoredRunSession) {
  const sessions = getSessions();
  sessions.unshift(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}
