import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MapView from '../components/MapView';
import { getSessionById } from '../types/RunStorage';

export default function SessionMapScreen() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const session = sessionId ? getSessionById(sessionId) : null;

  useEffect(() => {
    if (!session && sessionId) navigate('/history', { replace: true });
  }, [session, sessionId, navigate]);

  if (!session) return null;

  return (
    <div className="relative w-screen h-screen bg-black">
      <div className="w-full h-full">
        <MapView path={session.path} readOnly />
      </div>
      <button
        onClick={() => navigate('/history')}
        className="absolute top-5 left-5 z-[1000] px-4 py-2.5 bg-black/60 backdrop-blur-md text-white rounded-xl border border-white/10 hover:bg-black/80 transition-all flex items-center gap-2 font-medium"
      >
        ⬅ Volver al historial
      </button>
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-[1000] px-4 py-2 bg-black/60 backdrop-blur-md text-white rounded-xl border border-white/10 text-sm">
        {(session.distanceMeters / 1000).toFixed(2)} km · {(session.durationMs / 60000).toFixed(1)} min
      </div>
    </div>
  );
}
