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
    // يمكنك إضافة باقي المحافظات بنفس هذا النمط
});

    const [selectedGovProjects, setSelectedGovProjects] = useState(null);
    const [loading, setLoading] = useState(false);
    const [govName, setGovName] = useState("");

    // دالة التعامل مع النقر على المحافظة
    const handleSelectGovernorate = (govId) => {
        setLoading(true);
        setGovName(govData[govId]?.name || "المحافظة");
        
        // محاكاة جلب البيانات من السيرفر
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
                    </div>
                </div>

                <aside className="hac-dash-sidebar">
                    <div className="hac-dash-panel">
                        <h3>{govName ? `مشاريع: ${govName}` : "اختر محافظة"}</h3>
                        <div className="hac-dash-gov-list">
                            {loading ? <p>جاري تحميل المشاريع...</p> : 
                             selectedGovProjects ? (
                                selectedGovProjects.length > 0 ? 
                                selectedGovProjects.map(p => <div key={p.id} className="project-item">{p.title}</div>) 
                                : <p>لا توجد مشاريع في هذه المحافظة.</p>
                            ) : <p>يرجى النقر على محافظة من الخريطة.</p>}
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default ProjectsPage;