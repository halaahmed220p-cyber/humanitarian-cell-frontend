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
    <div className="hac-dash-performance-panel">
    <h3 className="performance-title">مؤشر الأداء: {currentGov.name}</h3>
    <div className="title-divider"></div>

    {/* الحاوية التي تجمع الشبكة والدائرة الصغيرة */}
    <div className="stats-inner-container" style={{ display: 'flex', alignItems: 'center' }}>
        <div className="stats-grid">
            {/* البطاقات الأربع */}
            <div className="stat-card"><span>95</span><span className="stat-label">مليون $</span></div>
            <div className="stat-card"><span>{currentGov.projects}</span><span className="stat-label">المشاريع</span></div>
            <div className="stat-card"><span>4</span><span className="stat-label">منفذة</span></div>
            <div className="stat-card"><span>3</span><span className="stat-label">قيد التنفيذ</span></div>
        </div>
        <div className="small-donut-chart">
            <span className="percentage-text">{currentGov.completion}%</span>
        </div>
    </div>

    

    {/* الرسم البياني الكبير */}
    {/* الرسم البياني الدائري الكبير في الأسفل */}
<div className="big-donut-chart">
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={data}
        cx="50%" cy="45%" // رفع الدائرة قليلاً للأعلى لتوفير مساحة للمفاتيح
        innerRadius={40}
        outerRadius={65}
        paddingAngle={2}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip 
        contentStyle={{ 
          backgroundColor: '#1e293b', 
          border: 'none', 
          borderRadius: '4px',
          fontSize: '10px', 
          padding: '5px' 
        }} 
        itemStyle={{ color: '#fff', fontSize: '10px' }}
      />
    </PieChart>
  </ResponsiveContainer>

  {/* مفاتيح البيانات مضافة يدوياً بتنسيق صغير أسفل الدائرة */}
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    position: 'absolute',
    bottom: '10px',
    width: '100%',
    fontSize: '9px',
    color: '#94a3b8'
  }}>
    <span style={{ display: 'flex', alignItems: 'center' }}>
      <i style={{ background: '#10b981', width: '8px', height: '8px', borderRadius: '2px', marginLeft: '4px' }}></i> منفذة
    </span>
    <span style={{ display: 'flex', alignItems: 'center' }}>
      <i style={{ background: '#f59e0b', width: '8px', height: '8px', borderRadius: '2px', marginLeft: '4px' }}></i> قيد التنفيذ
    </span>
    <span style={{ display: 'flex', alignItems: 'center' }}>
      <i style={{ background: '#3b82f6', width: '8px', height: '8px', borderRadius: '2px', marginLeft: '4px' }}></i> مخططة
    </span>
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