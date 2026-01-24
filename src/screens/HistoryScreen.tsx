import { getSessions } from '../types/RunStorage';
import { useNavigate } from 'react-router-dom';

export default function HistoryScreen() {
  const sessions = getSessions();
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f172a', // fondo oscuro
        color: 'white',
        padding: 20,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 20,
          gap: 12,
        }}
      >
        <button onClick={() => navigate('/run')}>⬅ Volver</button>
        <h2 style={{ margin: 0 }}>Historial de corridas</h2>
      </div>

      {/* SIN SESIONES */}
      {sessions.length === 0 && (
        <p style={{ opacity: 0.7 }}>
          No hay sesiones guardadas todavía.
        </p>
      )}

      {/* LISTA */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {sessions.map((s) => (
          <div
            key={s.id}
            style={{
              background: '#020617',
              borderRadius: 12,
              padding: 16,
              boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
            }}
          >
            <div style={{ fontSize: 14, opacity: 0.7 }}>
              📅 {new Date(s.date).toLocaleDateString()}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 8,
                fontSize: 16,
              }}
            >
              <div>⏱ {(s.durationMs / 60000).toFixed(1)} min</div>
              <div>📏 {(s.distanceMeters / 1000).toFixed(2)} km</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
