import MapView from '../components/MapView';
import { useRunSession } from '../hooks/useRunSession';

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const formatDistance = (meters: number) => {
  return (meters / 1000).toFixed(2);
};

const formatPace = (pace: number) => {
  if (!pace || !isFinite(pace)) return '--:--';
  const minutes = Math.floor(pace);
  const seconds = Math.round((pace - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')} min/km`;
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

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
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

      {/* PACE */}
      <div
        style={{
          position: 'absolute',
          top: 100,
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
        {formatPace(pace)}
      </div>

      {/* MAPA */}
      <MapView
        isRunning={isRunning && !isPaused}
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
        {!isRunning && <button onClick={start}>▶ Start</button>}
        {isRunning && !isPaused && <button onClick={stop}>⏹ Stop</button>}

        {isRunning && !isPaused && <button onClick={pause}>⏸ Pause</button>}
        {isRunning && isPaused && <button onClick={resume}>▶ Resume</button>}
      </div>
    </div>
  );
}
