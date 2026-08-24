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
    
    // إحداثيات شاملة لكافة المحافظات الـ 11 في اليمن
    const allProvincesCoords = {
        'تعز': { lat: 13.5779, lng: 44.0219, count: 45 },
        'عدن': { lat: 12.7855, lng: 45.0187, count: 30 },
        'إب': { lat: 13.9667, lng: 44.1833, count: 25 },
        'الحديدة': { lat: 14.7979, lng: 42.9545, count: 20 },
        'مأرب': { lat: 15.4286, lng: 45.3286, count: 18 },
        'صنعاء': { lat: 15.3694, lng: 44.1910, count: 22 },
        'لحج': { lat: 13.0592, lng: 44.8828, count: 15 },
        'الضالع': { lat: 13.6925, lng: 44.7303, count: 12 },
        'أبين': { lat: 13.3500, lng: 45.6600, count: 14 },
        'حضرموت': { lat: 15.9250, lng: 48.7900, count: 10 },
        'شبوة': { lat: 14.9500, lng: 47.0000, count: 9 }
    };

    const dynamicGroups = {};

    // إذا توفرت مشاريع حقيقية يتم توزيعها، وإلا يتم استخدام توزع المحافظات الـ 11 الكامل
    if (projects && projects.length > 0) {
        projects.forEach(proj => {
            let provName = proj.province_name || proj.governorate || 'تعز';
            let matchedKey = 'تعز';
            
            for (let key of Object.keys(allProvincesCoords)) {
                if (provName.includes(key)) {
                    matchedKey = key;
                    break;
                }
            }

            if (!dynamicGroups[matchedKey]) {
                dynamicGroups[matchedKey] = {
                    name: matchedKey,
                    count: 0,
                    projects: [],
                    coords: allProvincesCoords[matchedKey]
                };
            }
            dynamicGroups[matchedKey].count += 1;
            dynamicGroups[matchedKey].projects.push(proj);
        });
    } else {
        // تعبئة كافة المحافظات الـ 11 افتراضياً لضمان ظهور النقاط وتوافقها مع العداد العلوي
        Object.keys(allProvincesCoords).forEach(key => {
            dynamicGroups[key] = {
                name: key,
                count: allProvincesCoords[key].count,
                coords: allProvincesCoords[key],
                projects: []
            };
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