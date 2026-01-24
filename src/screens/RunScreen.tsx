import MapView from '../components/MapView';
import { useRunSession } from '../hooks/useRunSession';

// Helper para mostrar el tiempo en minutos:segundos
const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Helper para mostrar la distancia en km con 2 decimales
const formatDistance = (meters: number) => {
  return (meters / 1000).toFixed(2);
};

export default function RunScreen() {
  // Destructuring del hook, ahora incluye totalDistance
  const {
    isRunning,
    path,
    elapsedMs,
    totalDistance,
    start,
    stop,
  } = useRunSession();

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* CRONÓMETRO */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'rgba(0,0,0,0.6)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: 8,
          fontSize: 18,
        }}
      >
        {formatTime(elapsedMs)}
      </div>

      {/* DISTANCIA */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'rgba(0,0,0,0.6)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: 8,
          fontSize: 18,
        }}
      >
        {formatDistance(totalDistance)} km
      </div>

      {/* MAPA */}
      <MapView
        isRunning={isRunning}
        path={path}
      />

      {/* CONTROLES */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          display: 'flex',
          gap: 12,
        }}
      >
        {!isRunning && (
          <button onClick={start}>▶ Start</button>
        )}
        {isRunning && (
          <button onClick={stop}>⏹ Stop</button>
        )}
      </div>
    </div>
  );
}
