import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSessions, deleteSession } from '../types/RunStorage';
import { getSplits } from '../utils/runUtils';

export default function HistoryScreen() {
  const [sessions, setSessions] = useState(getSessions);
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    deleteSession(id);
    setSessions(getSessions());
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-5">
      {/* Header con nav */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <button
          onClick={() => navigate('/run')}
          className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-sm font-medium transition-all active:scale-95"
        >
          ⬅ Carrera
        </button>
        <h2 className="text-xl font-bold m-0">Historial de corridas</h2>
        <div className="w-20" />
      </div>

      {sessions.length === 0 && (
        <p className="text-slate-400 text-center py-12">No hay sesiones guardadas todavía.</p>
      )}

      <div className="flex flex-col gap-4">
        {sessions.map((s) => {
          const splits = getSplits(s.path);
          return (
            <div
              key={s.id}
              className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 shadow-lg"
            >
              <div className="text-sm text-slate-400 mb-2">
                📅 {new Date(s.date).toLocaleDateString()}
              </div>
              <div className="flex justify-between text-base mb-3">
                <span>⏱ {(s.durationMs / 60000).toFixed(1)} min</span>
                <span>📏 {(s.distanceMeters / 1000).toFixed(2)} km</span>
              </div>

              {splits.length > 0 && (
                <div className="mb-3 text-xs text-slate-400">
                  <span className="uppercase tracking-wider">Ritmo por km:</span>{' '}
                  {splits.map((sp) => `${sp.km}: ${sp.paceMinPerKm.toFixed(2)} min/km`).join(' · ')}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => navigate(`/history/${s.id}`)}
                  className="px-3 py-2 rounded-lg bg-blue-900/60 hover:bg-blue-800/80 text-white border border-white/10 text-sm font-medium transition-all"
                >
                  🗺 Ver en mapa
                </button>
                <button
                  onClick={() => {
                    sessionStorage.setItem('ghost_path', JSON.stringify(s.path));
                    navigate('/run');
                  }}
                  className="px-3 py-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-800/80 text-white border border-white/10 text-sm font-medium transition-all"
                >
                  🎯 Correr esta ruta
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="px-3 py-2 rounded-lg bg-rose-900/40 hover:bg-rose-800/60 text-rose-200 border border-white/10 text-sm font-medium transition-all"
                >
                  🗑 Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
