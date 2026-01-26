import { useState } from 'react';
import MapView from '../components/MapView';
import { useRunSession } from '../hooks/useRunSession';
import { getSessions } from '../types/RunStorage';
import { downloadGPX } from '../utils/gpxExporter';

import { formatTime, getPaceColor } from '../utils/runUtils';

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
    <div className="relative w-screen h-screen bg-black">
      {/* MAPA (click para ocultar/mostrar HUD) */}
      <div
        onClick={() => setShowHUD((v) => !v)}
        className="w-full h-full"
      >
        <MapView path={path} />
      </div>

      {/* HUD SUPERIOR */}
      {showHUD && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-7 px-6 py-3.5 bg-black/60 backdrop-blur-md rounded-2xl shadow-2xl text-white border border-white/10 animate-fade-in-down">
          {/* PACE */}
          <div className="text-center min-w-[80px]">
            <div className="text-xs opacity-70 font-medium tracking-wider">PACE</div>
            <div
              className="text-2xl font-bold"
              style={{ color: getPaceColor(pace) }}
            >
              {pace > 0 ? pace.toFixed(2) : '--'}
            </div>
            <div className="text-[10px] opacity-60">min/km</div>
          </div>

          {/* TIEMPO */}
          <div className="text-center min-w-[120px]">
            <div className="text-5xl font-black tabular-nums tracking-tight">
              {formatTime(elapsedMs)}
            </div>
          </div>

          {/* DISTANCIA */}
          <div className="text-center min-w-[80px]">
            <div className="text-xs opacity-70 font-medium tracking-wider">DIST</div>
            <div className="text-2xl font-bold">
              {(totalDistance / 1000).toFixed(2)}
            </div>
            <div className="text-[10px] opacity-60">km</div>
          </div>
        </div>
      )}

      {/* BOTÓN HISTORIAL */}
      <button
        onClick={() => setShowHistory(true)}
        className="absolute top-24 right-5 z-[1000] px-4 py-2.5 bg-blue-900/40 hover:bg-blue-800/60 backdrop-blur-sm text-white rounded-xl shadow-lg border border-white/10 transition-all active:scale-95 flex items-center gap-2 font-medium"
      >
        <span className="text-xl">📜</span> <span className="text-sm">Historial</span>
      </button>

      {/* CONTROLES */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-6">
        {!isRunning && (
          <button
            onClick={start}
            className="w-20 h-20 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-2xl shadow-emerald-900/50 flex items-center justify-center transition-transform active:scale-95"
          >
            <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-2"></div>
          </button>
        )}

        {isRunning && !isPaused && (
          <button
            onClick={pause}
            className="w-20 h-20 rounded-full bg-amber-400 hover:bg-amber-300 text-white shadow-2xl shadow-amber-900/50 flex items-center justify-center transition-transform active:scale-95"
          >
            <div className="flex gap-2.5">
              <div className="w-2.5 h-8 bg-black/80 rounded-sm"></div>
              <div className="w-2.5 h-8 bg-black/80 rounded-sm"></div>
            </div>
          </button>
        )}

        {isRunning && isPaused && (
          <button
            onClick={resume}
            className="w-20 h-20 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-2xl shadow-emerald-900/50 flex items-center justify-center transition-transform active:scale-95"
          >
            <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-2"></div>
          </button>
        )}

        {isRunning && (
          <button
            onClick={stop}
            className="w-20 h-20 rounded-full bg-rose-500 hover:bg-rose-400 text-white shadow-2xl shadow-rose-900/50 flex items-center justify-center transition-transform active:scale-95"
          >
            <div className="w-6 h-6 bg-white rounded-sm"></div>
          </button>
        )}
      </div>

      {/* HISTORIAL FLOTANTE */}
      {showHistory && (
        <div className="absolute top-24 left-5 w-80 max-h-[70%] z-[1200] p-6 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-white overflow-y-auto animate-fade-in-left">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
            <h3 className="text-lg font-bold">Historial de Carreras</h3>
            <button onClick={() => setShowHistory(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
          </div>

          {sessions.length === 0 && <p className="text-gray-400 text-center py-4">No hay sesiones guardadas.</p>}

          {sessions.map((s) => (
            <div key={s.id} className="mb-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">📅</span>
                <span className="font-semibold">{new Date(s.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300 items-end">
                <div>
                  <div>⏱ {(s.durationMs / 60000).toFixed(1)} min</div>
                  <div>📏 {(s.distanceMeters / 1000).toFixed(2)} km</div>
                </div>
                <button
                  onClick={() => downloadGPX(s.path, `run-${s.date}.gpx`)}
                  className="text-xs bg-emerald-600/50 hover:bg-emerald-500 text-white px-2 py-1 rounded"
                >
                  💾 GPX
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
