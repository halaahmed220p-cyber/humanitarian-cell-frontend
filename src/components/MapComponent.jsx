import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// إصلاح مشكلة أيقونات Leaflet الافتراضية المفقودة في React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({ governorateData, onSelectGovernorate }) => {
    // إحداثيات تقريبية للمحافظات اليمنية لربطها بالدوائر الظاهرة في الخريطة الثانية
    const governorateCoords = {
        'صنعاء': { lat: 15.3694, lng: 44.1910 },
        'تعز': { lat: 13.5779, lng: 44.0219 },
        'الحديدة': { lat: 14.7979, lng: 42.9545 },
        'إب': { lat: 13.9667, lng: 44.1833 },
        'عدن': { lat: 12.7855, lng: 45.0187 },
        'حضرموت': { lat: 15.9250, lng: 48.7900 },
        'المحويت': { lat: 15.4700, lng: 43.5400 },
        'حجة': { lat: 15.7042, lng: 43.6042 },
        'ذمار': { lat: 14.5423, lng: 44.4050 },
        'عمران': { lat: 16.6561, lng: 43.9454 },
        'صعدة': { lat: 16.9404, lng: 43.7639 },
        'أبين': { lat: 13.3500, lng: 45.6667 },
        'لحج': { lat: 13.0592, lng: 44.8828 },
        'الضالع': { lat: 13.6925, lng: 44.7303 },
        'شبوه': { lat: 15.0000, lng: 46.8333 },
        'المهرة': { lat: 16.2078, lng: 51.1578 },
        'مارب': { lat: 15.4286, lng: 45.3286 },
        'الجوف': { lat: 16.5000, lng: 45.5000 },
        'أخرى': { lat: 15.0000, lng: 44.0000 }
    };

    return (
        <MapContainer 
            center={[15.5, 44.8]} 
            zoom={7} 
            style={{ width: '100%', height: '100%', borderRadius: '8px', background: '#f8fafc' }}
            scrollWheelZoom={true}
        >
            {/* طبقة الخريطة الفاتحة المطابقة للصورة الثانية (CartoDB Positron) */}
            <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                maxZoom={19}
            />

            {/* رسم الدوائر الزرقاء للمشاريع بناءً على البيانات الواردة */}
            {Object.keys(governorateData).map((key) => {
                const gov = governorateData[key];
                const coords = governorateCoords[gov.name.trim()] || { lat: 15.0 + Math.random(), lng: 44.0 + Math.random() };
                const count = gov.projects.length;

                // تصميم أيقونة دائرية زرقاء تعرض عدد المشاريع تماماً كالتي في الصورة الثانية
                const customIcon = L.divIcon({
                    className: 'custom-map-marker',
                    html: `<div style="
                        background-color: #1e40af; 
                        color: white; 
                        width: 32px; 
                        height: 32px; 
                        border-radius: 50%; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        font-weight: bold; 
                        font-size: 13px;
                        border: 2px solid white;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                    ">${count}</div>`,
                    iconSize: [32, 32],
                    iconAnchor: [16, 16]
                });

                return (
                    <Marker 
                        key={key} 
                        position={[coords.lat, coords.lng]} 
                        icon={customIcon}
                        eventHandlers={{
                            click: () => {
                                if (onSelectGovernorate) {
                                    onSelectGovernorate(gov.name);
                                }
                            }
                        }}
                    >
                        <Popup>
                            <div style={{ textAlign: 'right', fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>
                                <strong style={{ color: '#1e3a8a', fontSize: '14px' }}>{gov.name}</strong>
                                <p style={{ margin: '5px 0', fontSize: '12px' }}>عدد المشاريع: {count}</p>
                                <button 
                                    onClick={() => onSelectGovernorate && onSelectGovernorate(gov.name)}
                                    style={{
                                        background: '#2563eb',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '11px'
                                    }}
                                >
                                    عرض المشاريع
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default MapComponent;