import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { GeoRecord } from '../types';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '../constants';
import L from 'leaflet';

// Fix per le icone di Leaflet: Usare URL diretti CDN invece di importare file immagini
// Questo evita errori in ambienti che non supportano l'importazione di asset non-JS
const iconMarker = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetina = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const iconShadow = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: iconMarker,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface GeoMapProps {
  data: GeoRecord[];
}

const GeoMap: React.FC<GeoMapProps> = ({ data }) => {
  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-gray-300 shadow-md relative z-0">
      <MapContainer 
        center={DEFAULT_CENTER} 
        zoom={DEFAULT_ZOOM} 
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data.map((record, index) => (
          <Marker 
            key={`${record.timestamp}-${index}`} 
            position={[record.lat, record.lon]}
          >
            <Popup>
              <div className="text-sm">
                <p><strong>Device:</strong> {record.deviceId || 'N/A'}</p>
                <p><strong>Time:</strong> {new Date(record.timestamp).toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Lat: {record.lat.toFixed(4)}, Lon: {record.lon.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default GeoMap;
