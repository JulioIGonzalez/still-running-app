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
