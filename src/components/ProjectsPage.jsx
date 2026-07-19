import React from 'react';
import './ProjectsPage.css';

const ProjectsPage = () => {
    return (
        <div className="projects-page-wrapper">
            
            {/* قسم الإحصائيات: أصبح الآن قسماً مستقلاً داخل الصفحة بدلاً من هيدر */}
            <div className="stats-section-container">
                <div className="kpi-container">
                    <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-project-diagram"></i></div><div className="kpi-value" id="totalProjects">0</div><div className="kpi-label">إجمالي المشاريع</div></div>
                    <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-dollar-sign"></i></div><div className="kpi-value" id="totalBudget">$0</div><div className="kpi-label">الميزانية</div></div>
                    <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-chart-line"></i></div><div className="kpi-value" id="completionRate">0%</div><div className="kpi-label">نسبة الإنجاز</div></div>
                </div>
            </div>

            {/* الحاوية الرئيسية (الخريطة + القائمة الجانبية) */}
            <main className="main-container">
                <div className="map-section">
                    <div className="map-card">
                        <div className="card-header">
                            <div className="card-title"><i className="fas fa-globe-asia"></i><span>الخريطة التفاعلية</span></div>
                        </div>
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