import React, { useState } from 'react';
import MapComponent from './MapComponent';
import './ProjectsPage.css';

const ProjectsPage = () => {
    // بيانات تجريبية (يتم استبدالها لاحقاً ببيانات الـ API)
    const [govData] = useState({
        taiz: { name: 'تعز', coords: [13.57, 44.01], projects: 18, completion: 65 },
        sanaa: { name: 'صنعاء', coords: [15.36, 44.19], projects: 15, completion: 75 }
    });

    return (
        <div className="hac-dash-wrapper">
            <div className="hac-dash-stats-section">
                <div className="hac-dash-kpi-container">
                    <div className="hac-dash-kpi-card"><div className="hac-dash-kpi-value">207</div><div className="hac-dash-kpi-label">إجمالي المشاريع</div></div>
                    <div className="hac-dash-kpi-card"><div className="hac-dash-kpi-value">1002$</div><div className="hac-dash-kpi-label">الميزانية</div></div>
                    <div className="hac-dash-kpi-card"><div className="hac-dash-kpi-value">58%</div><div className="hac-dash-kpi-label">نسبة الإنجاز</div></div>
                </div>
            </div>

            <main className="hac-dash-main-container">
                <div className="hac-dash-map-section">
                    <div className="hac-dash-card-title">الخريطة التفاعلية للجمهورية اليمنية</div>
                    <div className="hac-dash-map-wrapper">
                        <MapComponent 
                            governorateData={govData} 
                            onSelectGovernorate={(id) => console.log("تم اختيار:", id)} 
                        />
                    </div>
                </div>

                <div className="hac-dash-sidebar">
                    <div className="hac-dash-panel">
                        <input type="text" className="hac-dash-search-box" placeholder="🔍 البحث عن محافظة..." />
                        <div className="hac-dash-gov-list"></div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProjectsPage;