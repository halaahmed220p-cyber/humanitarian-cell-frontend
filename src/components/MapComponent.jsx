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

const MapComponent = ({ projectsData, onSelectProject }) => {
    // إحداثيات مركز اليمن الافتراضية
    const yemenCenter = [15.5, 47.5];

    const yemenBounds = [
        [12.0, 41.0], 
        [19.0, 55.0]  
    ];

    return (
        <div style={{ width: '100%', height: '100%', flex: 1, position: 'relative' }}>
            <MapContainer 
                center={yemenCenter} 
                zoom={6} 
                minZoom={6}
                maxZoom={15}
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

                {/* المرور على كل المشاريع ورسم علامة لكل مشروع بناءً على إحداثياته الدقيقة */}
                {projectsData && Array.isArray(projectsData) && projectsData.map((project, index) => {
                    const lat = parseFloat(project.خط_العرض_Latitude || project.latitude);
                    const lng = parseFloat(project.خط_الطول_Longitude || project.longitude);

                    // تخطي المشاريع التي لا تحتوي على إحداثيات صحيحة
                    if (isNaN(lat) || isNaN(lng)) return null;

                    const customIcon = L.divIcon({
                        className: 'custom-map-marker',
                        html: `<div style="
                            background-color: #1e40af; 
                            color: white; 
                            width: 24px; 
                            height: 24px; 
                            border-radius: 50%; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            font-weight: bold; 
                            font-size: 11px;
                            border: 2px solid white;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                        ">•</div>`,
                        iconSize: [24, 24],
                        iconAnchor: [12, 12]
                    });

                    return (
                        <Marker 
                            key={project.الرقم_التسلسلي || index} 
                            position={[lat, lng]} 
                            icon={customIcon}
                        >
                            <Popup>
                                <div style={{ textAlign: 'right', fontFamily: 'Cairo, sans-serif', direction: 'rtl', minWidth: '180px' }}>
                                    <strong style={{ color: '#1e3a8a', fontSize: '13px' }}>
                                        {project.اسم_المشروع_المعتمد || 'مشروع بدون عنوان'}
                                    </strong>
                                    <p style={{ margin: '4px 0', fontSize: '11px', color: '#4b5563' }}>
                                        <strong>المحافظة:</strong> {project.المحافظة}
                                    </p>
                                    <p style={{ margin: '4px 0', fontSize: '11px', color: '#4b5563' }}>
                                        <strong>القطاع:</strong> {project.القطاع_التنموي}
                                    </p>
                                    <p style={{ margin: '4px 0', fontSize: '11px', color: '#4b5563' }}>
                                        <strong>المستفيدين:</strong> {project.عدد_المستفيدين}
                                    </p>
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