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

const getPaceColor = (pace: number) => {
  if (pace === 0) return '#9ca3af'; // gris
  if (pace < 5) return '#22c55e';   // verde
  if (pace < 7) return '#facc15';   // amarillo
  return '#ef4444';                 // rojo
};

export default function RunScreen() {
  const {
    isRunning,
    isPaused,
    path,
    elapsedMs,
    totalDistance,
    pace,
    start,
    stop,
    pause,
    resume,
  } = useRunSession();

  const [showHUD, setShowHUD] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const sessions = getSessions();

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* MAPA (click para ocultar/mostrar HUD) */}
      <div
        onClick={() => setShowHUD((v) => !v)}
        style={{ width: '100%', height: '100%' }}
      >
        <MapView path={path} />
      </div>

      {/* HUD SUPERIOR */}
      {showHUD && (
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            padding: '14px 22px',
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(6px)',
            borderRadius: 18,
            color: 'white',
            boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
          }}
        >
          {/* PACE */}
          <div style={{ textAlign: 'center', minWidth: 80 }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>PACE</div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: getPaceColor(pace),
              }}
            >
              {pace > 0 ? pace.toFixed(2) : '--'}
            </div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>min/km</div>
          </div>

          {/* TIEMPO */}
          <div style={{ textAlign: 'center', minWidth: 120 }}>
            <div style={{ fontSize: 34, fontWeight: 800 }}>
              {formatTime(elapsedMs)}
            </div>
          </div>

          {/* DISTANCIA */}
          <div style={{ textAlign: 'center', minWidth: 80 }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>DIST</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              {(totalDistance / 1000).toFixed(2)}
            </div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>km</div>
          </div>
        </div>
      )}

      {/* BOTÓN HISTORIAL */}
      <button
        onClick={() => setShowHistory(true)}
        style={{
          position: 'absolute',
          top: 90,
          right: 20,
          zIndex: 1000,
          padding: '12px 18px',
          fontSize: 16,
          borderRadius: 16,
          border: 'none',
          cursor: 'pointer',
          background: 'rgba(18,35,110,0.65)',
          color: 'white',
        }}
      >
        📜 Historial
      </button>

      {/* CONTROLES */}
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
            }}
          >
            ▶
          </button>
        )}

        {isRunning && !isPaused && (
          <button
            onClick={pause}
            style={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              background: '#facc15',
              border: 'none',
              fontSize: 18,
              cursor: 'pointer',
            }}
          >
            ⏸
          </button>
        )}

        {isRunning && isPaused && (
          <button
            onClick={resume}
            style={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              background: '#22c55e',
              border: 'none',
              fontSize: 18,
              cursor: 'pointer',
            }}
          >
            ▶
          </button>
        )}

        {isRunning && (
          <button
            onClick={stop}
            style={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              background: '#ef4444',
              border: 'none',
              fontSize: 18,
              cursor: 'pointer',
            }}
          >
            ⏹
          </button>
        )}
      </div>

      {/* HISTORIAL FLOTANTE */}
      {showHistory && (
        <div
          style={{
            position: 'absolute',
            top: 70,
            left: 20,
            width: 300,
            maxHeight: '70%',
            zIndex: 1200,
            padding: 20,
            overflowY: 'auto',
            background: 'rgba(2,6,23,0.75)',
            backdropFilter: 'blur(8px)',
            color: 'white',
            borderRadius: 16,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3>Historial</h3>
            <button onClick={() => setShowHistory(false)}>✕</button>
          </div>

          {sessions.length === 0 && <p>No hay sesiones</p>}

          {sessions.map((s) => (
            <div key={s.id} style={{ marginBottom: 12 }}>
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
