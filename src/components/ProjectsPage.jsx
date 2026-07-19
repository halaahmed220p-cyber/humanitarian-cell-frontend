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
                    <input type="text" className="hac-dash-search-box" placeholder="🔍 البحث عن محافظة..." />
                    <div className="hac-dash-gov-list">
                        {Object.entries(govData).map(([key, gov]) => (
                            <div key={key} className="gov-list-item" onClick={() => handleSelectGovernorate(key)}>
                                <span>{gov.name}</span>
                                <span>{gov.projects} مشروع</span>
                            </div>
                        ))}
                    </div>
                    
                    {selectedGovProjects && (
                        <div className="selected-gov-details">
                            <h4>مشاريع {govName}</h4>
                            <p>إجمالي المشاريع: {selectedGovProjects.length}</p>
                        </div>
                    )}
                </aside>
            </main>
        </div>
    );
};

export default ProjectsPage;