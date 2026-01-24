import type { RunSession } from '../types/RunSession';

const STORAGE_KEY = 'run_sessions';

export function getRunSessions(): RunSession[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

export function saveRunSession(session: RunSession) {
  const runs = getRunSessions();
  runs.push(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(runs));
}
