import { useState } from 'react';
import MapView from '../components/MapView';
import { useRunSession } from '../hooks/useRunSession';
import { getSessions } from '../types/RunStorage';

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default function RunScreen() {
  const {
    isRunning,
    isPaused,
    path,
    elapsedMs,
    start,
    stop,
    pause,
    resume,
  } = useRunSession();

  const [showHistory, setShowHistory] = useState(false);
  const sessions = getSessions();

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* MAPA */}
      <MapView path={path} />

      {/* CRONÓMETRO */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'rgba(0,0,0,0.75)',
          color: 'white',
          padding: '14px 28px',
          borderRadius: 16,
          fontSize: 32,
          fontWeight: 700,
        }}
      >
        {formatTime(elapsedMs)}
      </div>

      {/* BOTÓN HISTORIAL */}
      <button
        onClick={() => setShowHistory(!showHistory)}
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 1000,
          padding: '12px 18px',
          borderRadius: 12,
          border: 'none',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: 16,
          background: 'rgba(2,6,23,0.85)',
          color: 'white',
          boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
        }}
      >
        📜 Historial
      </button>

      {/* CONTROLES PRINCIPALES */}
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          display: 'flex',
          gap: 16,
        }}
      >
        {!isRunning && (
          <button
            onClick={start}
            style={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              background: '#22c55e',
              border: 'none',
              fontSize: 18,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
            }}
          >
            ▶ Iniciar
          </button>
        )}
        {isRunning && !isPaused && (
          <button
            onClick={pause}
            style={{
              padding: '12px 20px',
              borderRadius: 12,
              background: '#f39c12',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            ⏸ Pausa
          </button>
        )}
        {isRunning && isPaused && (
          <button
            onClick={resume}
            style={{
              padding: '12px 20px',
              borderRadius: 12,
              background: '#27ae60',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            ▶ Reanudar
          </button>
        )}
        {isRunning && (
          <button
            onClick={stop}
            style={{
              padding: '12px 20px',
              borderRadius: 12,
              background: '#c0392b',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            ⏹ Stop
          </button>
        )}
      </div>

      {/* HISTORIAL FLOTANTE */}
      {showHistory && (
        <div
          style={{
            position: 'absolute',
            top: 80,
            left: '20px', // lo podés ajustar a '50%' y usar transformX(-50%) para centrar
            zIndex: 1200,
            width: 300,
            maxHeight: 400,
            overflowY: 'auto',
            padding: 16,
            background: 'rgba(0,0,0,0.75)',
            borderRadius: 16,
            backdropFilter: 'blur(6px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
            color: 'white',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>Historial</h3>
            <button
              onClick={() => setShowHistory(false)}
              style={{
                padding: '4px 8px',
                borderRadius: 999,
                border: 'none',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                fontWeight: 600,
              }}
            >
              ✕
            </button>
          </div>

          {sessions.length === 0 && <p style={{ opacity: 0.8 }}>No hay sesiones guardadas</p>}

          {sessions.map((s) => (
            <div
              key={s.id}
              style={{
                background: 'rgba(15,23,42,0.85)',
                padding: 10,
                borderRadius: 12,
                marginBottom: 10,
              }}
            >
              <div>📅 {new Date(s.date).toLocaleDateString()}</div>
              <div>⏱ {(s.durationMs / 60000).toFixed(1)} min</div>
              <div>📏 {(s.distanceMeters / 1000).toFixed(2)} km</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
