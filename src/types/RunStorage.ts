import type { RunSession } from '../types/RunSession';

const STORAGE_KEY = 'runner_sessions';

export function getSessions(): RunSession[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveSession(session: RunSession) {
  const sessions = getSessions();
  sessions.unshift(session); // la más nueva arriba
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}
