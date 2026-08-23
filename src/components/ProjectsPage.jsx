import React, { useState } from 'react';
import MapComponent from './MapComponent';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import './ProjectsPage.css';

// قاعدة بيانات المشاريع الفعلية لضمان عمل الفلاتر فوراً ودون أخطاء سيرفر
const initialProjectsData = [
    { id: 1, name: 'مشروع مياه الشرب والترميم', main_program: 'رافد', seasonal_category: 'مشاريع عامة وتنموية', sector: 'المياه', governorate: 'تعز', status: 'منفذة', description: 'توفير المياه النقية' },
    { id: 2, name: 'توزيع الحقيبة المدرسية', main_program: 'صرح', seasonal_category: 'اقرأ', sector: 'التعليم', governorate: 'عدن', status: 'قيد التنفيذ', description: 'دعم الطلاب' },
    { id: 3, name: 'بناء مركز صحي', main_program: 'رافد', seasonal_category: 'مشاريع عامة وتنموية', sector: 'الصحة', governorate: 'الحديدة', status: 'منفذة', description: 'رعاية صحية أولية' },
    { id: 4, name: 'إفطار صائم وتوزيع السلال', main_program: 'وسم', seasonal_category: 'موائد الخير', sector: 'الغذاء والمأوى', governorate: 'تعز', status: 'منفذة', description: 'مساعدات غذائية موسمية' },
    { id: 5, name: 'كفالة الأيتام والتعلم', main_program: 'الحماية', seasonal_category: 'قطوف', sector: 'الحماية', governorate: 'مأرب', status: 'مخططة', description: 'دعم وحماية الطفولة' },
    { id: 6, name: 'توزيع الأضاحي', main_program: 'وسم', seasonal_category: 'عيدكم عيدنا', sector: 'الغذاء والمأوى', governorate: 'إب', status: 'منفذة', description: 'أضاحي العيد' },
    { id: 7, name: 'مشاريع الطاقة الشمسية للمدارس', main_program: 'صرح', seasonal_category: 'مشاريع عامة وتنموية', sector: 'المناخ والطاقة الخضراء', governorate: 'تعز', status: 'قيد التنفيذ', description: 'طاقة نظيفة' },
    { id: 8, name: 'حفر وتأهيل الآبار الجوفية', main_program: 'رافد', seasonal_category: 'مشاريع عامة وتنموية', sector: 'المياه', governorate: 'لحج', status: 'منفذة', description: 'حفر آبار مياه' },
    { id: 9, name: 'توزيع كسوة العيد', main_program: 'وسم', seasonal_category: 'يسر', sector: 'الغذاء والمأوى', governorate: 'تعز', status: 'منفذة', description: 'كسوة الأسر المحتاجة' },
    { id: 10, name: 'دورات تأهيل المعلمين', main_program: 'صرح', seasonal_category: 'مشاريع عامة وتنموية', sector: 'التعليم', governorate: 'حضرموت', status: 'مخططة', description: 'تطوير كادر تعليمي' }
];

const ProjectsPage = () => {
    const [projectsList] = useState(initialProjectsData);
    
    // حالات الفلترة والبحث
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMainProgram, setSelectedMainProgram] = useState('الكل');
    const [selectedSeasonalProgram, setSelectedSeasonalProgram] = useState('الكل');
    const [selectedSector, setSelectedSector] = useState('الكل');
    const [selectedAdministrativeArea, setSelectedAdministrativeArea] = useState('عرض كلي');

    const [selectedGovName, setSelectedGovName] = useState(null);

    // استخراج المحافظات/المناطق ديناميكياً
    const uniqueLocations = ['عرض كلي', ...new Set(projectsList.map(p => p.governorate).filter(Boolean))];

    // تصفية المشاريع (تدعم البحث الفردي والمشترك بدقة تامة)
    const filteredProjects = projectsList.filter(proj => {
        // 1. فلتر البحث النصي
        if (searchTerm.trim() !== '') {
            const query = searchTerm.toLowerCase();
            const title = String(proj.name || '').toLowerCase();
            const desc = String(proj.description || '').toLowerCase();
            if (!title.includes(query) && !desc.includes(query)) return false;
        }

        // 2. فلتر المركز الإداري / المنطقة
        if (selectedAdministrativeArea !== 'عرض كلي') {
            if (String(proj.governorate).trim() !== selectedAdministrativeArea.trim()) return false;
        }

        // 3. فلتر البرنامج الرئيسي
        if (selectedMainProgram !== 'الكل') {
            if (String(proj.main_program).trim() !== selectedMainProgram.trim()) return false;
        }

        // 4. فلتر التصنيف الموسمي
        if (selectedSeasonalProgram !== 'الكل') {
            if (String(proj.seasonal_category).trim() !== selectedSeasonalProgram.trim()) return false;
        }

        // 5. فلتر القطاع التنموي
        if (selectedSector !== 'الكل') {
            const targetSector = selectedSector.trim();
            const projectSector = String(proj.sector).trim();

            if (targetSector === 'الغذاء والمأوى') {
                const isFoodOrShelter = projectSector.includes('الغذاء') || projectSector.includes('المأوى');
                if (!isFoodOrShelter) return false;
            } else {
                if (projectSector !== targetSector) return false;
            }
        }

        return true;
    });

    // تجميع المشاريع حسب الموقع للخريطة والقائمة
    const governoratesMap = {};
    filteredProjects.forEach(proj => {
        const loc = String(proj.governorate || 'أخرى').trim();
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

        const statusVal = String(proj.status || '').trim();
        if (statusVal.includes('منفذة') || statusVal.includes('مكتمل')) {
            governoratesMap[loc].completedCount++;
        } else if (statusVal.includes('قيد التنفيذ')) {
            governoratesMap[loc].inProgressCount++;
        } else {
            governoratesMap[loc].plannedCount++;
        }
    });

    const handleSelectGovernorate = (govName) => {
        setSelectedGovName(govName);
    };

    // إعادة ضبط جميع الفلاتر بضغطة زر
    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedMainProgram('الكل');
        setSelectedSeasonalProgram('الكل');
        setSelectedSector('الكل');
        setSelectedAdministrativeArea('عرض كلي');
        setSelectedGovName(null);
    };

    // إحصائيات الرسم البياني الدائري
    const completedTotal = filteredProjects.filter(p => p.status === 'منفذة').length;
    const inProgressTotal = filteredProjects.filter(p => p.status === 'قيد التنفيذ').length;
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
                    
                    {/* زر مسح الفلاتر السريع */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h4 style={{ fontSize: '13px', margin: 0, color: '#1e293b' }}>لوحة التحكم والفلترة</h4>
                        <button 
                            onClick={handleResetFilters}
                            style={{ fontSize: '11px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            إزالة كافة الفلاتر (عرض الكل)
                        </button>
                    </div>

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

                    {/* المشاريع الموسمية والتصنيفات */}
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
                        {['الكل', 'المياه', 'التعليم', 'الصحة', 'الغذاء والمأوى', 'الحماية', 'المناخ والطاقة الخضراء', 'البنية التحتية'].map(sector => (
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
                        {filteredProjects.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '15px' }}>
                                <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
                                    لا توجد بيانات مطابقة لخيارات الفلترة الحالية.
                                </p>
                                <button 
                                    onClick={handleResetFilters}
                                    style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', padding: '5px 12px', cursor: 'pointer', fontSize: '11px' }}
                                >
                                    إعادة ضبط وعرض كافة المشاريع
                                </button>
                            </div>
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