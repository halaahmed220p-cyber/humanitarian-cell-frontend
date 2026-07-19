import React from 'react';
import './ProjectsPage.css'; // تأكدي أن هذا الملف يحتوي على الـ CSS الذي نقلناه

const ProjectsPage = () => {
    return (
        <div className="projects-page-wrapper">
            {/* الهيدر الذي صممتِه */}
            <header className="header">
                <div className="logo-section">
                    <div className="flag-container"><div className="flag-middle"><span>☪</span></div></div>
                    <div className="title-section">
                        <h1>منصة المشاريع التنموية</h1>
                        <p>الجمهورية اليمنية - نظام متابعة المشاريع ومؤشرات الأداء</p>
                    </div>
                </div>
                {/* حاوية الإحصائيات (KPIs) */}
                <div className="kpi-container">
                    <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-project-diagram"></i></div><div className="kpi-value" id="totalProjects">0</div><div className="kpi-label">إجمالي المشاريع</div></div>
                    <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-dollar-sign"></i></div><div className="kpi-value" id="totalBudget">$0</div><div className="kpi-label">الميزانية</div></div>
                    <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-chart-line"></i></div><div className="kpi-value" id="completionRate">0%</div><div className="kpi-label">نسبة الإنجاز</div></div>
                </div>
            </header>

            {/* الحاوية الرئيسية (الخريطة + القائمة الجانبية) */}
            <main className="main-container">
                <div className="map-section">
                    <div className="map-card">
                        <div className="card-header">
                            <div className="card-title"><i className="fas fa-globe-asia"></i><span>الخريطة التفاعلية</span></div>
                        </div>
                        {/* هنا سيظهر الـ Map الخاص بـ Leaflet */}
                        <div id="map"></div>
                    </div>
                </div>

                <div className="sidebar">
                    <div className="panel">
                        <div className="card-header"><div className="card-title"><span>المحافظات</span></div></div>
                        <input type="text" className="search-box" id="searchGov" placeholder="🔍 البحث..." />
                        <div className="gov-list" id="govList"></div>
                    </div>
                    
                    <div className="panel projects-panel">
                        <div className="card-header"><div className="card-title"><span>المشاريع</span></div></div>
                        <div id="projectsContent"></div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProjectsPage;