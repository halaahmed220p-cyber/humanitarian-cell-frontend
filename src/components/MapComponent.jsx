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
        <div style={{ width: '100%', height: '100%', minHeight: '450px', flex: 1, position: 'relative' }}>
            <style>
                {`
                    .leaflet-popup-content-wrapper {
                        background: #ffffff !important;
                        border-radius: 12px !important;
                        padding: 0 !important;
                        box-shadow: 0 15px 30px rgba(0,0,0,0.3) !important;
                    }
                    .leaflet-popup-content {
                        margin: 10px 14px !important;
                        line-height: 1.4;
                    }
                `}
            </style>

            <MapContainer 
                center={[15.5, 47.5]} 
                zoom={6} 
                minZoom={6}
                maxZoom={13}
                maxBounds={yemenBounds}
                maxBoundsViscosity={1.0}
                style={{ width: '100%', height: '100%', minHeight: '450px', background: '#f8fafc', zIndex: 1 }}
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
                            cursor: pointer;
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
                            {/* إضافة offset لرفع مكان ظهور الـ Popup للأعلى قليلاً وضمان نزوله للأسفل بعيداً عن حافة الإطار */}
                            <Popup maxWidth={325} minWidth={300} offset={[0, -10]} autoPan={true} autoPanPadding={[60, 60]}>
                                <div style={{ 
                                    textAlign: 'right', 
                                    fontFamily: 'Cairo, sans-serif', 
                                    direction: 'rtl',
                                    width: '100%'
                                }}>
                                    {/* رأس النافذة */}
                                    <div style={{ 
                                        borderBottom: '2px solid #e2e8f0', 
                                        paddingBottom: '8px', 
                                        marginBottom: '10px' 
                                    }}>
                                        <h3 style={{ margin: '0 0 4px 0', color: '#1e3a8a', fontSize: '15px', fontWeight: 'bold' }}>
                                            محافظة {item.name}
                                        </h3>
                                        <span style={{ color: '#64748b', fontSize: '11px' }}>
                                            المحافظة: {item.name} | إجمالي المشاريع: {item.count}
                                        </span>
                                    </div>

                                    {/* قائمة المشاريع الداخلية مع شريط تمرير مرتب وغير مقصوص */}
                                    <div style={{ maxHeight: '250px', overflowY: 'auto', paddingLeft: '4px', paddingRight: '2px' }}>
                                        {item.projects && item.projects.length > 0 ? (
                                            item.projects.map((proj, idx) => (
                                                <div key={idx} style={{ 
                                                    background: '#f8fafc', 
                                                    border: '1px solid #e2e8f0', 
                                                    borderRadius: '6px', 
                                                    padding: '8px', 
                                                    marginBottom: '8px',
                                                    borderRight: '4px solid #0284c7'
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <span style={{ 
                                                            fontSize: '10px', 
                                                            background: '#e0f2fe', 
                                                            color: '#0369a1', 
                                                            padding: '2px 6px', 
                                                            borderRadius: '4px',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {proj.program_name || 'صرح'}
                                                        </span>
                                                    </div>
                                                    <p style={{ margin: '6px 0 4px 0', fontSize: '12px', fontWeight: 'bold', color: '#1e293b' }}>
                                                        {proj.project_name || proj.name}
                                                    </p>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                                                        <span>{proj.sector_name || proj.sector || 'تنمية'}</span>
                                                        <span>{proj.execution_year || '2024'}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center' }}>لا توجد مشاريع مفصلة</p>
                                        )}
                                    </div>
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