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
    
    // قاموس شامل وكبير يغطي محافظات ومديريات الجمهورية اليمنية
    const locationsCoords = {
        'تعز': { lat: 13.5779, lng: 44.0219 },
        'صبر': { lat: 13.5200, lng: 44.0500 },
        'صالة': { lat: 13.5800, lng: 44.0400 },
        'المخا': { lat: 13.3167, lng: 43.2500 },
        'إب': { lat: 13.9667, lng: 44.1833 },
        'عدن': { lat: 12.7855, lng: 45.0187 },
        'الحديدة': { lat: 14.7979, lng: 42.9545 },
        'صنعاء': { lat: 15.3694, lng: 44.1910 },
        'مأرب': { lat: 15.4286, lng: 45.3286 },
        'حضرموت': { lat: 15.9250, lng: 48.7900 },
        'تعز': { lat: 13.5779, lng: 44.0219 },
        'لحج': { lat: 13.0592, lng: 44.8828 },
        'الضالع': { lat: 13.6925, lng: 44.7303 },
        'أبين': { lat: 13.3500, lng: 45.6600 },
        'المهرة': { lat: 16.2000, lng: 51.1500 },
        'شبوة': { lat: 14.9500, lng: 47.0000 },
        'الجوف': { lat: 16.5000, lng: 45.5000 },
        'حجة': { lat: 15.7042, lng: 43.6011 },
        'ذمار': { lat: 14.5428, lng: 44.4056 },
        'عمران': { lat: 15.6572, lng: 43.9453 },
        'البيضاء': { lat: 14.3300, lng: 45.5700 },
        'صعدة': { lat: 16.9400, lng: 43.7639 },
        'سقطرى': { lat: 12.4634, lng: 53.8237 }
    };

    const dynamicGroups = {};

    // تجميع المشاريع الحقيقية القادمة من قاعدة البيانات والفلترة بشكل كامل
    if (projects && projects.length > 0) {
        projects.forEach(proj => {
            // البحث عن مكان المشروع في مختلف الحقول الممكنة
            let placeName = proj.district || proj.region || proj.area || proj.location || proj.province_name || proj.province || proj.governorate || 'تعز';
            
            let matchedKey = '';
            for (let key of Object.keys(locationsCoords)) {
                if (placeName.includes(key)) {
                    matchedKey = key;
                    break;
                }
            }

            // إذا لم يتم مطابقة الكلمة، نستخدم اسم الموقع الوارد أو نصنفه تحت تعز افتراضياً
            if (!matchedKey) {
                matchedKey = 'تعز';
            }

            if (!dynamicGroups[matchedKey]) {
                dynamicGroups[matchedKey] = {
                    name: matchedKey,
                    count: 0,
                    projects: [],
                    coords: locationsCoords[matchedKey] || locationsCoords['تعز']
                };
            }

            dynamicGroups[dynamicGroups[matchedKey] ? matchedKey : 'تعز'].count += 1;
            dynamicGroups[matchedKey].projects.push(proj);
        });
    }

    const yemenBounds = [
        [12.0, 41.0], 
        [19.0, 55.0]  
    ];

    return (
        <div style={{ width: '100%', height: '100%', minHeight: '400px', flex: 1, position: 'relative' }}>
            <MapContainer 
                center={[15.5, 47.5]} 
                zoom={6} 
                minZoom={6}
                maxZoom={13}
                maxBounds={yemenBounds}
                maxBoundsViscosity={1.0}
                style={{ width: '100%', height: '100%', minHeight: '400px', background: '#f8fafc', zIndex: 1 }}
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
                            width: 38px; 
                            height: 38px; 
                            border-radius: 50%; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            font-weight: bold; 
                            font-size: 13px;
                            border: 2px solid white;
                            box-shadow: 0 4px 8px rgba(0,0,0,0.4);
                        ">${item.count}</div>`,
                        iconSize: [38, 38],
                        iconAnchor: [19, 19]
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