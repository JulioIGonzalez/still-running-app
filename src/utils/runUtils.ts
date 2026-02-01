import type { LatLngPoint } from '../types/RunTypes';
import { haversineDistance } from './distance';

export const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const getPaceColor = (pace: number) => {
  if (!pace || pace === 0) return '#9ca3af'; // gris
  if (pace < 5) return '#22c55e';   // verde (Rápido)
  if (pace < 7) return '#facc15';   // amarillo (Medio)
  return '#ef4444';                 // rojo (Lento/Caminata)
};

export type SplitInfo = { km: number; paceMinPerKm: number };

/** Ritmo por kilómetro (splits) a partir del path con timestamps. */
export function getSplits(path: LatLngPoint[]): SplitInfo[] {
  if (path.length < 2) return [];
  let cumMeters = 0;
  const crosses: { meters: number; timestamp: number }[] = [];
  const startTs = path[0].timestamp ?? 0;
  crosses.push({ meters: 0, timestamp: startTs });

  for (let i = 1; i < path.length; i++) {
    cumMeters += haversineDistance(path[i - 1], path[i]);
    const t = path[i].timestamp ?? startTs;
    const prevCross = crosses[crosses.length - 1];
    let nextKmM = (Math.floor(prevCross.meters / 1000) + 1) * 1000;
    while (cumMeters >= nextKmM) {
      crosses.push({ meters: nextKmM, timestamp: t });
      nextKmM += 1000;
    }
  }

  const result: SplitInfo[] = [];
  for (let k = 1; k < crosses.length; k++) {
    const segmentM = crosses[k].meters - crosses[k - 1].meters;
    const timeMin = (crosses[k].timestamp - crosses[k - 1].timestamp) / 60000;
    if (segmentM > 0 && timeMin > 0) {
      const pace = timeMin / (segmentM / 1000);
      if (pace < 30) result.push({ km: k, paceMinPerKm: pace });
    }
  }
  return result;
}
