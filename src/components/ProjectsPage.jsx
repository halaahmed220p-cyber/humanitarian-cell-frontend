import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Chart } from 'chart.js/auto';
import './ProjectsPage.css'; // ضعي هنا جميع الـ CSS من ملف الـ HTML الخاص بكِ

const ProjectsPage = () => {
    
    useEffect(() => {
        // هنا نضع كود الـ JavaScript الخاص بكِ للتعامل مع الخريطة والبيانات
        // ملاحظة: تأكدي من إزالة أي كود يتعلق بـ DOM من خارج الـ useEffect
        
        // مثال لتهيئة الخريطة كما في ملفكِ الأصلي
        const map = L.map('map', {
            center: [15.5, 45.5],
            zoom: 6,
            zoomControl: true,
            attributionControl: false
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO'
        }).addTo(map);

        // هنا يمكنك إضافة منطق لجلب البيانات من السيرفر (Render) لاحقاً
        // fetch('https://humanitarian-cell-frontend.onrender.com/api/projects')...

        return () => map.remove(); // تنظيف الخريطة عند إغلاق الصفحة
    }, []);

    return (
        <div className="main-container">
            <div className="map-section">
                <div className="map-card fade-in">
                    <div className="card-header">
                        <div className="card-title">
                            <i className="fas fa-globe-asia"></i>
                            <span>الخريطة التفاعلية للجمهورية اليمنية</span>
                        </div>
                    </div>
                    {/* الحاوية التي ستظهر فيها الخريطة */}
                    <div id="map" style={{ height: "500px", width: "100%" }}></div>
                </div>
            </div>
            
            <div className="sidebar">
                <div className="panel">
                    <div className="card-header">
                        <div className="card-title"><i className="fas fa-city"></i><span>المحافظات</span></div>
                    </div>
                    <input type="text" className="search-box" id="searchGov" placeholder="🔍 البحث عن محافظة..." />
                    <div className="gov-list" id="govList"></div>
                </div>

                <div className="panel projects-panel">
                    <div className="card-header">
                        <div className="card-title"><i className="fas fa-tasks"></i><span id="projectsPanelTitle">المشاريع</span></div>
                    </div>
                    <div id="projectsContent">
                        <div className="empty-state">
                            <i className="fas fa-map-marked-alt"></i>
                            <h3>اختر محافظة</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectsPage;