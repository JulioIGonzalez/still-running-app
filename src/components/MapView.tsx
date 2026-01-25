import { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import { useGeolocation } from '../hooks/useGeolocation';
import L from 'leaflet';

export type LatLngPoint = { lat: number; lng: number };

type MapViewProps = {
  path: LatLngPoint[];
  zoom?: number; // <--- agregamos zoom opcional
};

function FollowUser({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

// Íconos simples de colores usando L.DivIcon
const createColorMarker = (color: string) =>
  L.divIcon({
    className: 'custom-marker',
    html: `<div style="background:${color};width:16px;height:16px;border-radius:50%;border:2px solid white;"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

export default function MapView({ path, zoom }: MapViewProps) {
  const { position } = useGeolocation();

  return (
    <MapContainer
      center={[-34.6037, -58.3816]}
      zoom={zoom ?? 13} // usamos la prop zoom si existe
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {position && (
        <>
          <FollowUser lat={position.lat} lng={position.lng} />

          {/* Posición actual */}
          <Marker position={[position.lat, position.lng]} icon={createColorMarker('blue')}>
            <Popup>Tu ubicación</Popup>
          </Marker>
        </>
      )}

      {/* Ruta */}
      {path.length > 1 && (
        <Polyline positions={path.map((p) => [p.lat, p.lng])} pathOptions={{ color: 'red' }} />
      )}

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
  );
}
