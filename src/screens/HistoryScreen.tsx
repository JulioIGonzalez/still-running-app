import { useEffect, useState } from 'react';
import { RunStorage, StoredRunSession } from '../types/RunStorage';

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const formatDistance = (meters: number) => {
  return (meters / 1000).toFixed(2);
};

export default function HistoryScreen() {
  const [sessions, setSessions] = useState<StoredRunSession[]>([]);

  useEffect(() => {
    setSessions(RunStorage.getAll());
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f172a',
        color: 'white',
        padding: 20,
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>
        📜 Historial de sesiones
      </h1>

      {sessions.length === 0 && (
        <p style={{ opacity: 0.7 }}>
          No hay sesiones guardadas todavía.
        </p>
      )}

      {sessions.map((session) => (
        <div
          key={session.id}
          style={{
            background: '#020617',
            borderRadius: 14,
            padding: 16,
            marginBottom: 14,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ fontSize: 13, opacity: 0.6 }}>
            {new Date(session.createdAt).toLocaleString()}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 10,
              fontSize: 16,
            }}
          >
            <span>⏱ {formatTime(session.elapsedMs)}</span>
            <span>📏 {formatDistance(session.totalDistance)} km</span>
          </div>
        </div>
      ))}
    </div>
  );
}
