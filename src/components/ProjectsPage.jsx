import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './ProjectsPage.css';

const ProjectsPage = () => {
    useEffect(() => {
        // 1. تهيئة الخريطة
        const map = L.map('map', {
            center: [15.5, 45.5],
            zoom: 6,
            attributionControl: false
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

        // 2. تحديث الإحصائيات (KPIs)
        document.getElementById('totalProjects').innerText = "207";
        document.getElementById('totalBudget').innerText = "1002$";
        document.getElementById('completionRate').innerText = "58%";

        return () => map.remove(); // تنظيف عند إغلاق الصفحة
    }, []);

    return (
        <div className="projects-page-wrapper">
            <div className="stats-section-container">
                <div className="kpi-container">
                    <div className="kpi-card"><div className="kpi-value" id="totalProjects">0</div><div className="kpi-label">إجمالي المشاريع</div></div>
                    <div className="kpi-card"><div className="kpi-value" id="totalBudget">$0</div><div className="kpi-label">الميزانية</div></div>
                    <div className="kpi-card"><div className="kpi-value" id="completionRate">0%</div><div className="kpi-label">نسبة الإنجاز</div></div>
                </div>
            </div>

            <main className="main-container">
                <div className="map-section">
                    <div className="map-card">
                        <div className="card-title">الخريطة التفاعلية</div>
                        <div id="map" style={{ height: "400px" }}></div>
                    </div>
                </div>
                <div className="sidebar">
                    <div className="panel">
                        <input type="text" className="search-box" placeholder="البحث..." />
                        <div id="govList"></div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProjectsPage;