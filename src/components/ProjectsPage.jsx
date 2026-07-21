import React, { useState } from 'react';
import MapComponent from './MapComponent';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import './ProjectsPage.css';

const data = [
  { name: 'منفذة', value: 7, color: '#10b981' },
  { name: 'قيد التنفيذ', value: 3, color: '#f59e0b' },
  { name: 'مخططة', value: 4, color: '#3b82f6' },
];

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
    <h3 className="panel-title">المحافظات</h3>
    
    {/* حقل البحث */}
    <div className="search-box">
        <input type="text" placeholder="البحث عن محافظة..." />
    </div>

    {/* أزرار الفلترة العلوية (الكل، منفذة، قيد التنفيذ، مخططة) */}
    <div className="filter-buttons">
        <button className="filter-btn active">الكل</button>
        <button className="filter-btn">منفذة</button>
        <button className="filter-btn">قيد التنفيذ</button>
        <button className="filter-btn">مخططة</button>
    </div>

    {/* قائمة المحافظات */}
    <div className="gov-list-container">
        {/* مثال لبطاقة محافظة واحدة (تكرر ديناميكياً حسب بياناتك) */}
        <div className="gov-card-item">
            <div className="gov-number-badge">14</div>
            <div className="gov-info">
                <span className="gov-name">إب</span>
                <span className="gov-details">إنجاز %65 • مشاريع 14</span>
            </div>
        </div>
        
        <div className="gov-card-item">
            <div className="gov-number-badge">18</div>
            <div className="gov-info">
                <span className="gov-name">تعز</span>
                <span className="gov-details">إنجاز %48 • مشاريع 18</span>
            </div>
        </div>
    </div>
</div>
                </aside>
            </main>
        </div>
    );
};

export default ProjectsPage;