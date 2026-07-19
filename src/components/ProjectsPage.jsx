import React, { useState } from 'react';
import MapComponent from './MapComponent';
import './ProjectsPage.css';

const ProjectsPage = () => {
    // بيانات تجريبية (يتم تحديثها لاحقاً بربطها بالسيرفر)
    const [govData] = useState({
        taiz: { name: 'تعز', coords: [13.57, 44.01], projects: 18, completion: 65 },
        sanaa: { name: 'صنعاء', coords: [15.36, 44.19], projects: 15, completion: 75 },
        aden: { name: 'عدن', coords: [12.78, 45.01], projects: 12, completion: 80 },
        hodiedah: { name: 'الحديدة', coords: [14.80, 42.95], projects: 20, completion: 40 },
        ibbi: { name: 'إب', coords: [13.97, 44.17], projects: 10, completion: 55 },
        hadramout: { name: 'حضرموت', coords: [15.50, 48.50], projects: 25, completion: 90 },
        marib: { name: 'مأرب', coords: [15.45, 45.32], projects: 8, completion: 45 },
    });

    const [selectedGovProjects, setSelectedGovProjects] = useState(null);
    const [loading, setLoading] = useState(false);
    const [govName, setGovName] = useState("");

    // دالة التعامل مع النقر على المحافظة
    const handleSelectGovernorate = (govId) => {
        setLoading(true);
        setGovName(govData[govId]?.name || "المحافظة");
        
        fetch(`http://localhost:3000/api/projects/${govId}`)
            .then(res => res.json())
            .then(data => {
                setSelectedGovProjects(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("خطأ:", err);
                setLoading(false);
            });
    };

    return (
        <div className="hac-dash-wrapper">
            <header className="hac-dash-stats-header">
                <div className="hac-dash-kpi-container">
                    <div className="hac-dash-kpi-card">
                        <div className="hac-dash-kpi-value">207</div>
                        <div className="hac-dash-kpi-label">إجمالي المشاريع</div>
                    </div>
                    <div className="hac-dash-kpi-card">
                        <div className="hac-dash-kpi-value">1002$</div>
                        <div className="hac-dash-kpi-label">الميزانية</div>
                    </div>
                    <div className="hac-dash-kpi-card">
                        <div className="hac-dash-kpi-value">58%</div>
                        <div className="hac-dash-kpi-label">نسبة الإنجاز</div>
                    </div>
                </div>
            </header>

            <main className="hac-dash-main-container">
                <div className="hac-dash-map-section">
                    <h2 className="hac-dash-card-title">الخريطة التفاعلية للجمهورية اليمنية</h2>
                    <div className="hac-dash-map-wrapper">
                        <MapComponent 
                            governorateData={govData} 
                            onSelectGovernorate={handleSelectGovernorate} 
                        />
                        {/* تذييل الخريطة الاحترافي */}
                        <div className="hac-dash-map-footer">
                            <span>اضغط على أي محافظة لعرض مشاريعها</span>
                            <span>تحريك الخريطة: اسحب بالفأرة</span>
                        </div>
                    </div>
                </div>

                <aside className="hac-dash-sidebar">
    <div className="hac-dash-panel">
        <h3 className="sidebar-title">المحافظات</h3>
        <input type="text" className="hac-dash-search-box" placeholder="🔍 البحث عن محافظة..." />
        
        {/* تصنيفات الحالة */}
        <div className="status-filters">
            <button className="active">الكل</button>
            <button>منفذة</button>
            <button>قيد التنفيذ</button>
        </div>

        {/* قائمة المحافظات مع الإحصائيات */}
        <div className="hac-dash-gov-list">
            {Object.entries(govData).map(([key, gov]) => (
                <div key={key} className="gov-list-item" onClick={() => handleSelectGovernorate(key)}>
                    <span>{gov.name}</span>
                    <span className="gov-stat">{gov.projects} مشروع</span>
                </div>
            ))}
        </div>
    </div>
</aside>
            </main>
        </div>
    );
};

export default ProjectsPage;