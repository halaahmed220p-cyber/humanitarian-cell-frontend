import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import './ProjectsPage.css';

const ProjectsPage = () => {
    // حالة لتخزين كافة المشاريع القادمة من جدول قاعدة البيانات
    const [projectsList, setProjectsList] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // حالات النوافذ المنبثقة
    const [selectedGovName, setSelectedGovName] = useState(null);
    const [isGovModalOpen, setIsGovModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    // جلب البيانات من جدول قاعدة البيانات عند تحميل الصفحة
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // استبدل الرابط أدناه برابط الـ API الفعلي الخاص بسيرفرك الذي يجلب البيانات من جدول projects
                const response = await fetch('https://humanitarian-cell-frontend.onrender.com/api/projects');
                const data = await response.json();
                setProjectsList(data);
                setLoading(false);
            } catch (err) {
                console.error('خطأ في جلب المشاريع من قاعدة البيانات:', err);
                setLoading(false);
                // بيانات افتراضية تجريبية مطابقة لهيكل الجدول في حال عدم اتصال السيرفر مؤقتاً
                setProjectsList([
                    { id: 1, title: 'مشروع التدخلات العاجلة للمياه', description: 'حفر وتأهيل آبار المياه.', status: 'قيد التنفيذ', location: 'تعز', full_details: 'تفاصيل شاملة عن مشروع مياه تعز...', image_url: '', needs_donation: true },
                    { id: 2, title: 'تأهيل الوحدات الصحية', description: 'تجهيز المراكز الطبية.', status: 'منفذة', location: 'تعز', full_details: 'تفاصيل شاملة عن الوحدات الصحية...', image_url: '', needs_donation: false },
                    { id: 3, title: 'دعم وتأهيل المدارس', description: 'صيانة المقاعد المدرسية.', status: 'قيد التنفيذ', location: 'صنعاء', full_details: 'تفاصيل مدارس صنعاء...', image_url: '', needs_donation: true },
                ]);
            }
        };

        fetchProjects();
    }, []);

    // تجميع المحافظات بناءً على عمود location في قاعدة البيانات
    const governoratesMap = {};
    projectsList.forEach(proj => {
        const loc = proj.location || 'أخرى';
        if (!governoratesMap[loc]) {
            governoratesMap[loc] = { name: loc, projects: [], completedCount: 0, inProgressCount: 0 };
        }
        governoratesMap[loc].projects.push(proj);
        if (proj.status === 'منفذة') governoratesMap[loc].completedCount++;
        if (proj.status === 'قيد التنفيذ') governoratesMap[loc].inProgressCount++;
    });

    const handleSelectGovernorate = (govName) => {
        setSelectedGovName(govName);
        setIsGovModalOpen(true);
    };

    const currentGovData = selectedGovName ? governoratesMap[selectedGovName] : null;

    // بيانات الرسوم البيانية الإحصائية العامة
    const chartData = [
        { name: 'منفذة', value: projectsList.filter(p => p.status === 'منفذة').length || 7, color: '#10b981' },
        { name: 'قيد التنفيذ', value: projectsList.filter(p => p.status === 'قيد التنفيذ').length || 3, color: '#f59e0b' },
        { name: 'مخططة', value: projectsList.filter(p => p.status === 'مخططة').length || 4, color: '#3b82f6' },
    ];

    return (
        <div className="hac-projects-page">
            {/* شريط الإحصائيات العلوي */}
            <div className="hac-projects-top-bar">
                <div className="top-bar-card">
                    <span className="top-num">{Object.keys(governoratesMap).length}</span>
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
                    <span className="top-num">{projectsList.length}</span>
                    <span className="top-label">إجمالي المشاريع</span>
                </div>
            </div>

            <main className="hac-dash-main-container">
                <section className="hac-dash-map-section">
                    <div className="hac-dash-map-wrapper">
                        <MapComponent governorateData={governoratesMap} onSelectGovernorate={handleSelectGovernorate} />
                    </div>
                    <div className="hac-dash-map-footer">
                        اضغط على أي محافظة لعرض مشاريعها المستدعية من قاعدة البيانات | تكبير/تصغير باستخدام عجلة الفأرة
                    </div>
                </section>

                <aside className="hac-dash-sidebar">
                  <div className="hac-dash-panel">
                    <h3 className="panel-title">المحافظات (من قاعدة البيانات)</h3>
                    
                    <div className="search-box">
                        <input type="text" placeholder="البحث عن محافظة..." />
                    </div>

                    <div className="filter-buttons">
                        <button className="filter-btn active">الكل</button>
                        <button className="filter-btn">منفذة</button>
                        <button className="filter-btn">قيد التنفيذ</button>
                        <button className="filter-btn">مخططة</button>
                    </div>

                    <div className="gov-list-container">
                        {Object.keys(governoratesMap).map((locKey) => {
                            const gov = governoratesMap[locKey];
                            return (
                                <div 
                                    key={locKey} 
                                    className={`gov-card-item ${selectedGovName === locKey ? 'active' : ''}`}
                                    onClick={() => handleSelectGovernorate(locKey)}
                                >
                                    <div className="gov-number-badge">{gov.projects.length}</div>
                                    <div className="gov-info">
                                        <span className="gov-name">{gov.name}</span>
                                        <span className="gov-details">مشاريع مسجلة: {gov.projects.length}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* مؤشر الأداء العام */}
                    <div className="hac-dash-performance-panel">
                        <h3 className="performance-title">مؤشر الأداء العام</h3>
                        <div className="title-divider"></div>

                        <div className="big-donut-chart">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={chartData}
                                cx="50%" cy="45%"
                                innerRadius={40}
                                outerRadius={65}
                                paddingAngle={2}
                                dataKey="value"
                                activeShape={false} 
                                isAnimationActive={false}
                              >
                                {chartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: 'none' }} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '4px', fontSize: '10px', padding: '5px' }} />
                            </PieChart>
                          </ResponsiveContainer>

                          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', position: 'absolute', bottom: '10px', width: '100%', fontSize: '9px', color: '#94a3b8' }}>
                            <span style={{ display: 'flex', alignItems: 'center' }}><i style={{ background: '#10b981', width: '8px', height: '8px', borderRadius: '2px', marginLeft: '4px' }}></i> منفذة</span>
                            <span style={{ display: 'flex', alignItems: 'center' }}><i style={{ background: '#f59e0b', width: '8px', height: '8px', borderRadius: '2px', marginLeft: '4px' }}></i> قيد التنفيذ</span>
                            <span style={{ display: 'flex', alignItems: 'center' }}><i style={{ background: '#3b82f6', width: '8px', height: '8px', borderRadius: '2px', marginLeft: '4px' }}></i> مخططة</span>
                          </div>
                        </div>
                    </div>
                  </div>
                </aside>
            </main>

            {/* النافذة الأولى: عرض مشاريع المحافظة المحددة من جدول قاعدة البيانات */}
            {isGovModalOpen && currentGovData && (
                <div className="hac-modal-overlay active" onClick={() => setIsGovModalOpen(false)}>
                    <div className="hac-modal-container" onClick={(e) => e.stopPropagation()}>
                        <button className="hac-modal-close" onClick={() => setIsGovModalOpen(false)}>&times;</button>
                        
                        <div className="hac-modal-header">
                            <span className="hac-modal-badge">مشاريع محافظة {currentGovData.name}</span>
                            <h2>سجلات قاعدة البيانات</h2>
                        </div>

                        <div className="hac-modal-stats">
                            <div className="hac-m-box">
                                <span className="m-val">{currentGovData.projects.length}</span>
                                <span className="m-lbl">إجمالي المشاريع</span>
                            </div>
                            <div className="hac-m-box">
                                <span className="m-val">{currentGovData.completedCount}</span>
                                <span className="m-lbl">مشاريع منفذة</span>
                            </div>
                            <div className="hac-m-box">
                                <span className="m-val">{currentGovData.inProgressCount}</span>
                                <span className="m-lbl">قيد التنفيذ</span>
                            </div>
                        </div>

                        <h4 className="hac-sub-title">قائمة المشاريع المرتبطة بـ location:</h4>
                        <div className="hac-projects-table-list" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                            {currentGovData.projects.map((proj) => (
                                <div key={proj.id} className="hac-proj-row-item">
                                    <div className="hac-proj-info-group">
                                        <h5>{proj.title}</h5>
                                        <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{proj.description}</p>
                                        <span className="hac-status-badge in-progress" style={{ marginTop: '5px', display: 'inline-block' }}>
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

            {/* النافذة العميقة لعرض أعمدة full_details وغيرها من جدول البيانات */}
            {selectedProject && (
                <div className="hac-modal-overlay active" style={{ zIndex: 3500 }} onClick={() => setSelectedProject(null)}>
                    <div className="hac-modal-container deep-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="hac-modal-close" onClick={() => setSelectedProject(null)}>&times;</button>
                        
                        <div className="hac-modal-header">
                            <span className="hac-modal-badge gold-bg">تفاصيل من قاعدة البيانات (ID: {selectedProject.id})</span>
                            <h2>{selectedProject.title}</h2>
                        </div>

                        <div className="deep-modal-content">
                            <div className="deep-info-block">
                                <strong>الوصف الأساسي (description):</strong>
                                <p>{selectedProject.description}</p>
                            </div>

                            <div className="deep-info-block" style={{ marginTop: '10px' }}>
                                <strong>التفاصيل الكاملة (full_details):</strong>
                                <p>{selectedProject.full_details || 'لا توجد تفاصيل إضافية مسجلة في قاعدة البيانات لهذا المشروع.'}</p>
                            </div>

                            <div className="deep-info-grid" style={{ marginTop: '15px' }}>
                                <div className="deep-box">
                                    <span className="deep-label">الحالة (status):</span>
                                    <span className="deep-val">{selectedProject.status}</span>
                                </div>
                                <div className="deep-box">
                                    <span className="deep-label">الموقع الجغرافي (location):</span>
                                    <span className="deep-val">{selectedProject.location}</span>
                                </div>
                            </div>
                        </div>

                        <div className="deep-actions">
                            <button className="hac-action-btn pdf-action" onClick={() => alert('جاري تحميل التقرير...')} style={{ width: '100%' }}>
                                تحميل تقرير المشروع (PDF)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsPage;