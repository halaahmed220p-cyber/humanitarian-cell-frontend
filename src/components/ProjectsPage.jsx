import React, { useState } from 'react';
import MapComponent from './MapComponent';
import './ProjectsPage.css';

const ProjectsPage = () => {
    // تم تحديث البيانات لتشمل المحافظات التي تظهر في النموذج
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
    const [govName, setGovName] = useState("");

    const handleSelectGovernorate = (govId) => {
        setGovName(govData[govId]?.name);
        // محاكاة جلب البيانات
        setSelectedGovProjects([{ id: 1, title: 'مشروع تجريبي 1' }, { id: 2, title: 'مشروع تجريبي 2' }]);
    };

    return (
        <div className="hac-dash-wrapper">
            <main className="hac-dash-main-container">
                <div className="hac-dash-map-section">
                    <div className="hac-dash-map-wrapper">
                        <MapComponent governorateData={govData} onSelectGovernorate={handleSelectGovernorate} />
                    </div>
                    <div className="hac-dash-map-footer">
                        اضغط على أي محافظة لعرض مشاريعها | تكبير/تصغير باستخدام عجلة الفأرة
                    </div>
                </div>

              <aside className="hac-dash-sidebar">
    <div className="hac-dash-panel">
        <h3 className="sidebar-title">المحافظات</h3>
        <input type="text" className="hac-dash-search-box" placeholder="🔍 البحث عن محافظة..." />
        
        {/* قائمة المحافظات */}
        <div className="hac-dash-gov-list">
            {Object.entries(govData).map(([key, gov]) => (
                <div key={key} className="gov-list-item" onClick={() => handleSelectGovernorate(key)}>
                    <span>{gov.name}</span>
                    <span className="gov-stat">{gov.projects} مشروع</span>
                </div>
            ))}
        </div>

        {/* قسم مؤشر الأداء - يظهر فقط عند اختيار محافظة */}
        {selectedGovProjects && (
            <div className="hac-dash-performance-panel">
                <h3>مؤشر الأداء: {govName}</h3>
                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-value">{govData[Object.keys(govData).find(k => govData[k].name === govName)]?.projects || 0}</span>
                        <span className="stat-label">المشاريع</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">95</span>
                        <span className="stat-label">مليون $</span>
                    </div>
                </div>
                <div className="completion-bar">
                    <span>نسبة الإنجاز: {govData[Object.keys(govData).find(k => govData[k].name === govName)]?.completion || 0}%</span>
                </div>
            </div>
        )}
    </div>
</aside>
            </main>
        </div>
    );
};

export default ProjectsPage;