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
    // تم إثراء بيانات المحافظات بقائمة مشاريع مصغرة وتفاصيل لتعمل مع نظام النوافذ المنبثقة
    const [govData] = useState({
        taiz: { 
            id: 'taiz', 
            name: 'تعز', 
            coords: [13.57, 44.01], 
            projects: 18, 
            completion: 65,
            totalBudget: '350,000$',
            totalBeneficiaries: '15,000+',
            projectList: [
                { id: 101, title: 'مشروع التدخلات العاجلة للمياه', status: 'جاري التنفيذ', statusClass: 'in-progress', desc: 'حفر وتأهيل آبار المياه وتوزيع الشاحنات الإستراتيجية للأسر المتضررة.', timeline: '01/01/2026 - 01/12/2026', executor: 'خلية الأعمال الإنسانية' },
                { id: 102, title: 'تأهيل الوحدات الصحية الريفية', status: 'مكتمل', statusClass: 'completed', desc: 'تجهيز وتوفير الأدوية والمستلزمات الطبية للمراكز الصحية.', timeline: '15/05/2025 - 30/11/2025', executor: 'شريك محلي' }
            ]
        },
        sanaa: { 
            id: 'sanaa', 
            name: 'صنعاء', 
            coords: [15.36, 44.19], 
            projects: 15, 
            completion: 75,
            totalBudget: '420,000$',
            totalBeneficiaries: '22,000+',
            projectList: [
                { id: 201, title: 'دعم وتأهيل المدارس الأساسية', status: 'جاري التنفيذ', statusClass: 'in-progress', desc: 'صيانة المقاعد المدرسية وترميم الفصول الدراسية المتضررة.', timeline: '10/02/2026 - 10/09/2026', executor: 'خلية الأعمال الإنسانية' }
            ]
        },
        aden: { 
            id: 'aden', 
            name: 'عدن', 
            coords: [12.78, 45.01], 
            projects: 12, 
            completion: 80,
            totalBudget: '280,000$',
            totalBeneficiaries: '18,000+',
            projectList: [
                { id: 301, title: 'مبادرة التمكين الاقتصادي للأسر العفيفة', status: 'مخططة', statusClass: 'planned', desc: 'توفير مشاريع صغيرة مستدامة للنساء المعيلات.', timeline: '01/09/2026 - 01/03/2027', executor: 'خلية الأعمال الإنسانية' }
            ]
        },
        hodiedah: { 
            id: 'hodiedah', 
            name: 'الحديدة', 
            coords: [14.80, 42.95], 
            projects: 20, 
            completion: 40,
            totalBudget: '310,000$',
            totalBeneficiaries: '19,000+',
            projectList: [
                { id: 401, title: 'مشروع الأمن الغذائي الساحل الغربي', status: 'جاري التنفيذ', statusClass: 'in-progress', desc: 'توزيع حصص غذائية متكاملة.', timeline: '01/02/2026 - 01/08/2026', executor: 'خلية الأعمال الإنسانية' }
            ]
        },
        ibbi: { 
            id: 'ibbi', 
            name: 'إب', 
            coords: [13.97, 44.17], 
            projects: 10, 
            completion: 55,
            totalBudget: '190,000$',
            totalBeneficiaries: '9,000+',
            projectList: [
                { id: 501, title: 'شق وتعبيد الطرق الفرعية', status: 'مكتمل', statusClass: 'completed', desc: 'تسهيل وصول القوافل الإغاثية.', timeline: '01/01/2025 - 01/05/2025', executor: 'خلية الأعمال الإنسانية' }
            ]
        },
        hadramout: { 
            id: 'hadramout', 
            name: 'حضرموت', 
            coords: [15.50, 48.50], 
            projects: 25, 
            completion: 90,
            totalBudget: '550,000$',
            totalBeneficiaries: '30,000+',
            projectList: [
                { id: 601, title: 'تطوير القطاع الزراعي والمائي', status: 'مكتمل', statusClass: 'completed', desc: 'حفر آبار ارتوازية للطاقة البديلة.', timeline: '01/03/2026 - 01/06/2026', executor: 'خلية الأعمال الإنسانية' }
            ]
        },
        marib: { 
            id: 'marib', 
            name: 'مأرب', 
            coords: [15.45, 45.32], 
            projects: 8, 
            completion: 45,
            totalBudget: '200,000$',
            totalBeneficiaries: '12,000+',
            projectList: [
                { id: 701, title: 'إيواء النازحين وتوفير الخيام', status: 'قيد التنفيذ', statusClass: 'in-progress', desc: 'تقديم وحدات إيوائية عاجلة.', timeline: '15/04/2026 - 15/10/2026', executor: 'خلية الأعمال الإنسانية' }
            ]
        },
    });

    const [selectedKey, setSelectedKey] = useState(null);
    // حالة للتحكم بفتح نافذة قائمة المشاريع الخاصة بالمحافظة
    const [isGovModalOpen, setIsGovModalOpen] = useState(false);
    // حالة للتحكم بفتح النافذة العميقة لتفاصيل المشروع الواحد
    const [selectedProject, setSelectedProject] = useState(null);

    const handleSelectGovernorate = (key) => {
        setSelectedKey(key);
        setIsGovModalOpen(true); // فتح النافذة المنبثقة فور الضغط على المحافظة
    };

    const currentGov = selectedKey ? govData[selectedKey] : null;

    return (
        <div className="hac-projects-page">
            {/* شريط الإحصائيات العلوي العام (أسفل الهيدر مباشرة) */}
            <div className="hac-projects-top-bar">
                <div className="top-bar-card">
                    <span className="top-num">21</span>
                    <span className="top-label">المحافظات</span>
                </div>
                <div className="top-bar-card">
                    <span className="top-num">58%</span>
                    <span className="top-label">نسبة الإنجاز</span>
                </div>
                <div className="top-bar-card">
                    <span className="top-num">1002$</span>
                    <span className="top-label">الميزانية (مليون)</span>
                </div>
                <div className="top-bar-card">
                    <span className="top-num">207</span>
                    <span className="top-label">إجمالي المشاريع</span>
                </div>
            </div>

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
                    
                    {/* صندوق البحث */}
                    <div className="search-box">
                        <input type="text" placeholder="البحث عن محافظة..." />
                    </div>

                    {/* أزرار الفلترة الأربعة */}
                    <div className="filter-buttons">
                        <button className="filter-btn active">الكل</button>
                        <button className="filter-btn">منفذة</button>
                        <button className="filter-btn">قيد التنفيذ</button>
                        <button className="filter-btn">مخططة</button>
                    </div>

                    {/* قائمة المحافظات */}
                    <div className="gov-list-container">
                        {Object.entries(govData).map(([key, gov]) => (
                            <div 
                                key={key} 
                                className={`gov-card-item ${selectedKey === key ? 'active' : ''}`}
                                onClick={() => handleSelectGovernorate(key)}
                            >
                                <div className="gov-number-badge">{gov.projects}</div>
                                <div className="gov-info">
                                    <span className="gov-name">{gov.name}</span>
                                    <span className="gov-details">إنجاز %{gov.completion} • مشاريع {gov.projects}</span>
                                </div>
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
                                    <div className="stat-card"><span>95</span><span className="stat-label">مليون $</span></div>
                                    <div className="stat-card"><span>{currentGov.projects}</span><span className="stat-label">المشاريع</span></div>
                                    <div className="stat-card"><span>4</span><span className="stat-label">منفذة</span></div>
                                    <div className="stat-card"><span>3</span><span className="stat-label">قيد التنفيذ</span></div>
                                </div>
                                <div className="small-donut-chart">
                                    <span className="percentage-text">{currentGov.completion}%</span>
                                </div>
                            </div>

                            {/* الرسم البياني الدائري الكبير في الأسفل */}
                            <div className="big-donut-chart">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={data}
                                    cx="50%" cy="45%"
                                    innerRadius={40}
                                    outerRadius={65}
                                    paddingAngle={2}
                                    dataKey="value"
                                    activeShape={false} 
                                    isAnimationActive={false}
                                  >
                                    {data.map((entry, index) => (
                                      <Cell 
                                        key={`cell-${index}`} 
                                        fill={entry.color} 
                                        style={{ outline: 'none' }} 
                                      />
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

            {/* 1 & 2. النافذة المنبثقة الأولى: بطاقات المعلومات الحية وقائمة المشاريع المصغرة للمحافظة المختارة */}
            {isGovModalOpen && currentGov && (
                <div className="hac-modal-overlay active" onClick={() => setIsGovModalOpen(false)}>
                    <div className="hac-modal-container" onClick={(e) => e.stopPropagation()}>
                        <button className="hac-modal-close" onClick={() => setIsGovModalOpen(false)}>&times;</button>
                        
                        <div className="hac-modal-header">
                            <span className="hac-modal-badge">مشاريع محافظة {currentGov.name}</span>
                            <h2>لوحة معلومات المحافظة</h2>
                        </div>

                        {/* أولاً: بطاقة المعلومات الحية (Data Cards) */}
                        <div className="hac-modal-stats">
                            <div className="hac-m-box">
                                <span className="m-val">{currentGov.totalBudget}</span>
                                <span className="m-lbl">إجمالي الميزانية</span>
                            </div>
                            <div className="hac-m-box">
                                <span className="m-val">{currentGov.totalBeneficiaries}</span>
                                <span className="m-lbl">المستفيدون</span>
                            </div>
                            <div className="hac-m-box">
                                <span className="m-val">{currentGov.completion}%</span>
                                <span className="m-lbl">نسبة الإنجاز</span>
                            </div>
                        </div>

                        {/* ثانياً: شبكة المشاريع المصغرة (Project List View) */}
                        <h4 className="hac-sub-title">قائمة المشاريع الخاصة بالمحافظة:</h4>
                        <div className="hac-projects-table-list">
                            {currentGov.projectList && currentGov.projectList.map((proj) => (
                                <div key={proj.id} className="hac-proj-row-item">
                                    <div className="hac-proj-info-group">
                                        <h5>{proj.title}</h5>
                                        <span className={`hac-status-badge ${proj.statusClass}`}>
                                            {proj.status}
                                        </span>
                                    </div>
                                    <button className="hac-detail-open-btn" onClick={() => setSelectedProject(proj)}>
                                        عرض التفاصيل الكاملة
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button className="hac-action-btn" onClick={() => setIsGovModalOpen(false)} style={{ marginTop: '20px' }}>إغلاق القائمة</button>
                    </div>
                </div>
            )}

            {/* 3. النافذة التبويبية العميقة (Deep-Dive Modal) لتفاصيل المشروع الواحد */}
            {selectedProject && (
                <div className="hac-modal-overlay active" style={{ zIndex: 3500 }} onClick={() => setSelectedProject(null)}>
                    <div className="hac-modal-container deep-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="hac-modal-close" onClick={() => setSelectedProject(null)}>&times;</button>
                        
                        <div className="hac-modal-header">
                            <span className="hac-modal-badge gold-bg">تفاصيل المشروع العميق</span>
                            <h2>{selectedProject.title}</h2>
                        </div>

                        <div className="deep-modal-content">
                            <div className="deep-info-block">
                                <strong>وصف المشروع:</strong>
                                <p>{selectedProject.desc}</p>
                            </div>

                            <div className="deep-info-grid">
                                <div className="deep-box">
                                    <span className="deep-label">الجدول الزمني:</span>
                                    <span className="deep-val">{selectedProject.timeline}</span>
                                </div>
                                <div className="deep-box">
                                    <span className="deep-label">الجهة المنفذة:</span>
                                    <span className="deep-val">{selectedProject.executor}</span>
                                </div>
                            </div>
                        </div>

                        <div className="deep-actions">
                            <button className="hac-action-btn donate-action">دعم المشروع / تبرع</button>
                            <button className="hac-action-btn pdf-action" onClick={() => alert('جاري تحميل التقرير...')}>تحميل تقرير المشروع (PDF)</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsPage;