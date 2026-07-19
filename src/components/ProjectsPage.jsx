import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './ProjectsPage.css';

const ProjectsPage = () => {
    useEffect(() => {
        // نضع الكود داخل setTimeout لضمان تحميل العنصر في الدوم
        const timer = setTimeout(() => {
            const mapContainer = document.getElementById('map');
            if (mapContainer && !mapContainer._leaflet_id) {
                const map = L.map('map').setView([15.5, 45.5], 6);
                L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="projects-page-wrapper">
            <div className="main-container">
                <div className="map-card">
                    <div className="card-title">الخريطة التفاعلية</div>
                    {/* هنا الارتفاع ثابت ومباشر */}
                    <div id="map" style={{ height: "400px", width: "100%" }}></div>
                </div>
            </div>
        </div>
    );
};

export default ProjectsPage;