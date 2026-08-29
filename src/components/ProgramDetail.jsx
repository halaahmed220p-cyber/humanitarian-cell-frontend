import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Calendar, Users, X } from 'lucide-react'
import BackgroundAnimation from '../components/BackgroundAnimation'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ScrollReveal from '../components/ScrollReveal'
import './ProgramDetail.css'

const programIdMap = {
  rafed: 3,
  himaya: 4,
  sarh: 1,
  wasam: 2,
}

const programLogos = {
  rafed: '/rafid-logo.png',
  himaya: '/himaya-logo.png',
  sarh: '/sarh-logo.png',
  wasam: '/wasam-logo.png',
}

export default function ProgramDetail() {
  const { programId } = useParams()
  const navigate = useNavigate()
  
  const [program, setProgram] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    setLoading(true)
    const numericId = programIdMap[programId] || programId

    fetch(`https://humanitarian-cell-frontend.onrender.com/api/programs/${numericId}`)
      .then(res => res.json())
      .then(data => {
        setProgram(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("خطأ في الاتصال بالخادم:", err)
        setLoading(false)
      })
  }, [programId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b132b] text-white">
        <div className="text-xl font-bold">جاري تحميل تفاصيل البرنامج وماريعه...</div>
      </div>
    )
  }

  if (!program || (!program.name && !program.program_name)) {
    return (
      <div className="program-detail-page min-h-screen flex flex-col justify-between pt-29 bg-[#0b132b]">
        <Header />
        <div className="text-center py-24">
          <h1 className="text-4xl font-black mb-4 text-white">البرنامج غير موجود</h1>
          <button
            onClick={() => navigate('/programs')}
            className="px-6 py-3 bg-[#16a34a] text-white rounded-xl font-bold cursor-pointer"
          >
            العودة للبرامج
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  const color = program.color || '#eab308'
  const logoSrc = program.logo || programLogos[programId] || '/rafid-logo.png'
  const rawProjects = program.projects || []

  // استخراج التصنيفات بدعم كامل للأسماء العربية والإنجليزية
  const categories = ['all', ...new Set(rawProjects.map(p => {
    return String(p.تصنيف_المشروع_الموسمي || p.project_category || p.category || p.is_seasonal || '').trim();
  }).filter(Boolean))];

  // فلترة المشاريع بناءً على التصنيف المختار
  const filteredProjects = activeTab === 'all' 
    ? rawProjects 
    : rawProjects.filter(p => {
        const cat = String(p.تصنيف_المشروع_الموسمي || p.project_category || p.category || p.is_seasonal || '').trim();
        return cat.toLowerCase() === activeTab.toLowerCase();
      });

  return (
    <div className="program-detail-page min-h-screen flex flex-col relative pt-0">
      <BackgroundAnimation />
      <Header program={program} />

      <div className="flex-1 max-w-[1400px] mx-auto px-6 relative z-[2] w-full pt-10">
        
        <section className="pt-12 pb-16 text-center flex flex-col items-center">
          <ScrollReveal>
            <div className="mb-6 flex justify-center">
              <img 
                src={logoSrc} 
                alt={program.name || program.program_name} 
                className="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-xl"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-5 text-white">
              {program.name || program.program_name}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <p className="text-lg text-[#b0b8c8] max-w-3xl leading-relaxed">
              {program.description || 'برنامج استراتيجي يهدف لتحقيق التنمية المستدامة والأثر المجتمعي الفعال ومتابعة المشاريع التنموية والموسمية.'}
            </p>
          </ScrollReveal>
        </section>

        {rawProjects.length > 0 && (
          <section className="pb-20">
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-extrabold text-white">مشاريع البرنامج والمشاريع الموسمية</h2>
                <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}, transparent)`, opacity: 0.3 }} />
                <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-sm font-bold" style={{ color }}>
                  {rawProjects.length} مشروع
                </span>
              </div>
            </ScrollReveal>

            {/* أزرار الفلترة */}
            <ScrollReveal delay={0.1}>
              <div className="flex flex-wrap gap-3 mb-10 border-b border-white/10 pb-5">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'all' ? 'text-[#0b132b] shadow-lg' : 'bg-white/5 text-white border border-white/10'
                  }`}
                  style={activeTab === 'all' ? { backgroundColor: color } : {}}
                >
                  <span>جميع المشاريع</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'all' ? 'bg-black/20 text-[#0b132b]' : 'bg-white/10 text-white'}`}>
                    {rawProjects.length}
                  </span>
                </button>

                {categories.filter(c => c !== 'all').map((cat, idx) => {
                  const count = rawProjects.filter(p => {
                    const pCat = String(p.تصنيف_المشروع_الموسمي || p.project_category || p.category || p.is_seasonal || '').trim();
                    return pCat.toLowerCase() === cat.toLowerCase();
                  }).length;

                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveTab(cat)}
                      className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 ${
                        activeTab === cat ? 'text-[#0b132b] shadow-lg' : 'bg-white/5 text-white border border-white/10'
                      }`}
                      style={activeTab === cat ? { backgroundColor: color } : {}}
                    >
                      <span>{cat}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === cat ? 'bg-black/20 text-[#0b132b]' : 'bg-white/10 text-white'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </ScrollReveal>

            {/* شبكة المشاريع */}
            <div className="grid md:grid-cols-2 gap-7">
              {filteredProjects.map((project, i) => {
                // جلب الحقول بدعم كامل لحقل "اسم_المشروع" و"سنة_التنفيذ" الفعليين من قاعدة البيانات
                const displayCategory = project.تصنيف_المشروع_الموسمي || project.project_category || project.category || project.is_seasonal;
                const projectName =project.project_name ;
                const projectLoc = project.المحافظة || project.المديرية_النطاق_الميداني || project.province_id || project.location || 'اليمن';
                const projectDate = project.سنة_التنفيذ || project.execution_year || project.date || project.year || '2026';
                const beneficiariesCount = project.عدد_المستفيدين !== undefined ? project.عدد_المستفيدين : (project.beneficiaries_count !== undefined ? project.beneficiaries_count : (project.beneficiaries || 'غير محدد'));
                const projectDesc = project.ملاحظات_وضبط_الجودة || project.quality_notes || project.description || 'مشروع تنموي مستدام تابع لخلية الأعمال الإنسانية.';

                return (
                  <ScrollReveal key={project.id || i} delay={i * 0.1}>
                    <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-500 p-7 flex flex-col justify-between">
                      <div>
                        <div className="flex gap-4 mb-3 flex-wrap text-sm text-[#b0b8c8]">
                          <span className="flex items-center gap-1">📍 نطاق تنفيذي: {projectLoc}</span>
                          <span className="flex items-center gap-1">📅 {projectDate}</span>
                          {displayCategory && (
                            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-white/10 text-[#c9a84c]">
                              {displayCategory}
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-extrabold mb-3 text-white">{projectName}</h3>
                        <p className="text-sm text-[#b0b8c8] leading-relaxed mb-5">{projectDesc}</p>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 text-sm text-[#b0b8c8]">
                          <span>المستفيدون: <strong style={{ color }}>{beneficiariesCount}</strong></span>
                        </div>
                        <button 
                          onClick={() => setSelectedProject(project)}
                          className="px-5 py-2 bg-transparent border border-white/15 rounded-xl text-sm font-bold text-white hover:bg-white/10 cursor-pointer"
                        >
                          التفاصيل
                        </button>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* نافذة تفاصيل المشروع المنبثقة */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedProject(null)}>
          <div className="bg-[#111827] border border-white/15 rounded-3xl p-7 max-w-lg w-full text-white relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button 
              className="absolute top-5 left-5 text-gray-400 hover:text-white cursor-pointer bg-white/10 p-2 rounded-full"
              onClick={() => setSelectedProject(null)}
            >
              <X size={18} />
            </button>

            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#eab308]/20 text-[#eab308] mb-3 inline-block">
              {selectedProject.تصنيف_المشروع_الموسمي || selectedProject.project_category || selectedProject.category || 'مشروع تنموي'}
            </span>

            <h3 className="text-2xl font-black mb-3">
              {selectedProject.اسم_المشروع || selectedProject.اسم_المشروع_المعتمد || selectedProject.project_name || selectedProject.title || selectedProject.name}
            </h3>

            <p className="text-sm text-gray-300 mb-5 leading-relaxed">
              {selectedProject.ملاحظات_وضبط_الجودة || selectedProject.quality_notes || selectedProject.description || 'لا توجد ملاحظات ضبط جودة إضافية مسجلة.'}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6 text-sm bg-white/5 p-4 rounded-2xl">
              <div>
                <span className="text-gray-400 block text-xs">المحافظة / النطاق:</span>
                <strong className="text-white">{selectedProject.المحافظة || selectedProject.المديرية_النطاق_الميداني || selectedProject.province_id || selectedProject.location || 'غير محدد'}</strong>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">عدد المستفيدين:</span>
                <strong className="text-[#eab308]">
                  {selectedProject.عدد_المستفيدين !== undefined ? selectedProject.عدد_المستفيدين : (selectedProject.beneficiaries_count !== undefined ? selectedProject.beneficiaries_count : 0)}
                </strong>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">سنة التنفيذ:</span>
                <strong className="text-white">{selectedProject.سنة_التنفيذ || selectedProject.execution_year || selectedProject.year || '2026'}</strong>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">حالة المشروع:</span>
                <strong className="text-emerald-400">{selectedProject.حالة_المشروع || selectedProject.project_status || selectedProject.status || 'منجز'}</strong>
              </div>
            </div>

            {(selectedProject.رابط_الموقع_في_خرائط_جوجل || selectedProject.google_maps_link) && (
              <a 
                href={selectedProject.رابط_الموقع_في_خرائط_جوجل || selectedProject.google_maps_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-center py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all"
              >
                فتح الموقع على خرائط جوجل
              </a>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}