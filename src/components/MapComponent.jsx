import React, { useState } from 'react';
import ReactDOM from 'react-dom';
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
    const [selectedGovData, setSelectedGovData] = useState(null);
    
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

    const handleMarkerClick = (item) => {
        if (onSelectGovernorate) {
            onSelectGovernorate(item.name);
        }
        setSelectedGovData(item);
    };

    return (
        <div style={{ width: '100%', height: '100%', minHeight: '450px', flex: 1, position: 'relative' }}>
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
                            background-color: #eab308; 
                            color: #0b132b; 
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
                                click: () => handleMarkerClick(item)
                            }}
                        />
                    );
                })}
            </MapContainer>

            {/* النافذة المنبثقة بلون هوية زر التبرع تماماً */}
            {selectedGovData && ReactDOM.createPortal(
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(11, 19, 43, 0.8)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 999999,
                    fontFamily: 'Cairo, sans-serif',
                    direction: 'rtl',
                    margin: 0,
                    padding: 0
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98))',
                        border: '1px solid rgba(234, 179, 8, 0.5)', 
                        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
                        borderRadius: '16px',
                        width: '90%',
                        maxWidth: '550px',
                        maxHeight: '85vh',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}>
                        {/* رأس النافذة */}
                        <div style={{
                            padding: '20px 24px',
                            borderBottom: '1px solid rgba(234, 179, 8, 0.25)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h3 style={{ margin: '0 0 5px 0', color: '#ffffff', fontSize: '18px', fontWeight: 'bold' }}>
                                    محافظة {selectedGovData.name}
                                </h3>
                                <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                                    إجمالي المشاريع المسجلة: <strong style={{ color: '#eab308' }}>{selectedGovData.count}</strong>
                                </span>
                            </div>
                            <button 
                                onClick={() => setSelectedGovData(null)}
                                style={{
                                    background: 'rgba(234, 179, 8, 0.15)',
                                    border: '1px solid rgba(234, 179, 8, 0.4)',
                                    color: '#eab308',
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    fontSize: '18px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = '#eab308';
                                    e.target.style.color = '#0b132b';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'rgba(234, 179, 8, 0.15)';
                                    e.target.style.color = '#eab308';
                                }}
                            >
                                &times;
                            </button>
                        </div>

                        {/* محتوى المشاريع */}
                        <div style={{
                            padding: '20px 24px',
                            overflowY: 'auto',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            <h4 style={{ margin: '0 0 5px 0', color: '#cbd5e1', fontSize: '14px' }}>أبرز المشاريع في المحافظة:</h4>
                            {selectedGovData.projects && selectedGovData.projects.length > 0 ? (
                                selectedGovData.projects.map((proj, idx) => (
                                    <div key={idx} style={{
                                        background: 'rgba(255, 255, 255, 0.04)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        borderRadius: '10px',
                                        padding: '12px 16px',
                                        borderRight: '4px solid #eab308' // الخط الجانبي بلون الهوية الأصفر
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                            <span style={{
                                                fontSize: '11px',
                                                background: 'rgba(234, 179, 8, 0.15)',
                                                color: '#eab308',
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                fontWeight: 'bold',
                                                border: '1px solid rgba(234, 179, 8, 0.3)'
                                            }}>
                                                {proj.program_name || 'صرح'}
                                            </span>
                                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                                                {proj.execution_year || '2024'}
                                            </span>
                                        </div>
                                        <p style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 'bold', color: '#f1f5f9' }}>
                                            {proj.project_name || proj.name}
                                        </p>
                                        <span style={{ fontSize: '12px', color: '#cbd5e1' }}>
                                            القطاع: {proj.sector_name || proj.sector || 'تنمية'}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>لا توجد مشاريع مضافة حالياً</p>
                            )}
                        </div>

                        {/* تذييل النافذة */}
                        <div style={{
                            padding: '16px 24px',
                            borderTop: '1px solid rgba(234, 179, 8, 0.25)',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            background: 'rgba(15, 23, 42, 0.6)'
                        }}>
                            <button 
                                onClick={() => setSelectedGovData(null)}
                                style={{
                                    background: '#eab308',
                                    color: '#0b132b',
                                    border: 'none',
                                    padding: '8px 24px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(234, 179, 8, 0.35)',
                                    transition: 'opacity 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                                onMouseLeave={(e) => e.target.style.opacity = '1'}
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default MapComponent;