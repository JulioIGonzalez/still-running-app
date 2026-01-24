import MapView from '../components/MapView';
import { useRunSession } from '../hooks/useRunSession';

export default function RunScreen() {
  const {
    isRunning,
    path,
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
