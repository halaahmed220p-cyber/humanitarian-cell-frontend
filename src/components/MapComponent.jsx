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
    
    // قاموس الإحداثيات الشامل مع معالجة مرنة للاسم
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
        'أبين': { lat: 13.3500, lng: 45.6600 },
        'صنعاء': { lat: 15.3694, lng: 44.1910 },
        'إب': { lat: 13.9667, lng: 44.1833 }
    };

    const getCoordsForGov = (name) => {
        if (!name) return { lat: 15.5, lng: 44.5 };
        // تنظيف النص تماماً من كلمة محافظة والمسافات والهمزات لتتم المطابقة بنجاح
        const cleanName = String(name)
            .replace(/محافظة/g, '')
            .replace(/[أإآا]/g, 'ا')
            .trim();
        
        for (const key of Object.keys(governorateCoords)) {
            const cleanKey = key.replace(/[أإآا]/g, 'ا');
            if (cleanName.includes(cleanKey) || cleanKey.includes(cleanName)) {
                return governorateCoords[key];
            }
        }
        return { lat: 15.5, lng: 44.5 }; // مركز افتراضي في وسط اليمن إذا لم تطابق
    };

    // تجميع مرن جداً يضمن عدم ضياع أي مشروع مفلتر
    const groupedData = {};

    // 1. التهيئة الأولية بناءً على قاعدة البيانات (provincesList)
    if (provincesList && provincesList.length > 0) {
        provincesList.forEach(prov => {
            groupedData[prov.id] = {
                id: prov.id,
                name: prov.name,
                count: 0,
                projects: []
            };
        });
    }

    // 2. توزيع المشاريع المفلترة
    projects.forEach(proj => {
        // محاولة مطابقة الـ ID أو الاسم النصي للمحافظة من المشروع
        let targetKey = null;
        
        if (proj.province_id && groupedData[proj.province_id]) {
            targetKey = proj.province_id;
        } else {
            // البحث بالاسم إذا لم يتوفر ID مباشر
            const pName = proj.province_name || proj.province || proj.region;
            if (pName) {
                const found = Object.keys(groupedData).find(k => 
                    groupedData[k].name && pName.includes(groupedData[k].name)
                );
                if (found) {
                    targetKey = found;
                } else {
                    // إذا لم توجد في القائمة الأساسية، نضيفها كمنطقة جديدة مباشرة
                    const customKey = `custom_${pName}`;
                    if (!groupedData[customKey]) {
                        groupedData[customKey] = { id: customKey, name: pName, count: 0, projects: [] };
                    }
                    targetKey = customKey;
                }
            }
        }

        if (targetKey && groupedData[targetKey]) {
            groupedData[targetKey].count += 1;
            groupedData[targetKey].projects.push(proj);
        }
    });

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

                {Object.keys(groupedData).map((key) => {
                    const gov = groupedData[key];
                    const count = gov.count;

                    if (count === 0) return null; // تخطي المناطق التي ليس لها مشاريع مفلترة

                    const coords = getCoordsForGov(gov.name);

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
        </div>
    );
};

export default MapComponent;