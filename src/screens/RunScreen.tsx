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
  const [mapZoom, setMapZoom] = useState(13); // control de zoom
  const sessions = getSessions();

  const zoomIn = () => setMapZoom((z) => Math.min(z + 1, 20));
  const zoomOut = () => setMapZoom((z) => Math.max(z - 1, 1));

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* MAPA */}
      <MapView path={path} zoom={mapZoom} />

      {/* CRONÓMETRO */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'rgba(0, 0, 0, 0.53)',
          color: 'white',
          padding: '14px 28px',
          borderRadius: 18,
          fontSize: 28,
          fontWeight: 700,
        }}
      >
        {formatTime(elapsedMs)}
      </div>

      {/* BOTÓN HISTORIAL */}
      <button
        onClick={() => setShowHistory(true)}
        style={{
          position: 'absolute',
          top: 90,
          right: 20,
          zIndex: 1000,
          padding: '14px 20px',
          fontSize: 18,
          fontWeight: 600,
          borderRadius: 16,
          border: 'none',
          cursor: 'pointer',
          background: 'rgba(18, 35, 110, 0.56)',
          color: 'white',
          boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
        }}
      >
        📜 Historial
      </button>

      {/* CONTROLES DE INICIO/PAUSA/STOP */}
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
              width: 90,
              height: 90,
              padding: '14px 20px',
              borderRadius: '50%',
              background: '#facc15',
              border: 'none',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
            }}
          >
            ⏸ Pausa
          </button>
        )}
        {isRunning && isPaused && (
          <button
            onClick={resume}
            style={{
              padding: '14px 20px',
              width: 90,
              height: 90,
              borderRadius: '50%',
              background: '#22dc76ff',
              border: 'none',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
            }}
          >
            ▶ Reanudar
          </button>
        )}
        {isRunning && (
          <button
            onClick={stop}
            style={{
              height: 90,
              width: 90,
              padding: '14px 20px',
              borderRadius: '50%',
              background: '#ef4444',
              border: 'none',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
            }}
          >
            ⏹ Stop
          </button>
        )}
      </div>

      {/* BOTONES DE ZOOM (lado derecho medio) */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          right: 20,
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          zIndex: 1000,
        }}
      >
        <button
          onClick={zoomIn}
          style={{
            width: 50,
            height: 50,
            borderRadius: 12,
            background: '#3b82f6',
            border: 'none',
            fontSize: 24,
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
          }}
        >
          +
        </button>
        <button
          onClick={zoomOut}
          style={{
            width: 50,
            height: 50,
            borderRadius: 12,
            background: '#ef4444',
            border: 'none',
            fontSize: 24,
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
          }}
        >
          –
        </button>
      </div>

      {/* HISTORIAL FLOTANTE */}
      {showHistory && (
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: '20px',
            width: '300px',
            maxHeight: '70%',
            zIndex: 1200,
            padding: 20,
            overflowY: 'auto',
            color: 'white',
            background: 'rgba(2,6,23,0.75)',
            backdropFilter: 'blur(8px)',
            borderRadius: 16,
            boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
            transition: 'opacity 0.3s ease',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <h3 style={{ margin: 0 }}>Historial</h3>
            <button
              onClick={() => setShowHistory(false)}
              style={{
                padding: '6px 10px',
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
                padding: 12,
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
