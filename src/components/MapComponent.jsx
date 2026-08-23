import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// إصلاح أيقونات Leaflet الافتراضية
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({ governorateData, onSelectGovernorate }) => {
    // قاموس إحداثيات المحافظات الشامل لجميع المناطق الواردة في قاعدة البيانات
    const governorateCoords = {
        'تعز': { lat: 13.5779, lng: 44.0219 },
        'الحديدة': { lat: 14.7979, lng: 42.9545 },
        'الساحل الغربي': { lat: 13.5500, lng: 43.3000 },
        'لحج': { lat: 13.0592, lng: 44.8828 },
        'الضالع': { lat: 13.6925, lng: 44.7303 },
        'مأرب': { lat: 15.4286, lng: 45.3286 },
        'البيضاء': { lat: 14.3300, lng: 45.5700 },
        'عدن': { lat: 12.7855, lng: 45.0187 },
        'الجوف': { lat: 16.5000, lng: 45.5000 },
        'حضرموت': { lat: 15.9250, lng: 48.7900 },
        'تعز، الحديدة': { lat: 13.5500, lng: 43.3000 }
    };

    // دالة ذكية للبحث عن الإحداثيات والتعرف على المديريات التابعة لتعز (مثل صبر، المواسط، المعافر، إلخ)
    const getCoordsForGov = (name) => {
        if (!name) return { lat: 15.5, lng: 44.5 };
        const cleanName = name.replace('محافظة', '').trim();
        
        // قائمة مديريات تعز لضمان مطابقتها وتوجيهها لإحداثيات تعز
        const taizzDistricts = [
            'صبر', 'المواسط', 'المسراخ', 'جبل حبشي', 'المعافر', 'الشمايتين', 
            'مشرعة', 'حدنان', 'المخا', 'موزع', 'ذوباب', 'الوازعية', 'القاهرة', 
            'صالة', 'المظفر', 'خدير', 'مقبنة', 'التربة', 'يختل', 'الزهاري'
        ];

        if (cleanName.includes('تعز') || taizzDistricts.some(district => cleanName.includes(district))) {
            return governorateCoords['تعز'];
        }

        for (const key of Object.keys(governorateCoords)) {
            if (cleanName === key || cleanName.includes(key) || key.includes(cleanName)) {
                return governorateCoords[key];
            }
        }
        
        return { lat: 15.5, lng: 44.5 };
    };

    // حدود اليمن لتقييد حركة الخريطة ضمن النطاق الجغرافي المطلوب
    const yemenBounds = [
        [12.0, 41.0], 
        [19.0, 55.0]  
    ];

    return (
        <div style={{ width: '100%', height: '100%', flex: 1, position: 'relative' }}>
            <MapContainer 
                center={[15.5, 47.5]} 
                zoom={6} 
                minZoom={6}
                maxZoom={13}
                maxBounds={yemenBounds}
                maxBoundsViscosity={1.0}
                style={{ width: '100%', height: '100%', background: '#f8fafc', zIndex: 1 }}
                scrollWheelZoom={true}
            >
                {/* طبقة الخريطة الأساسية */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
                    maxZoom={18}
                />

                {/* رسم الدوائر الزرقاء التجميعية لكل محافظة/منطقة مع عدد المشاريع */}
                {governorateData && Object.keys(governorateData).map((key) => {
                    const gov = governorateData[key];
                    const govName = gov.name ? gov.name.trim() : key;
                    const coords = getCoordsForGov(govName);
                    const count = gov.projects ? gov.projects.length : (gov.count || 0);

                    if (count === 0) return null;

                    const customIcon = L.divIcon({
                        className: 'custom-map-marker',
                        html: `<div style="
                            background-color: #1e40af; 
                            color: white; 
                            width: 34px; 
                            height: 34px; 
                            border-radius: 50%; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            font-weight: bold; 
                            font-size: 13px;
                            border: 2px solid white;
                            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                        ">${count}</div>`,
                        iconSize: [34, 34],
                        iconAnchor: [17, 17]
                    });

                    return (
                        <Marker 
                            key={key} 
                            position={[coords.lat, coords.lng]} 
                            icon={customIcon}
                            eventHandlers={{
                                click: () => {
                                    if (onSelectGovernorate) {
                                        onSelectGovernorate(govName);
                                    }
                                }
                            }}
                        >
                            <Popup>
                                <div style={{ textAlign: 'right', fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>
                                    <strong style={{ color: '#1e3a8a', fontSize: '14px' }}>{govName}</strong>
                                    <p style={{ margin: '5px 0', fontSize: '12px' }}>عدد المشاريع: {count}</p>
                                    <button 
                                        onClick={() => onSelectGovernorate && onSelectGovernorate(govName)}
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
        </div>
    );
};

export default MapComponent;