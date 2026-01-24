import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';

type LatLngPoint = { lat: number; lng: number };

type MapViewProps = {
  isRunning: boolean;
  path: LatLngPoint[];
};

function FollowUser({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], 16);
  }, [lat, lng, map]);

  return null;
}

// Íconos
const startIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/25/25694.png', // verde inicio
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const endIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png', // rojo fin
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const currentPositionIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // azul usuario
  iconSize: [25, 25],
  iconAnchor: [12, 12],
});

export default function MapView({ isRunning, path }: MapViewProps) {
  const { position } = useGeolocation();

  return (
    <MapContainer
      center={[-34.6037, -58.3816]}
      zoom={13}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {position && (
        <>
          <FollowUser lat={position.lat} lng={position.lng} />

          {/* MARCADOR DE POSICIÓN ACTUAL */}
          <Marker
            position={[position.lat, position.lng]}
            icon={currentPositionIcon}
          >
            <Popup>Tu ubicación</Popup>
          </Marker>
        </>
      )}

      {/* RECORRIDO */}
      {path.length > 1 && (
        <Polyline positions={path.map((p) => [p.lat, p.lng])} pathOptions={{ color: 'red' }} />
      )}

      {/* MARCADOR DE INICIO */}
      {path.length > 0 && (
        <Marker position={[path[0].lat, path[0].lng]} icon={startIcon}>
          <Popup>Inicio</Popup>
        </Marker>
      )}

      {/* MARCADOR DE FIN */}
      {path.length > 1 && (
        <Marker position={[path[path.length - 1].lat, path[path.length - 1].lng]} icon={endIcon}>
          <Popup>Fin</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
