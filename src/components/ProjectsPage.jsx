import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './ProjectsPage.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const ProjectsPage = () => {
    useEffect(() => {
        // تهيئة الخريطة
        const map = L.map('map', {
            center: [15.5, 45.5],
            zoom: 6,
            attributionControl: false
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

        // هنا يمكنك إضافة النقاط (Markers) لاحقاً
        
        // تنظيف الخريطة عند تغيير الصفحة لتجنب الأخطاء
        return () => map.remove();
    }, []);

    return (
        <div className="projects-page-wrapper">
            {/* قسم الإحصائيات المدمج */}
            <div className="stats-section-container">
                <div className="kpi-container">
                    <div className="kpi-card"><div className="kpi-value">207</div><div className="kpi-label">إجمالي المشاريع</div></div>
                    <div className="kpi-card"><div className="kpi-value">1002$</div><div className="kpi-label">الميزانية</div></div>
                    <div className="kpi-card"><div className="kpi-value">58%</div><div className="kpi-label">نسبة الإنجاز</div></div>
                </div>
            </div>

            <main className="main-container">
                <div className="map-section">
                    <div className="map-card">
                        <div className="card-title">الخريطة التفاعلية للجمهورية اليمنية</div>
                        {/* هذا هو الـ div الذي سيعرض الخريطة */}
                        <div id="map"></div>
                    </div>
                </div>

                <div className="sidebar">
                    <div className="panel">
                        <input type="text" className="search-box" placeholder="🔍 البحث عن محافظة..." />
                        <div id="govList"></div>
                    </div>
                    <div className="panel projects-panel">
                        <div className="card-title">المشاريع</div>
                        <div id="projectsContent"></div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProjectsPage;