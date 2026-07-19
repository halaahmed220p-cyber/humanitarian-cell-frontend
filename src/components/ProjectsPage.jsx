import React, { useState } from 'react';
import MapComponent from './MapComponent';
import './ProjectsPage.css';

const ProjectsPage = () => {
    const [govData] = useState({
        taiz: { name: 'تعز', coords: [13.57, 44.01], projects: 18, completion: 65 },
        sanaa: { name: 'صنعاء', coords: [15.36, 44.19], projects: 15, completion: 75 },
        aden: { name: 'عدن', coords: [12.78, 45.01], projects: 12, completion: 80 },
        hodiedah: { name: 'الحديدة', coords: [14.80, 42.95], projects: 20, completion: 40 },
        ibbi: { name: 'إب', coords: [13.97, 44.17], projects: 10, completion: 55 },
        hadramout: { name: 'حضرموت', coords: [15.50, 48.50], projects: 25, completion: 90 },
        marib: { name: 'مأرب', coords: [15.45, 45.32], projects: 8, completion: 45 },
    });

    const [selectedKey, setSelectedKey] = useState(null);

    const handleSelectGovernorate = (key) => {
        setSelectedKey(key);
    };

    const currentGov = selectedKey ? govData[selectedKey] : null;

    return (
        <div className="hac-dash-wrapper">
            <main className="hac-dash-main-container">
                <section className="hac-dash-map-section">
                    <div className="hac-dash-map-wrapper">
                        <MapComponent governorateData={govData} onSelectGovernorate={handleSelectGovernorate} />
                    </div>
                    <div className="hac-dash-map-footer">
                        اضغط على أي محافظة لعرض مشاريعها | تكبير/تصغير باستخدام عجلة الفأرة
                    </div>
                </section>

                <aside className="hac-dash-sidebar">
                    <div className="hac-dash-panel">
                        <h3 className="sidebar-title">المحافظات</h3>
                        <input type="text" className="hac-dash-search-box" placeholder="🔍 البحث عن محافظة..." />

                        <div className="hac-dash-gov-list">
                            {Object.entries(govData).map(([key, gov]) => (
                                <div key={key} className={`gov-list-item ${selectedKey === key ? 'active' : ''}`} onClick={() => handleSelectGovernorate(key)}>
                                    <span>{gov.name}</span>
                                    <span className="gov-stat">{gov.projects} مشروع</span>
                                </div>
                            ))}
                        </div>

                       {currentGov && (
    <div className="performance-panel active">
        <div className="card-header">
            <h3>مؤشر الأداء: {currentGov.name}</h3>
        </div>
        <div className="performance-ring-container">
            {/* الدائرة التحليلية */}
            <div className="ring-wrapper">
                 {/* يمكنكِ هنا إضافة الرسم البياني أو الاكتفاء بالبطاقات كما طلبتِ */}
                 <div className="stat-value" style={{fontSize: '2rem'}}>{currentGov.completion}%</div>
            </div>
            {/* البطاقات المربعة كما في صورتك */}
            <div className="performance-stats">
                <div className="perf-stat">
                    <div className="perf-stat-value">95</div>
                    <div className="perf-stat-label">مليون $</div>
                </div>
                <div className="perf-stat">
                    <div className="perf-stat-value">{currentGov.projects}</div>
                    <div className="perf-stat-label">المشاريع</div>
                </div>
            </div>
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