import MapView from '../components/MapView';
import { useRunSession } from '../hooks/useRunSession';
import { useNavigate } from 'react-router-dom';

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const baseButtonStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: 999,
  padding: '16px 22px',
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer',
  boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
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

  const navigate = useNavigate();

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
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
          letterSpacing: 1,
        }}
      >
        {formatTime(elapsedMs)}
      </div>

      {/* MAPA */}
      <MapView path={path} />

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
          alignItems: 'center',
        }}
      >
        {/* START */}
        {!isRunning && (
          <button
            onClick={start}
            style={{
              ...baseButtonStyle,
              background: '#22c55e',
              color: '#022c22',
              width: 90,
              height: 90,
              fontSize: 18,
            }}
          >
            ▶ Iniciar
          </button>
        )}

        {/* PAUSE */}
        {isRunning && !isPaused && (
          <button
            onClick={pause}
            style={{
              ...baseButtonStyle,
              background: '#facc15',
              color: '#422006',
            }}
          >
            ⏸ Pausa
          </button>
        )}

        {/* RESUME */}
        {isRunning && isPaused && (
          <button
            onClick={resume}
            style={{
              ...baseButtonStyle,
              background: '#22c55e',
              color: '#022c22',
            }}
          >
            ▶ Reanudar
          </button>
        )}

        {/* STOP */}
        {isRunning && (
          <button
            onClick={stop}
            style={{
              ...baseButtonStyle,
              background: '#ef4444',
              color: '#450a0a',
            }}
          >
            ⏹ Stop
          </button>
        )}
      </div>

      {/* BOTÓN HISTORIAL */}
      <button
        onClick={() => navigate('/history')}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 1000,
          padding: '10px 14px',
          borderRadius: 10,
          border: 'none',
          cursor: 'pointer',
          background: 'rgba(0,0,0,0.6)',
          color: 'white',
        }}
      >
        📜 Historial
      </button>
    </div>
  );
}
