import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import L from 'leaflet';
import type { LatLngPoint } from '../types/RunTypes';
import { getPaceColor } from '../utils/runUtils';



function MapEvents({ onDragStart }: { onDragStart: () => void }) {
  useMapEvents({
    dragstart: () => onDragStart(),
  });
  return null;
}

function FollowUser({ lat, lng, active }: { lat: number; lng: number; active: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (active) map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map, active]);
  return null;
}

const createColorMarker = (color: string) =>
  L.divIcon({
    className: 'custom-marker',
    html: `<div style="background:${color};width:16px;height:16px;border-radius:50%;border:2px solid white;"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

type MapViewProps = {
  path: LatLngPoint[];
};

export default function MapView({ path }: MapViewProps) {
  const { position } = useGeolocation();
  const [following, setFollowing] = useState(true);

  return (
    <div className="w-full h-full relative group">
      <MapContainer center={[-34.6037, -58.3816]} zoom={15} style={{ width: '100%', height: '100%' }} zoomControl={false}>
        <MapEvents onDragStart={() => setFollowing(false)} />

        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {position && <>
          <FollowUser lat={position.lat} lng={position.lng} active={following} />
          <Marker position={[position.lat, position.lng]} icon={createColorMarker('blue')}>
            <Popup>Tu ubicación</Popup>
          </Marker>
        </>}

        {/* Ruta coloreada por tramos */}
        {path.length > 1 && path.map((point, i) => {
          if (i === 0) return null;
          const prevPoint = path[i - 1];
          return (
            <Polyline
              key={i}
              positions={[[prevPoint.lat, prevPoint.lng], [point.lat, point.lng]]}
              pathOptions={{ color: getPaceColor(point.pace || 0), weight: 5, opacity: 0.8 }}
            />
          );
        })}

        {/* Inicio */}
        {path.length > 0 && (
          <Marker position={[path[0].lat, path[0].lng]} icon={createColorMarker('green')}>
            <Popup>Inicio</Popup>
          </Marker>
        )}

        {/* Fin */}
        {path.length > 1 && (
          <Marker position={[path[path.length - 1].lat, path[path.length - 1].lng]} icon={createColorMarker('red')}>
            <Popup>Fin</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Recenter Button */}
      {!following && (
        <button
          onClick={() => setFollowing(true)}
          className="absolute bottom-6 right-6 z-[1000] p-3 bg-white text-black rounded-full shadow-xl hover:bg-gray-100 transition-transform active:scale-95 flex items-center justify-center w-12 h-12"
          aria-label="Recenter"
        >
          📍
        </button>
      )}
    </div>
  );
}
