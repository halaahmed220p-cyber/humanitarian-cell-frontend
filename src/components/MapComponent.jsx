import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({ projects = [], provincesList = [], onSelectGovernorate }) => {
    
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
        Object.keys(allProvincesCoords).forEach(key => {
            const sampleProjectsCount = allProvincesCoords[key].count;
            const sampleProjects = [];
            
            for (let i = 1; i <= sampleProjectsCount; i++) {
                sampleProjects.push({
                    project_name: `مشروع تنموي رقم ${i} في محافظة ${key}`,
                    program_name: i % 2 === 0 ? 'صرح' : 'وسم',
                    sector_name: i % 3 === 0 ? 'المياه' : (i % 2 === 0 ? 'التعليم' : 'الصحة'),
                    execution_year: '2024'
                });
            }

            dynamicGroups[key] = {
                name: key,
                count: sampleProjectsCount,
                coords: allProvincesCoords[key],
                projects: sampleProjects
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
                        html: `<div title="انقر لعرض مشاريع محافظة ${item.name}" style="
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
                            cursor: pointer;
                            transition: transform 0.2s;
                        " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">${item.count}</div>`,
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
                                    // عند النقر يتم اختيار المحافظة وتحديث القائمة الجانبية فوراً لتفادي مشكلة نوافذ الخريطة المقصوصة
                                    if (onSelectGovernorate) {
                                        onSelectGovernorate(item.name);
                                    }
                                }
                            }}
                        />
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default MapComponent;