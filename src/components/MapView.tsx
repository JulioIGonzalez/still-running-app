import {
  MapContainer,
  TileLayer,
  Circle,
  Polyline,
  useMap,
} from 'react-leaflet';
import { useEffect } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';

type LatLngPoint = {
  lat: number;
  lng: number;
};

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

          <Circle
            center={[position.lat, position.lng]}
            radius={10}
            pathOptions={{
              color: isRunning ? 'green' : 'blue',
            }}
          />
        </>
      )}

      {/* RECORRIDO */}
      {path.length > 1 && (
        <Polyline
          positions={path.map((p) => [p.lat, p.lng])}
          pathOptions={{ color: 'red' }}
        />
      )}
    </MapContainer>
  );
}
