import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ governorateData, onSelectGovernorate }) => {
  return (
    <MapContainer 
      center={[15.5, 45.5]} 
      zoom={6} 
      dragging={true}
    scrollWheelZoom={true}
      style={{ height: "100%", width: "100%", borderRadius: "16px" }} // تم ضبطها لـ 100% لتملأ الحاوية الخارجية
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {/* عرض جميع المحافظات الموجودة في البيانات */}
      {Object.entries(governorateData || {}).map(([key, gov]) => (
        <CircleMarker
          key={key}
          center={gov.coords}
          // زيادة حجم الدائرة بناءً على عدد المشاريع أو قيمة ثابتة
          radius={8 + (gov.projects ? gov.projects / 3 : 0)}
          pathOptions={{ 
            fillColor: gov.completion >= 70 ? '#10b981' : '#f59e0b',
            color: '#fff',
            weight: 2,
            fillOpacity: 0.8
          }}
          eventHandlers={{
            // عند النقر يتم إرسال المفتاح (مثل اسم المحافظة أو ID)
            click: () => {
              onSelectGovernorate(key); 
            }
          }}
        >
          <Popup>
            <div style={{ textAlign: 'right', direction: 'rtl' }}>
              <h3 style={{ margin: '0 0 5px 0' }}>{gov.name}</h3>
              <p style={{ margin: 0 }}>
                {gov.projects && gov.projects > 0 
                  ? `${gov.projects} مشروع` 
                  : "لا توجد مشاريع"}
              </p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;