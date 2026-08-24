import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import './ProjectsPage.css';

const ProjectsPage = () => {
    const [projectsList, setProjectsList] = useState([]);
    const [programsList, setProgramsList] = useState([]); 
    const [sectorsList, setSectorsList] = useState([]); // قائمة القطاعات من جدول sectors
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMainProgram, setSelectedMainProgram] = useState('الكل');
    const [selectedSeasonalProgram, setSelectedSeasonalProgram] = useState('الكل');
    const [selectedSector, setSelectedSector] = useState('الكل');
    const [selectedAdministrativeArea, setSelectedAdministrativeArea] = useState('عرض كلي');

    const [selectedGovName, setSelectedGovName] = useState(null);
    const [isGovModalOpen, setIsGovModalOpen] = useState(false);
    const [currentGovData, setCurrentGovData] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. جلب المشاريع
                const projRes = await fetch('https://humanitarian-cell-frontend.onrender.com/api/projects');
                const projData = await projRes.json();
                setProjectsList(projData);

                // 2. جلب البرامج الرئيسية
                const progRes = await fetch('https://humanitarian-cell-frontend.onrender.com/api/programs');
                const progData = await progRes.json();
                setProgramsList(progData);

                // 3. جلب القطاعات من جدول sectors في قاعدة البيانات
                try {
                    const sectRes = await fetch('https://humanitarian-cell-frontend.onrender.com/api/sectors');
                    const sectData = await sectRes.json();
                    setSectorsList(sectData);
                } catch (sectErr) {
                    console.log('ملاحظة: مسار القطاعات قد يكون مختلفاً، جاري استخدام القطاعات الافتراضية', sectErr);
                }

                setLoading(false);
            } catch (err) {
                console.error('خطأ في جلب البيانات:', err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // استخراج التصنيفات الموسمية المتاحة من المشاريع
    const uniqueCategories = ['الكل', ...new Set(projectsList.map(p => {
        return String(p.project_category || p.category || '').trim();
    }).filter(Boolean))];

    const uniqueLocations = ['عرض كلي', ...new Set(projectsList.map(p => {
        return String(p.province_id || p.district_id || p.landmark_type || '').trim();
    }).filter(Boolean))];

    // منطق التصفية والفلترة الشامل والدقيق
    const filteredProjects = projectsList.filter(proj => {
        const fullRowText = JSON.stringify(proj).toLowerCase();

        // 1. بحث النص العام
        if (searchTerm.trim() !== '') {
            const query = searchTerm.toLowerCase();
            if (!fullRowText.includes(query)) return false;
        }

        // 2. تصفية المركز الإداري
        if (selectedAdministrativeArea !== 'عرض كلي') {
            const locValue = String(proj.province_id || proj.district_id || proj.landmark_type || '').trim();
            if (locValue !== selectedAdministrativeArea.trim()) return false;
        }

        // 3. فلترة البرنامج الرئيسي (مطابقة دقيقة)
        if (selectedMainProgram !== 'الكل') {
            const targetMain = selectedMainProgram.trim();
            const matchedProgObj = programsList.find(p => String(p.name).trim() === targetMain);
            const targetProgId = matchedProgObj ? String(matchedProgObj.id) : null;

            const projProgramId = String(proj.program_id || proj.programId || '').trim();
            const projProgramName = String(proj.program_name || proj.programName || '').trim();

            const isProgramMatch = 
                (targetProgId && projProgramId === targetProgId) ||
                (projProgramName.toLowerCase() === targetMain.toLowerCase()) ||
                (projProgramId.toLowerCase() === targetMain.toLowerCase());

            if (!isProgramMatch) return false;
        }

        // 4. فلترة التصنيف الموسمي / الفئة
        if (selectedSeasonalProgram !== 'الكل') {
            const targetSeason = selectedSeasonalProgram.trim().toLowerCase();
            const projCategory = String(proj.project_category || proj.category || '').trim().toLowerCase();

            const isSeasonMatch = 
                projCategory === targetSeason ||
                projCategory.includes(targetSeason);

            if (!isSeasonMatch) return false;
        }

        // 5. القطاعات التنموية (مطابقة دقيقة وصارمة عبر الـ sector_id حصراً)
        if (selectedSector !== 'الكل') {
            const targetSector = selectedSector.trim().toLowerCase();
            
            // البحث عن الـ ID الخاص بالقطاع من جدول sectors
            const matchedSectorObj = sectorsList.find(s => String(s.name).trim().toLowerCase() === targetSector);
            const targetSectorId = matchedSectorObj ? String(matchedSectorObj.id) : null;

            const projSectorId = String(proj.sector_id || proj.sectorId || '').trim();

            // مطابقة دقيقة تعتمد على الـ ID الحقيقي للقطاع في قاعدة البيانات
            let matchesSector = targetSectorId && projSectorId === targetSectorId;

            // في حال لم يتوفر الـ ID، نعتمد مطابقة الاسم الحرفية الدقيقة فقط
            if (!matchesSector) {
                const projSectorName = String(proj.sector_name || proj.sector || '').trim().toLowerCase();
                matchesSector = projSectorName === targetSector;
            }

            if (!matchesSector) return false;
        }

        if (selectedGovName) {
            const loc = String(proj.province_id || proj.district_id || proj.landmark_type || 'أخرى').trim();
            if (loc !== selectedGovName) return false;
        }

        return true;
    });

    const governoratesMap = {};
    filteredProjects.forEach(proj => {
        const loc = String(proj.province_id || proj.district_id || proj.landmark_type || 'أخرى').trim();
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

        const statusVal = String(proj.project_status || '').trim();
        if (statusVal.includes('منفذة') || statusVal.includes('مكتمل') || statusVal.includes('completed') || statusVal.includes('منجز')) {
            governoratesMap[loc].completedCount++;
        } else if (statusVal.includes('قيد التنفيذ') || statusVal.includes('جديد') || statusVal.includes('in_progress')) {
            governoratesMap[loc].inProgressCount++;
        } else {
            governoratesMap[loc].plannedCount++;
        }
    });

    const handleSelectGovernorate = (govName) => {
        if (selectedGovName === govName) {
            setSelectedGovName(null); 
        } else {
            setSelectedGovName(govName);
            if (governoratesMap[govName]) {
                setCurrentGovData(governoratesMap[govName]);
                setIsGovModalOpen(true);
            }
        }
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedMainProgram('الكل');
        setSelectedSeasonalProgram('الكل');
        setSelectedSector('الكل');
        setSelectedAdministrativeArea('عرض كلي');
        setSelectedGovName(null);
    };

    const completedTotal = filteredProjects.filter(p => {
        const s = String(p.project_status || '');
        return s.includes('منفذة') || s.includes('مكتمل') || s.includes('completed') || s.includes('منجز');
    }).length;

    const inProgressTotal = filteredProjects.filter(p => {
        const s = String(p.project_status || '');
        return s.includes('قيد التنفيذ') || s.includes('جديد') || s.includes('in_progress');
    }).length;

    const plannedTotal = filteredProjects.length - (completedTotal + inProgressTotal);

    const chartData = [
        { name: 'منفذة', value: completedTotal > 0 ? completedTotal : 1, color: '#10b981' },
        { name: 'قيد التنفيذ / جديد', value: inProgressTotal > 0 ? inProgressTotal : 1, color: '#f59e0b' },
        { name: 'مخططة', value: plannedTotal > 0 ? plannedTotal : 1, color: '#3b82f6' },
    ];

    // قائمة القطاعات الافتراضية احتياطياً في حال لم يتم جلبها مباشرة من الـ API
    const fallbackSectors = ['المياه', 'التعليم', 'الصحة', 'الغذاء والمأوى', 'الحماية', 'المناخ والطاقة الخضراء', 'البنية التحتية'];
    const activeSectorsList = sectorsList.length > 0 ? sectorsList.map(s => s.name) : fallbackSectors;

    return (
        <div className="hac-projects-page">
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

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h4 style={{ fontSize: '13px', margin: 0, color: '#1e293b' }}>لوحة التحكم والفلترة</h4>
                        <button 
                            onClick={handleResetFilters}
                            style={{ fontSize: '11px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            إزالة كافة الفلاتر (عرض الكل)
                        </button>
                    </div>

                    <div className="search-box" style={{ marginBottom: '15px' }}>
                        <input 
                            type="text" 
                            placeholder="بحث باسم المشروع أو البرنامج..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                        />
                    </div>

                    {/* البرامج الرئيسية */}
                    <h4 style={{ fontSize: '13px', marginBottom: '8px', color: '#1e293b' }}>البرامج الرئيسية</h4>
                    <div className="filter-buttons" style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '15px' }}>
                        <button 
                            className={`filter-btn ${selectedMainProgram === 'الكل' ? 'active' : ''}`}
                            onClick={() => setSelectedMainProgram('الكل')}
                            style={{ fontSize: '11px', padding: '5px 8px' }}
                        >
                            الكل
                        </button>
                        {programsList.map(prog => (
                            <button 
                                key={prog.id} 
                                className={`filter-btn ${selectedMainProgram === String(prog.name) ? 'active' : ''}`}
                                onClick={() => setSelectedMainProgram(String(prog.name))}
                                style={{ fontSize: '11px', padding: '5px 8px' }}
                            >
                                {prog.name}
                            </button>
                        ))}
                    </div>

                    {/* المشاريع الموسمية والتصنيفات */}
                    <h4 style={{ fontSize: '13px', marginBottom: '8px', color: '#1e293b' }}>المشاريع الموسمية والتصنيفات</h4>
                    <div className="filter-buttons" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '15px' }}>
                        <button 
                            className={`filter-btn ${selectedSeasonalProgram === 'الكل' ? 'active' : ''}`}
                            onClick={() => setSelectedSeasonalProgram('الكل')}
                            style={{ fontSize: '11px', padding: '4px 8px' }}
                        >
                            الكل
                        </button>
                        {uniqueCategories.filter(c => c !== 'الكل').map(category => (
                            <button 
                                key={category} 
                                className={`filter-btn ${selectedSeasonalProgram === category ? 'active' : ''}`}
                                onClick={() => setSelectedSeasonalProgram(category)}
                                style={{ fontSize: '11px', padding: '4px 8px' }}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

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

                    {/* القطاعات التنموية (مجلوبة من جدول sectors في قاعدة البيانات) */}
                    <h4 style={{ fontSize: '13px', marginBottom: '8px', color: '#1e293b' }}>القطاعات التنموية</h4>
                    <div className="filter-buttons" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '15px' }}>
                        <button 
                            className={`filter-btn ${selectedSector === 'الكل' ? 'active' : ''}`}
                            onClick={() => setSelectedSector('الكل')}
                            style={{ fontSize: '11px', padding: '4px 8px' }}
                        >
                            الكل
                        </button>
                        {activeSectorsList.map(sectorName => (
                            <button 
                                key={sectorName} 
                                className={`filter-btn ${selectedSector === sectorName ? 'active' : ''}`}
                                onClick={() => setSelectedSector(sectorName)}
                                style={{ fontSize: '11px', padding: '4px 8px' }}
                            >
                                {sectorName}
                            </button>
                        ))}
                    </div>

                    <h3 className="panel-title" style={{ marginTop: '15px' }}>قائمة المشاريع حسب النتائج ({filteredProjects.length} مشروع)</h3>

                    <div className="gov-list-container" style={{ maxHeight: '220px', overflowY: 'auto' }}>
                        {loading ? (
                            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>جاري التحميل من قاعدة البيانات...</p>
                        ) : filteredProjects.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '15px' }}>
                                <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
                                    لا توجد مشاريع تتطابق مع الفلاتر المحددة.
                                </p>
                                <button 
                                    onClick={handleResetFilters}
                                    style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', padding: '5px 12px', cursor: 'pointer', fontSize: '11px' }}
                                >
                                    إعادة ضبط الفلاتر
                                </button>
                            </div>
                        ) : (
                            filteredProjects.map((proj) => (
                                <div 
                                    key={proj.id} 
                                    className="gov-card-item"
                                    onClick={() => setSelectedProject(proj)}
                                    style={{ cursor: 'pointer', padding: '8px 10px', marginBottom: '6px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                >
                                    <div style={{ overflow: 'hidden' }}>
                                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                            {proj.project_name}
                                        </div>
                                        <div style={{ fontSize: '10px', color: '#64748b' }}>
                                            {proj.province_id || proj.district_id || 'منطقة عامة'} • {proj.project_status || 'جديد'}
                                        </div>
                                    </div>
                                    <button style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', padding: '3px 8px', fontSize: '10px', cursor: 'pointer' }}>
                                        التفاصيل
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

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

            {selectedProject && (
                <div className="hac-modal-overlay active" style={{ zIndex: 3500 }} onClick={() => setSelectedProject(null)}>
                    <div className="hac-modal-container deep-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="hac-modal-close" onClick={() => setSelectedProject(null)}>&times;</button>

                        <div className="hac-modal-header">
                            <span className="hac-modal-badge gold-bg">تفاصيل المشروع (ID: {selectedProject.id})</span>
                            <h2>{selectedProject.project_name}</h2>
                        </div>

                        <div className="deep-modal-content">
                            <div className="deep-info-block">
                                <strong>الجهة المانحة (Donor):</strong>
                                <p>{selectedProject.donor || 'غير مسجل'}</p>
                            </div>

                            <div className="deep-info-block" style={{ marginTop: '10px' }}>
                                <strong>ملاحظات الجودة (Quality Notes):</strong>
                                <p>{selectedProject.quality_notes || 'لا توجد ملاحظات جودة مسجلة.'}</p>
                            </div>

                            <div className="deep-info-grid" style={{ marginTop: '15px' }}>
                                <div className="deep-box">
                                    <span className="deep-label">الحالة:</span>
                                    <span className="deep-val">{selectedProject.project_status}</span>
                                </div>
                                <div className="deep-box">
                                    <span className="deep-label">عدد المستفيدين:</span>
                                    <span className="deep-val">{selectedProject.beneficiaries_count || 0}</span>
                                </div>
                                <div className="deep-box">
                                    <span className="deep-label">سنة التنفيذ:</span>
                                    <span className="deep-val">{selectedProject.execution_year || 'غير محدد'}</span>
                                </div>
                                <div className="deep-box">
                                    <span className="deep-label">رقم التنفيذ:</span>
                                    <span className="deep-val">{selectedProject.implementation_id}</span>
                                </div>
                            </div>
                        </div>

                        <div className="deep-actions">
                            {selectedProject.google_maps_link && (
                                <a 
                                    href={selectedProject.google_maps_link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="hac-action-btn" 
                                    style={{ display: 'block', textAlign: 'center', marginBottom: '8px', textDecoration: 'none', background: '#10b981', color: '#fff' }}
                                >
                                    فتح الموقع على خريطة جوجل (Google Maps)
                                </a>
                            )}
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

ProjectsPage.displayName = 'ProjectsPage';

export default ProjectsPage;