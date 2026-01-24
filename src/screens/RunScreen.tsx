import MapView from '../components/MapView';
import { useRunSession } from '../hooks/useRunSession';

/* ---------- helpers ---------- */
const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const formatDistance = (meters: number) => {
  return (meters / 1000).toFixed(2);
};

/* ---------- styles ---------- */
const overlayBase = {
  background: 'rgba(0,0,0,0.65)',
  color: 'white',
  borderRadius: 12,
  boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
};

const startButtonStyle = {
  width: 96,
  height: 96,
  borderRadius: '50%',
  border: 'none',
  background: '#1DB954',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 6px 14px rgba(0,0,0,0.5)',
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
};

const controlButton = {
  padding: '12px 20px',
  borderRadius: 10,
  border: 'none',
  fontSize: 16,
  fontWeight: 'bold',
  cursor: 'pointer',
  color: 'white',
  boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
};

/* ---------- component ---------- */
export default function RunScreen() {
  const {
    isRunning,
    isPaused,
    path,
    elapsedMs,
    totalDistance,
    start,
    stop,
    pause,
    resume,
  } = useRunSession();

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* MAPA */}
      <MapView path={path} />

      {/* CRONÓMETRO (arriba centro) */}
      <div
        style={{
          ...overlayBase,
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '12px 28px',
          fontSize: 28,
          zIndex: 1000,
        }}
      >
        {formatTime(elapsedMs)}
      </div>

      {/* INFO PANEL (izquierda) */}
      <div
        style={{
          ...overlayBase,
          position: 'absolute',
          top: 90,
          left: 20,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          zIndex: 1000,
          minWidth: 180,
        }}
      >
        <div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>Tiempo</div>
          <div style={{ fontSize: 18, fontWeight: 'bold' }}>
            {formatTime(elapsedMs)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>Kilómetros</div>
          <div style={{ fontSize: 18, fontWeight: 'bold' }}>
            {formatDistance(totalDistance)} km
          </div>
        </div>
      </div>

      {/* CONTROLES (abajo centro) */}
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
        {!isRunning && (
          <button style={startButtonStyle} onClick={start}>
            <div style={{ fontSize: 30, lineHeight: 1 }}>▶</div>
            <div style={{ fontSize: 14 }}>Iniciar</div>
          </button>
        )}

        {isRunning && !isPaused && (
          <>
            <button
              style={{ ...controlButton, background: '#f39c12' }}
              onClick={pause}
            >
              ⏸ Pausa
            </button>
            <button
              style={{ ...controlButton, background: '#e74c3c' }}
              onClick={stop}
            >
              ⏹ Stop
            </button>
          </>
        )}

        {isRunning && isPaused && (
          <button
            style={{ ...controlButton, background: '#1DB954' }}
            onClick={resume}
          >
            ▶ Reanudar
          </button>
        )}
      </div>
    </div>
  );
}
