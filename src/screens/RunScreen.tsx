import { useState, useEffect, useRef } from 'react';
import MapView from '../components/MapView';
import { useRunSession } from '../hooks/useRunSession';
import { getSessions, deleteSession } from '../types/RunStorage';
import { downloadGPX } from '../utils/gpxExporter';
import type { LatLngPoint } from '../types/RunTypes';

import { formatTime, getPaceColor } from '../utils/runUtils';

const GHOST_PATH_KEY = 'ghost_path';

function getStoredGhostPath(): LatLngPoint[] | null {
  try {
    const raw = sessionStorage.getItem(GHOST_PATH_KEY);
    return raw ? (JSON.parse(raw) as LatLngPoint[]) : null;
  } catch {
    return null;
  }
}

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
  const [ghostPath, setGhostPath] = useState<LatLngPoint[] | null>(getStoredGhostPath);
  const [sessions, setSessions] = useState(getSessions);
  const [kmToast, setKmToast] = useState<number | null>(null);
  const lastKmRef = useRef(0);

  useEffect(() => {
    if (!isRunning) lastKmRef.current = 0;
  }, [isRunning]);

  useEffect(() => {
    if (ghostPath?.length) {
      sessionStorage.setItem(GHOST_PATH_KEY, JSON.stringify(ghostPath));
    } else {
      sessionStorage.removeItem(GHOST_PATH_KEY);
    }
  }, [ghostPath]);

  const setGhostFromSession = (path: LatLngPoint[]) => {
    setGhostPath(path);
    setShowHistory(false);
  };

  const refreshSessions = () => setSessions(getSessions());

  // Feedback por kilómetro (vibración + toast breve)
  useEffect(() => {
    if (!isRunning || isPaused) return;
    const km = Math.floor(totalDistance / 1000);
    if (km > 0 && km > lastKmRef.current) {
      lastKmRef.current = km;
      if (typeof navigator.vibrate === 'function') navigator.vibrate(100);
      setShowHUD(true);
      setKmToast(km);
      const t = setTimeout(() => setKmToast(null), 2000);
      return () => clearTimeout(t);
    }
  }, [totalDistance, isRunning, isPaused]);

  return (
    <div className="relative w-screen h-screen bg-black">
      {/* MAPA (click para ocultar/mostrar HUD) */}
      <div
        onClick={() => setShowHUD((v) => !v)}
        className="w-full h-full"
      >
        <MapView path={path} ghostPath={ghostPath ?? undefined} />
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
        onClick={() => { refreshSessions(); setShowHistory(true); }}
        className="absolute top-24 right-5 z-[1000] px-4 py-2.5 bg-blue-900/40 hover:bg-blue-800/60 backdrop-blur-sm text-white rounded-xl shadow-lg border border-white/10 transition-all active:scale-95 flex items-center gap-2 font-medium"
      >
        <span className="text-xl">📜</span> <span className="text-sm">Historial</span>
      </button>

      {/* Toast por km completado */}
      {kmToast !== null && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1100] px-6 py-4 bg-emerald-500/90 backdrop-blur text-white rounded-2xl text-2xl font-bold shadow-2xl animate-fade-in-down">
          {kmToast} km
        </div>
      )}

      {/* Quitar ruta objetivo (cuando hay ghost) */}
      {ghostPath && ghostPath.length > 0 && (
        <button
          onClick={() => setGhostPath(null)}
          className="absolute top-24 left-5 z-[1000] px-3 py-2 bg-slate-700/80 hover:bg-slate-600/80 backdrop-blur-sm text-white rounded-xl border border-white/10 text-xs font-medium transition-all active:scale-95"
        >
          ✕ Quitar ruta objetivo
        </button>
      )}

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
        <div className="absolute top-24 left-5 w-96 max-h-[75%] z-[1200] p-6 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl text-white overflow-y-auto">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-white/10">
            <h3 className="text-xl font-bold text-white">Historial de Carreras</h3>
            <button
              onClick={() => { setShowHistory(false); refreshSessions(); }}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
            >
              ✕
            </button>
          </div>

          {sessions.length === 0 && <p className="text-slate-400 text-center py-8">No hay sesiones guardadas.</p>}

          <div className="space-y-4">
            {sessions.map((s) => {
              const startDate = new Date(s.date);
              const endDate = new Date(s.date + s.durationMs);

              return (
                <div key={s.id} className="p-4 bg-slate-800/60 rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                    <span className="text-xl">📅</span>
                    <span className="font-bold text-slate-200">{startDate.toLocaleDateString()}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 text-sm text-slate-300 mb-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 uppercase tracking-wider">Inicio</span>
                      <span className="font-mono">{startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 uppercase tracking-wider">Fin</span>
                      <span className="font-mono">{endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 uppercase tracking-wider">Tiempo</span>
                      <span className="font-semibold text-slate-200">{(s.durationMs / 60000).toFixed(1)} min</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 uppercase tracking-wider">Distancia</span>
                      <span className="font-semibold text-slate-200">{(s.distanceMeters / 1000).toFixed(2)} km</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-end gap-2 pt-2">
                    <button
                      onClick={() => setGhostFromSession(s.path)}
                      className="flex items-center gap-1.5 text-xs font-semibold bg-blue-900/60 hover:bg-blue-800/80 text-blue-200 px-3 py-1.5 rounded-lg transition-colors border border-white/10"
                    >
                      🎯 Correr esta ruta
                    </button>
                    <button
                      onClick={() => downloadGPX(s.path, `run-${s.date}.gpx`)}
                      className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 px-3 py-1.5 rounded-lg transition-colors border border-white/10"
                    >
                      💾 Descargar GPX
                    </button>
                    <button
                      onClick={() => { deleteSession(s.id); refreshSessions(); }}
                      className="flex items-center gap-1.5 text-xs font-semibold bg-rose-900/40 hover:bg-rose-800/60 text-rose-200 px-3 py-1.5 rounded-lg transition-colors border border-white/10"
                    >
                      🗑 Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
