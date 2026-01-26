import { useState, useEffect } from 'react';
import MapView from '../components/MapView';
import { useRunSession } from '../hooks/useRunSession';
import { getSessions } from '../types/RunStorage';

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Generar GPX simple desde path
const generateGPX = (path: { lat: number; lng: number }[]) => {
  const header = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="StillRunningApp">
<trk><name>Run Session</name><trkseg>`;
  const footer = '</trkseg></trk></gpx>';
  const points = path
    .map((p) => `<trkpt lat="${p.lat}" lon="${p.lng}"></trkpt>`)
    .join('');
  return header + points + footer;
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
  const [sessions, setSessions] = useState(getSessions());
  const autoPause = true;

  // Auto-pausa: si no se mueve > 5 segundos
  const [lastPosition, setLastPosition] = useState<{ lat: number; lng: number } | null>(null);
  useEffect(() => {
    // Si autoPause está apagado, no estamos corriendo, o el path es muy corto, no hacemos nada
    if (!autoPause || path.length < 2 || !isRunning) return;

    const current = path[path.length - 1];
    if (!lastPosition) {
      setLastPosition(current);
      return;
    }

    // Calculamos distancia simple (aprox) para ver si se movió
    const distanceMoved = Math.sqrt(
      (current.lat - lastPosition.lat) ** 2 + (current.lng - lastPosition.lng) ** 2
    );

    // Si no se movió suficiente, pausamos. Si se movió y estaba pausado, reanudamos.
    if (distanceMoved < 0.00001 && !isPaused) {
      pause();
    } else if (distanceMoved >= 0.00001 && isPaused) {
      resume();
    }
    setLastPosition(current);
  }, [path, autoPause, isPaused, lastPosition, pause, resume, isRunning]);

  // Descargar GPX de una sesión
  const downloadGPX = (s: typeof sessions[0]) => {
    const gpxData = generateGPX(s.path);
    const blob = new Blob([gpxData], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `run-${new Date(s.date).toISOString()}.gpx`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
            onClick={() => {
              stop();
              setTimeout(() => setSessions(getSessions()), 100);
            }}
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
              <button
                onClick={() => downloadGPX(s)}
                style={{
                  marginTop: 6,
                  width: '100%',
                  padding: '6px 0',
                  fontSize: 14,
                  borderRadius: 12,
                  border: 'none',
                  cursor: 'pointer',
                  background: '#3b82f6',
                  color: 'white',
                }}
              >
                ⬇ Exportar GPX
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
