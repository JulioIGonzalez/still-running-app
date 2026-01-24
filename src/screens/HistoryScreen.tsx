import { getSessions } from '../types/RunStorage';

export default function HistoryScreen() {
  const sessions = getSessions();

  if (sessions.length === 0) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Historial</h2>
        <p>No hay sesiones guardadas</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Historial de corridas</h2>

      {sessions.map((s) => (
        <div
          key={s.id}
          style={{
            background: '#111',
            color: '#fff',
            padding: 12,
            marginBottom: 12,
            borderRadius: 8,
          }}
        >
          <div>📅 {new Date(s.date).toLocaleDateString()}</div>
          <div>⏱ {(s.durationMs / 60000).toFixed(1)} min</div>
          <div>📏 {(s.distanceMeters / 1000).toFixed(2)} km</div>
        </div>
      ))}
    </div>
  );
}
