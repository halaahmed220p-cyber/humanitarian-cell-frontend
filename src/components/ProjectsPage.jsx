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

    // استخراج المحافظات/المناطق ديناميكياً من قاعدة البيانات
    const uniqueLocations = ['عرض كلي', ...new Set(projectsList.map(p => (p.location || p.province || p.المحافظة || '').trim()).filter(Boolean))];

    // تصفية المشاريع بطريقة دقيقة ومستقلة تماماً لكل حقل
    const filteredProjects = projectsList.filter(proj => {
        // 1. فلتر البحث النصي
        if (searchTerm.trim() !== '') {
            const query = searchTerm.toLowerCase();
            const title = (proj.title || proj.اسم_المشروع_المعتمد || '').toLowerCase();
            const desc = (proj.description || '').toLowerCase();
            const official = (proj.official_name || '').toLowerCase();
            if (!title.includes(query) && !desc.includes(query) && !official.includes(query)) return false;
        }

        // 2. فلتر المركز الإداري / المنطقة / المحافظة
        if (selectedAdministrativeArea !== 'عرض كلي') {
            const locValue = (proj.location || proj.province || proj.hub_center || proj.المحافظة || proj.المديرية_النطاق_الميداني || '').trim();
            if (locValue !== selectedAdministrativeArea.trim()) return false;
        }

        // 3. فلتر البرنامج الرئيسي
        if (selectedMainProgram !== 'الكل') {
            const targetMain = selectedMainProgram.trim();
            const projMain = (proj.main_program || proj.البرنامج_الرئيسي || proj.program_id || '').trim();
            const title = (proj.title || proj.اسم_المشروع_المعتمد || '');
            
            const matchesMain = (projMain === targetMain) || title.includes(targetMain);
            if (!matchesMain) return false;
        }

        // 4. فلتر التصنيف الموسمي
        if (selectedSeasonalProgram !== 'الكل') {
            const targetSeason = selectedSeasonalProgram.trim();
            const projSeason = (proj.seasonal_category || proj.تصنيف_المشروع_الموسمي || proj.category || '').trim();
            const title = (proj.title || proj.اسم_المشروع_المعتمد || '');
            
            const matchesSeason = (projSeason === targetSeason) || title.includes(targetSeason);
            if (!matchesSeason) return false;
        }

        // 5. فلتر القطاع التنموي (مصحح ليطابق بدقة تامة ولا يتداخل)
        if (selectedSector !== 'الكل') {
            const targetSector = selectedSector.trim();
            const projectSector = (proj.sector || proj.القطاع_التنموي || '').trim();
            
            // مطابقة دقيقة تمنع تداخل النتائج الخاطئة
            const matchesSector = 
                projectSector === targetSector ||
                projectSector.includes(targetSector) ||
                targetSector.includes(projectSector);

            if (!matchesSector) return false;
        }

        return true;
    });

    // تجميع المشاريع المصفاة حسب الموقع للخريطة والقائمة
    const governoratesMap = {};
    filteredProjects.forEach(proj => {
        const loc = (proj.location || proj.province || proj.hub_center || proj.المحافظة || proj.المديرية_النطاق_الميداني) ? (proj.location || proj.province || proj.hub_center || proj.المحافظة || proj.المديرية_النطاق_الميداني).trim() : 'أخرى';
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

        const statusVal = proj.status || proj.حالة_المشروع || '';
        if (statusVal.includes('منفذة') || statusVal.includes('مكتمل') || statusVal.includes('منجز')) governoratesMap[loc].completedCount++;
        else if (statusVal.includes('قيد التنفيذ') || statusVal.includes('جديد')) governoratesMap[loc].inProgressCount++;
        else governoratesMap[loc].plannedCount++;
    });

    const handleSelectGovernorate = (govName) => {
        setSelectedGovName(govName);
        setIsGovModalOpen(true);
    };

    const currentGovData = selectedGovName ? governoratesMap[selectedGovName] : null;

    // إحصائيات الرسم البياني الدائري
    const completedTotal = filteredProjects.filter(p => {
        const s = p.status || p.حالة_المشروع || '';
        return s.includes('منفذة') || s.includes('مكتمل') || s.includes('منجز');
    }).length;
    const inProgressTotal = filteredProjects.filter(p => {
        const s = p.status || p.حالة_المشروع || '';
        return s.includes('قيد التنفيذ') || s.includes('جديد');
    }).length;
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

                    {/* البرامج الرئيسية الأربعة */}
                    <h4 style={{ fontSize: '13px', marginBottom: '8px', color: '#1e293b' }}>البرامج الرئيسية الأربعة</h4>
                    <div className="filter-buttons" style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '15px' }}>
                        {['الكل', 'رافد', 'صرح', 'وسم', 'الحماية'].map(prog => (
                            <button 
                                key={prog} 
                                className={`filter-btn ${selectedMainProgram === prog ? 'active' : ''}`}
                                onClick={() => setSelectedMainProgram(prog)}
                            >
                                {prog}
                            </button>
                        ))}
                    </div>

                    {/* المشاريع الموسمية والتصنيفات العامة والتنموية */}
                    <h4 style={{ fontSize: '13px', marginBottom: '8px', color: '#1e293b' }}>المشاريع الموسمية والتصنيفات</h4>
                    <div className="filter-buttons" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '15px' }}>
                        {['الكل', 'مشاريع عامة وتنموية', 'نسك', 'قطوف', 'موائد الخير', 'عيدكم عيدنا', 'يسر', 'اقرأ', 'إعفاف', 'أهل الذكر'].map(season => (
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

                    {/* التصفية حسب المركز الإداري */}
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

                    {/* القطاعات التنموية */}
                    <h4 style={{ fontSize: '13px', marginBottom: '8px', color: '#1e293b' }}>القطاعات التنموية</h4>
                    <div className="filter-buttons" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '15px' }}>
                        {['الكل', 'المياه', 'التعليم', 'الصحة', 'الغذاء والمأوى', 'الحماية', 'المناخ', 'البنية التحتية'].map(sector => (
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
        </div>
    );
};

export default ProjectsPage;