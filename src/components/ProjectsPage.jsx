import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import './ProjectsPage.css';

const ProjectsPage = () => {
    const [projectsList, setProjectsList] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // حالات الفلترة والبحث
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMainProgram, setSelectedMainProgram] = useState('الكل');
    const [selectedSeasonalProgram, setSelectedSeasonalProgram] = useState('الكل');
    const [selectedSector, setSelectedSector] = useState('الكل');
    const [selectedAdministrativeArea, setSelectedAdministrativeArea] = useState('عرض كلي');

    const [selectedGovName, setSelectedGovName] = useState(null);
    const [isGovModalOpen, setIsGovModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    // جلب المشاريع من السيرفر المرتبط بقاعدة البيانات
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('https://humanitarian-cell-frontend.onrender.com/api/projects');
                const data = await response.json();
                setProjectsList(data);
                setLoading(false);
            } catch (err) {
                console.error('خطأ في جلب المشاريع من السيرفر:', err);
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // استخراج القوائم ديناميكياً من البيانات القادمة من قاعدة البيانات (بدون قيم ثابتة)
    const uniqueMainPrograms = ['الكل', ...new Set(projectsList.map(p => p.main_program).filter(Boolean))];
    const uniqueSeasonalPrograms = ['الكل', ...new Set(projectsList.map(p => p.seasonal_program).filter(Boolean))];
    const uniqueSectors = ['الكل', ...new Set(projectsList.map(p => p.sector).filter(Boolean))];
    const uniqueLocations = ['عرض كلي', ...new Set(projectsList.map(p => p.location).filter(Boolean))];

    // تصفية المشاريع بناءً على الفلاتر وحقول البحث
    const filteredProjects = projectsList.filter(proj => {
        const matchesSearch = searchTerm === '' || 
            (proj.title && proj.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (proj.description && proj.description.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesMainProgram = selectedMainProgram === 'الكل' || proj.main_program === selectedMainProgram;
        const matchesSeasonal = selectedSeasonalProgram === 'الكل' || proj.seasonal_program === selectedSeasonalProgram;
        const matchesSector = selectedSector === 'الكل' || proj.sector === selectedSector;
        const matchesAdmin = selectedAdministrativeArea === 'عرض كلي' || proj.location === selectedAdministrativeArea;

        return matchesSearch && matchesMainProgram && matchesSeasonal && matchesSector && matchesAdmin;
    });

    // تجميع المشاريع المصفاة حسب الموقع للخريطة والقائمة
    const governoratesMap = {};
    filteredProjects.forEach(proj => {
        const loc = proj.location ? proj.location.trim() : 'أخرى';
        if (!governoratesMap[loc]) {
            governoratesMap[loc] = { 
                name: loc, 
                projects: [], 
                completedCount: 0, 
                inProgressCount: 0,
                plannedCount: 0
            };
        }
        governoratesMap[loc].projects.push(proj);

        if (proj.status === 'منفذة' || proj.status === 'مكتمل') governoratesMap[loc].completedCount++;
        else if (proj.status === 'قيد التنفيذ' || proj.status === 'جديد') governoratesMap[loc].inProgressCount++;
        else governoratesMap[loc].plannedCount++;
    });

    const handleSelectGovernorate = (govName) => {
        setSelectedGovName(govName);
        setIsGovModalOpen(true);
    };

    const currentGovData = selectedGovName ? governoratesMap[selectedGovName] : null;

    // إحصائيات الرسم البياني الدائري
    const completedTotal = filteredProjects.filter(p => p.status === 'منفذة' || p.status === 'مكتمل').length;
    const inProgressTotal = filteredProjects.filter(p => p.status === 'قيد التنفيذ' || p.status === 'جديد').length;
    const plannedTotal = filteredProjects.length - (completedTotal + inProgressTotal);

    const chartData = [
        { name: 'منفذة', value: completedTotal > 0 ? completedTotal : 1, color: '#10b981' },
        { name: 'قيد التنفيذ / جديد', value: inProgressTotal > 0 ? inProgressTotal : 1, color: '#f59e0b' },
        { name: 'مخططة', value: plannedTotal > 0 ? plannedTotal : 1, color: '#3b82f6' },
    ];

    return (
        <div className="hac-projects-page">
            {/* شريط الإحصائيات العلوي */}
            <div className="hac-projects-top-bar">
                <div className="top-bar-card">
                    <span className="top-num">{Object.keys(governoratesMap).length}</span>
                    <span className="top-label">المناطق / المحافظات</span>
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
                    <span className="top-num">{filteredProjects.length}</span>
                    <span className="top-label">إجمالي المشاريع</span>
                </div>
            </div>

            <main className="hac-dash-main-container">
                <section className="hac-dash-map-section">
                    <div className="hac-dash-map-wrapper">
                        <MapComponent governorateData={governoratesMap} onSelectGovernorate={handleSelectGovernorate} />
                    </div>
                    <div className="hac-dash-map-footer">
                        اضغط على أي منطقة لعرض مشاريعها من قاعدة البيانات | تكبير/تصغير باستخدام عجلة الفأرة
                    </div>
                </section>

                <aside className="hac-dash-sidebar" style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
                  <div className="hac-dash-panel">
                    
                    {/* حقل البحث */}
                    <div className="search-box" style={{ marginBottom: '15px' }}>
                        <input 
                            type="text" 
                            placeholder="بحث باسم المشروع أو الوصف..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                        />
                    </div>

                    {/* البرامج الرئيسية (تُجلب ديناميكياً من قاعدة البيانات) */}
                    <h4 style={{ fontSize: '13px', marginBottom: '8px', color: '#1e293b' }}>البرامج الرئيسية</h4>
                    <div className="filter-buttons" style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '15px' }}>
                        {uniqueMainPrograms.map(prog => (
                            <button 
                                key={prog} 
                                className={`filter-btn ${selectedMainProgram === prog ? 'active' : ''}`}
                                onClick={() => setSelectedMainProgram(prog)}
                            >
                                {prog}
                            </button>
                        ))}
                    </div>

                    {/* المشاريع الموسمية (تُجلب ديناميكياً من قاعدة البيانات) */}
                    <h4 style={{ fontSize: '13px', marginBottom: '8px', color: '#1e293b' }}>المشاريع الموسمية</h4>
                    <div className="filter-buttons" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '15px' }}>
                        {uniqueSeasonalPrograms.map(season => (
                            <button 
                                key={season} 
                                className={`filter-btn ${selectedSeasonalProgram === season ? 'active' : ''}`}
                                onClick={() => setSelectedSeasonalProgram(season)}
                                style={{ fontSize: '11px', padding: '4px 8px' }}
                            >
                                {season}
                            </button>
                        ))}
                    </div>

                    {/* التصفية حسب المركز الإداري (تُجلب ديناميكياً) */}
                    <h4 style={{ fontSize: '13px', marginBottom: '8px', color: '#1e293b' }}>التصفية حسب المركز الإداري</h4>
                    <div style={{ marginBottom: '15px' }}>
                        <select 
                            value={selectedAdministrativeArea} 
                            onChange={(e) => setSelectedAdministrativeArea(e.target.value)}
                            style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                        >
                            {uniqueLocations.map(loc => (
                                <option key={loc} value={loc}>{loc === 'عرض كلي' ? 'جميع المناطق والمراكز الإدارية (عرض كلي)' : loc}</option>
                            ))}
                        </select>
                    </div>

                    {/* القطاعات التنموية (تُجلب ديناميكياً من قاعدة البيانات) */}
                    <h4 style={{ fontSize: '13px', marginBottom: '8px', color: '#1e293b' }}>القطاعات التنموية</h4>
                    <div className="filter-buttons" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '15px' }}>
                        {uniqueSectors.map(sector => (
                            <button 
                                key={sector} 
                                className={`filter-btn ${selectedSector === sector ? 'active' : ''}`}
                                onClick={() => setSelectedSector(sector)}
                                style={{ fontSize: '11px', padding: '4px 8px' }}
                            >
                                {sector}
                            </button>
                        ))}
                    </div>

                    <h3 className="panel-title" style={{ marginTop: '15px' }}>نتائج المشاريع بحسب المناطق ({filteredProjects.length} مشروع)</h3>
                    
                    <div className="gov-list-container" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {loading ? (
                            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>جاري التحميل...</p>
                        ) : Object.keys(governoratesMap).length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>لا توجد بيانات مطابقة</p>
                        ) : (
                            Object.keys(governoratesMap).map((locKey) => {
                                const gov = governoratesMap[locKey];
                                const completionRate = Math.round((gov.completedCount / gov.projects.length) * 100) || 50;
                                return (
                                    <div 
                                        key={locKey} 
                                        className={`gov-card-item ${selectedGovName === locKey ? 'active' : ''}`}
                                        onClick={() => handleSelectGovernorate(locKey)}
                                    >
                                        <div className="gov-number-badge">{gov.projects.length}</div>
                                        <div className="gov-info">
                                            <span className="gov-name">{gov.name}</span>
                                            <span className="gov-details">إنجاز %{completionRate} • مشاريع {gov.projects.length}</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* مؤشر الأداء العام */}
                    <div className="hac-dash-performance-panel" style={{ marginTop: '20px', position: 'relative', height: '140px' }}>
                        <h3 className="performance-title">مؤشر الأداء العام</h3>
                        <div className="title-divider"></div>

                        <div className="big-donut-chart" style={{ height: '90px' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={chartData}
                                cx="50%" cy="45%"
                                innerRadius={35}
                                outerRadius={55}
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

                          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', position: 'absolute', bottom: '2px', width: '100%', fontSize: '9px', color: '#94a3b8' }}>
                            <span style={{ display: 'flex', alignItems: 'center' }}><i style={{ background: '#10b981', width: '6px', height: '6px', borderRadius: '2px', marginLeft: '3px' }}></i> منفذة</span>
                            <span style={{ display: 'flex', alignItems: 'center' }}><i style={{ background: '#f59e0b', width: '6px', height: '6px', borderRadius: '2px', marginLeft: '3px' }}></i> قيد التنفيذ</span>
                            <span style={{ display: 'flex', alignItems: 'center' }}><i style={{ background: '#3b82f6', width: '6px', height: '6px', borderRadius: '2px', marginLeft: '3px' }}></i> مخططة</span>
                          </div>
                        </div>
                    </div>

                  </div>
                </aside>
            </main>

            {/* نوافذ عرض التفاصيل (Modals) نفس الكود السابق */}
            {isGovModalOpen && currentGovData && (
                <div className="hac-modal-overlay active" onClick={() => setIsGovModalOpen(false)}>
                    <div className="hac-modal-container" onClick={(e) => e.stopPropagation()}>
                        <button className="hac-modal-close" onClick={() => setIsGovModalOpen(false)}>&times;</button>
                        
                        <div className="hac-modal-header">
                            <span className="hac-modal-badge">مشاريع منطقة {currentGovData.name}</span>
                            <h2>لوحة معلومات المنطقة</h2>
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
                                <span className="m-lbl">قيد التنفيذ / جديد</span>
                            </div>
                        </div>

                        <h4 className="hac-sub-title">جميع المشاريع التابعة للمنطقة:</h4>
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

            {selectedProject && (
                <div className="hac-modal-overlay active" style={{ zIndex: 3500 }} onClick={() => setSelectedProject(null)}>
                    <div className="hac-modal-container deep-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="hac-modal-close" onClick={() => setSelectedProject(null)}>&times;</button>
                        
                        <div className="hac-modal-header">
                            <span className="hac-modal-badge gold-bg">تفاصيل المشروع العميق (ID: {selectedProject.id})</span>
                            <h2>{selectedProject.title}</h2>
                        </div>

                        <div className="deep-modal-content">
                            <div className="deep-info-block">
                                <strong>وصف المشروع:</strong>
                                <p>{selectedProject.description}</p>
                            </div>

                            <div className="deep-info-block" style={{ marginTop: '10px' }}>
                                <strong>التفاصيل الكاملة (full_details):</strong>
                                <p>{selectedProject.full_details || 'لا توجد تفاصيل إضافية مسجلة.'}</p>
                            </div>

                            <div className="deep-info-grid" style={{ marginTop: '15px' }}>
                                <div className="deep-box">
                                    <span className="deep-label">الحالة:</span>
                                    <span className="deep-val">{selectedProject.status}</span>
                                </div>
                                <div className="deep-box">
                                    <span className="deep-label">الموقع:</span>
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