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

    // جلب المشاريع الحقيقية من السيرفر/قاعدة البيانات
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('https://humanitarian-cell-frontend.onrender.com/api/projects');
                const data = await response.json();
                setProjectsList(data);
                setLoading(false);
            } catch (err) {
                console.error('خطأ في جلب المشاريع من قاعدة البيانات:', err);
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // استخراج المحافظات والمناطق ديناميكياً من قاعدة البيانات
    const uniqueLocations = ['عرض كلي', ...new Set(projectsList.map(p => {
        return String(p.province || p.district || p.location || '').trim();
    }).filter(Boolean))];

    // تصفية المشاريع بالمطابقة الدقيقة للأعمدة وحسب المنطقة المختارة من الخريطة
    const filteredProjects = projectsList.filter(proj => {
        // 1. فلتر البحث النصي (الاسم أو الوصف)
        if (searchTerm.trim() !== '') {
            const query = searchTerm.toLowerCase();
            const title = String(proj.official_name || proj.title || '').toLowerCase();
            const desc = String(proj.description || proj.full_details || '').toLowerCase();
            if (!title.includes(query) && !desc.includes(query)) return false;
        }

        // 2. فلتر المركز الإداري / المنطقة (من القائمة المنسدلة)
        if (selectedAdministrativeArea !== 'عرض كلي') {
            const locValue = String(proj.province || proj.district || proj.location || '').trim();
            if (locValue !== selectedAdministrativeArea.trim()) return false;
        }

        // 3. فلتر النقر على الخريطة أو بطاقة المنطقة الجانبية
        if (selectedGovName) {
            const locValue = String(proj.province || proj.district || proj.location || '').trim();
            if (locValue !== selectedGovName.trim()) return false;
        }

        // 4. فلتر البرنامج الرئيسي (مُطابق لـ program_id)
        if (selectedMainProgram !== 'الكل') {
            const projMain = String(proj.program_id || '').trim();
            if (projMain !== selectedMainProgram.trim()) return false;
        }

        // 5. فلتر التصنيف الموسمي (مُطابق لـ seasonal_category مثل "قطوف")
        if (selectedSeasonalProgram !== 'الكل') {
            const projSeason = String(proj.seasonal_category || '').trim();
            if (projSeason !== selectedSeasonalProgram.trim()) return false;
        }

        // 6. فلتر القطاعات التنموية (بحث شامل ذكي)
        if (selectedSector !== 'الكل') {
            const targetSector = selectedSector.trim();
            const fullRowText = JSON.stringify(proj).toLowerCase();
            
            if (targetSector === 'الغذاء والمأوى') {
                const hasFood = fullRowText.includes('غذاء') || fullRowText.includes('مأوى') || fullRowText.includes('تمر') || fullRowText.includes('سلال') || fullRowText.includes('الغذاء والمأوى');
                if (!hasFood) return false;
            } else if (targetSector === 'التعليم') {
                if (!fullRowText.includes('تعليم') && !fullRowText.includes('مدرسة') && !fullRowText.includes('اقرأ')) return false;
            } else if (targetSector === 'الصحة') {
                if (!fullRowText.includes('صحة') && !fullRowText.includes('طبي') && !fullRowText.includes('علاج')) return false;
            } else if (targetSector === 'المياه') {
                if (!fullRowText.includes('مياه') && !fullRowText.includes('إصحاح') && !fullRowText.includes('بئر')) return false;
            } else {
                if (!fullRowText.includes(targetSector.toLowerCase())) return false;
            }
        }

        return true;
    });

    // تجميع المشاريع حسب المحافظة/المنطقة للخريطة والقائمة الجانبية (بناءً على الفلاتر العامة ما عدا النقر الشخصي)
    const governoratesMap = {};
    projectsList.filter(proj => {
        if (searchTerm.trim() !== '') {
            const query = searchTerm.toLowerCase();
            const title = String(proj.official_name || proj.title || '').toLowerCase();
            const desc = String(proj.description || proj.full_details || '').toLowerCase();
            if (!title.includes(query) && !desc.includes(query)) return false;
        }
        if (selectedAdministrativeArea !== 'عرض كلي') {
            const locValue = String(proj.province || proj.district || proj.location || '').trim();
            if (locValue !== selectedAdministrativeArea.trim()) return false;
        }
        if (selectedMainProgram !== 'الكل') {
            const projMain = String(proj.program_id || '').trim();
            if (projMain !== selectedMainProgram.trim()) return false;
        }
        if (selectedSeasonalProgram !== 'الكل') {
            const projSeason = String(proj.seasonal_category || '').trim();
            if (projSeason !== selectedSeasonalProgram.trim()) return false;
        }
        return true;
    }).forEach(proj => {
        const loc = String(proj.province || proj.district || proj.location || 'أخرى').trim();
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
        if (statusVal.includes('منفذة') || statusVal.includes('مكتمل') || statusVal.includes('منجز') || statusVal.includes('completed')) {
            governoratesMap[loc].completedCount++;
        } else if (statusVal.includes('قيد التنفيذ') || statusVal.includes('جديد') || statusVal.includes('in_progress')) {
            governoratesMap[loc].inProgressCount++;
        } else {
            governoratesMap[loc].plannedCount++;
        }
    });

    const handleSelectGovernorate = (govName) => {
        // إذا تم النقر على نفس المنطقة مجدداً، نقوم بإلغاء التحديد لإظهار الكل
        if (selectedGovName === govName) {
            setSelectedGovName(null);
        } else {
            setSelectedGovName(govName);
        }
    };

    // إعادة ضبط جميع الفلاتر وعرض كافة البيانات
    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedMainProgram('الكل');
        setSelectedSeasonalProgram('الكل');
        setSelectedSector('الكل');
        setSelectedAdministrativeArea('عرض كلي');
        setSelectedGovName(null);
    };

    // حسابات مؤشر الأداء العام للرسم البياني الدائري
    const completedTotal = filteredProjects.filter(p => {
        const s = String(p.status || '');
        return s.includes('منفذة') || s.includes('مكتمل') || s.includes('منجز') || s.includes('completed');
    }).length;
    
    const inProgressTotal = filteredProjects.filter(p => {
        const s = String(p.status || '');
        return s.includes('قيد التنفيذ') || s.includes('جديد') || s.includes('in_progress');
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
                        {selectedGovName ? `تم اختيار منطقة: ${selectedGovName} (اضغط مرة أخرى لإلغاء التحديد)` : 'اضغط على أي منطقة لعرض مشاريعها من قاعدة البيانات | تكبير/تصغير باستخدام عجلة الفأرة'}
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
                        {loading ? (
                            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>جاري التحميل من قاعدة البيانات...</p>
                        ) : Object.keys(governoratesMap).length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '15px' }}>
                                <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
                                    لا توجد مشاريع في قاعدة البيانات تتطابق مع هذه الفلاتر المختارة.
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
                                        style={{ cursor: 'pointer', border: selectedGovName === locKey ? '2px solid #3b82f6' : '1px solid transparent' }}
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