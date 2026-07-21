import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// قاموس يربط أسماء المحافظات القادمة من قاعدة البيانات بإحداثياتها الجغرافية الدقيقة
const governorateCoordsMap = {
    'تعز': [13.57, 44.01],
    'صنعاء': [15.36, 44.19],
    'عدن': [12.78, 45.01],
    'الحديدة': [14.80, 42.95],
    'إب': [13.97, 44.17],
    'حضرموت': [15.50, 48.50],
    'مأرب': [15.45, 45.32],
    'المهرة': [16.20, 50.80],
    'أبين': [13.88, 45.39],
    'شبوة': [14.95, 47.03],
    'لحج': [13.06, 44.88],
    'الضالع': [13.69, 44.73]
};

const MapComponent = ({ governorateData, onSelectGovernorate }) => {
  return (
    <MapContainer 
      center={[15.5, 45.5]} 
      zoom={6} 
      dragging={true}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%", borderRadius: "16px" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {/* عرض جميع المحافظات الواردة من قاعدة البيانات عبر السيرفر بأمان تام */}
      {Object.entries(governorateData || {}).map(([key, gov]) => {
        // جلب الإحداثيات إما من الخريطة المعرفة أعلاه أو استخدام إحداثيات افتراضية بوسط اليمن لمنع الانهيار
        const coords = gov.coords || governorateCoordsMap[gov.name] || [15.55, 48.51];
        
        // حساب عدد المشاريع بأمان
        const projectsCount = gov.projects ? (Array.isArray(gov.projects) ? gov.projects.length : gov.projects) : 0;
        const completionRate = gov.completion || 60;

        return (
          <CircleMarker
            key={key}
            center={coords}
            radius={8 + (projectsCount ? projectsCount / 2 : 0)}
            pathOptions={{ 
              fillColor: completionRate >= 70 ? '#10b981' : '#f59e0b',
              color: '#fff',
              weight: 2,
              fillOpacity: 0.8
            }}
            eventHandlers={{
              click: () => {
                onSelectGovernorate(key); 
              }
            }}
          >
            <Popup>
              <div style={{ textAlign: 'right', direction: 'rtl' }}>
                <h3 style={{ margin: '0 0 5px 0', color: '#0f172a' }}>{gov.name}</h3>
                <p style={{ margin: 0, color: '#334155' }}>
                  {projectsCount > 0 ? `${projectsCount} مشروع مسجل` : "لا توجد مشاريع"}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
};

export default MapComponent;