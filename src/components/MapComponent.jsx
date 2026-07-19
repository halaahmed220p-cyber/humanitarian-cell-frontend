import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ governorateData, onSelectGovernorate }) => {
  return (
    <MapContainer 
      center={[15.5, 45.5]} 
      zoom={6} 
      // تم تحديد الارتفاع بالبكسل ليظهر العنصر في الصفحة
      style={{ height: "500px", width: "100%", borderRadius: "16px" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {Object.entries(governorateData || {}).map(([key, gov]) => (
        <CircleMarker
          key={key}
          center={gov.coords}
          radius={8 + (gov.projects / 3)}
          pathOptions={{ 
            fillColor: gov.completion >= 70 ? '#10b981' : '#f59e0b',
            color: '#fff',
            weight: 2,
            fillOpacity: 0.8
          }}
          eventHandlers={{
            click: () => onSelectGovernorate(key)
          }}
        >
          <Popup>
            <h3>{gov.name}</h3>
            <p>{gov.projects} مشروع</p>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;