import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({ projects = [], provincesList = [], onSelectGovernorate }) => {
    
    // خريطة دقيقة للإحداثيات تشمل المديريات والمناطق الفرعية
    const locationsCoords = {
        'صبر': { lat: 13.5200, lng: 44.0500 },
        'صالة': { lat: 13.5800, lng: 44.0400 },
        'تعز': { lat: 13.5779, lng: 44.0219 },
        'إب': { lat: 13.9667, lng: 44.1833 },
        'عدن': { lat: 12.7855, lng: 45.0187 },
        'الحديدة': { lat: 14.7979, lng: 42.9545 },
        'مأرب': { lat: 15.4286, lng: 45.3286 },
        'لحج': { lat: 13.0592, lng: 44.8828 },
        'الضالع': { lat: 13.6925, lng: 44.7303 },
        'أبين': { lat: 13.3500, lng: 45.6600 },
        'حضرموت': { lat: 15.9250, lng: 48.7900 },
        'الجوف': { lat: 16.5000, lng: 45.5000 },
        'البيضاء': { lat: 14.3300, lng: 45.5700 }
    };

    const dynamicGroups = {};

    if (projects && projects.length > 0) {
        projects.forEach(proj => {
            // فحص كافة الحقول المحتملة التي قد تحتوي على اسم المنطقة أو المديرية أو المحافظة
            let placeName = proj.district || proj.region || proj.area || proj.location || proj.province_name || proj.province || proj.governorate || 'تعز';
            
            let matchedKey = '';
            
            // البحث عن مطابقة دقيقة داخل النص (مثل البحث عن كلمة صبر أو إب أو تعز)
            for (let key of Object.keys(locationsCoords)) {
                if (placeName.includes(key)) {
                    matchedKey = key;
                    break;
                }
            }

            // إذا لم يتم العثور على مطابقة، نستخدم المحافظة أو القيمة الموجودة كاسم للموقع ونعطيه إحداثيات تعز الافتراضية
            if (!matchedKey) {
                matchedKey = placeName;
                if (!locationsCoords[matchedKey]) {
                    locationsCoords[matchedKey] = { lat: 13.5779 + (Math.random() * 0.1), lng: 44.0219 + (Math.random() * 0.1) };
                }
            }

            if (!dynamicGroups[matchedKey]) {
                dynamicGroups[matchedKey] = {
                    name: matchedKey,
                    count: 0,
                    projects: [],
                    coords: locationsCoords[matchedKey]
                };
            }

            dynamicGroups[matchedKey].count += 1;
            dynamicGroups[matchedKey].projects.push(proj);
        });
    }

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
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
                    maxZoom={18}
                />

                {Object.keys(dynamicGroups).map((key) => {
                    const item = dynamicGroups[key];
                    if (item.count === 0) return null;

                    const customIcon = L.divIcon({
                        className: 'custom-map-marker',
                        html: `<div style="
                            background-color: #1e40af; 
                            color: white; 
                            width: 36px; 
                            height: 36px; 
                            border-radius: 50%; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            font-weight: bold; 
                            font-size: 13px;
                            border: 2px solid white;
                            box-shadow: 0 4px 8px rgba(0,0,0,0.4);
                        ">${item.count}</div>`,
                        iconSize: [36, 36],
                        iconAnchor: [18, 18]
                    });

                    return (
                        <Marker 
                            key={key} 
                            position={[item.coords.lat, item.coords.lng]} 
                            icon={customIcon}
                            eventHandlers={{
                                click: () => {
                                    if (onSelectGovernorate) {
                                        onSelectGovernorate(item.name);
                                    }
                                }
                            }}
                        >
                            <Popup>
                                <div style={{ textAlign: 'right', fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>
                                    <strong style={{ color: '#1e3a8a', fontSize: '14px' }}>{item.name}</strong>
                                    <p style={{ margin: '5px 0', fontSize: '12px' }}>عدد المشاريع: {item.count}</p>
                                    <button 
                                        onClick={() => onSelectGovernorate && onSelectGovernorate(item.name)}
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