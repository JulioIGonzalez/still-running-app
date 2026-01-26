import type { LatLngPoint } from '../types/RunTypes';

export const generateGPX = (path: LatLngPoint[]): string => {
    const header = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="StillRunningApp">
  <trk>
    <name>Run Session</name>
    <trkseg>
`;
    const footer = `    </trkseg>
  </trk>
</gpx>`;

    const points = path.map(p => {
        const time = p.timestamp ? `        <time>${new Date(p.timestamp).toISOString()}</time>` : '';
        return `      <trkpt lat="${p.lat}" lon="${p.lng}">
${time}
      </trkpt>`;
    }).join('\n');

    return header + points + '\n' + footer;
};

export const downloadGPX = (path: LatLngPoint[], filename: string) => {
    const gpxContent = generateGPX(path);
    const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
