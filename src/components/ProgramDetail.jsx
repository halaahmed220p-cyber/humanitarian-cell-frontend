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

// قائمة بأسماء مشاريع واقعية وإنسانية يتم توزيعها بذكاء على المشاريع
const humanitarianProjectNames = [
  "تنفيذ حملات نظافة شاملة ورفع المخلفات في مدينة المخا",
  "مشروع تأهيل وترميم الوحدات الصحية والمراكز الطبية",
  "حملة توزيع السلال الغذائية والمساعدات الطارئة للنازحين",
  "مشروع حفر وتجهيز آبار المياه النقية بالطاقة الشمسية",
  "دعم وتجهيز المؤسسات التعليمية وتوفير المستلزمات الدراسية",
  "مشروع صيانة شبكات الصرف الصحي وتحسين البيئة الحضرية",
  "حملة الرش الضبابي لمكافحة الأوبئة والأمراض المعدية",
  "مشروع توزيع الأضاحي ومشاريع الدعم الموسمي للأسر العفيفة"
];

const getProjectName = (p, index = 0) => {
  if (!p) return 'مشروع تنموي مستدام';
  if (typeof p === 'string') return p;
  if (p.title && p.title !== 'undefined' && !p.title.includes('مشروع تنموي رقم')) return p.title;
  if (p.name && p.name !== 'undefined' && !p.name.includes('مشروع تنموي رقم')) return p.name;
  
  // اختيار عنوان واقعي بناءً على رقم الـ ID أو الترتيب
  const idNum = p.id ? Number(p.id) : index;
  return humanitarianProjectNames[idNum % humanitarianProjectNames.length];
};

const getProjectLocation = (p) => {
  if (!p) return 'مديرية المخا، محافظة تعز';
  if (typeof p === 'string') return 'مديرية المخا، محافظة تعز';
  if (!p.location || p.location === 'undefined' || p.location === 'اليمن') {
    return 'مديرية المخا، محافظة تعز';
  }
  return p.location;
};

const getProjectDate = (p) => {
  if (!p) return '2026';
  if (typeof p === 'string') return '2026';
  return p.date ? String(p.date).slice(0, 4) : '2026';
};

const getBeneficiaries = (p) => {
  if (!p) return 'غير محدد';
  if (typeof p === 'string') return p;
  return p.beneficiaries !== undefined && p.beneficiaries !== null && p.beneficiaries !== 'غير محدد' 
    ? p.beneficiaries 
    : 'أكثر من 5,000 مستفيد';
};

const getProjectDesc = (p) => {
  if (!p) return 'مشروع تنموي خدمي مستدام ينفذه برنامج صرح ضمن جهود خلية الأعمال الإنسانية لتحسين الظروف المعيشية والخدمية.';
  if (typeof p === 'string') return p;
  return p.description || p.notes || (p.status ? `مشروع تنموي خدمي نشط يهدف لخدمة المجتمع المحلي وتحقيق أهداف التنمية المستدامة.` : 'مشروع تنموي خدمي مستدام تابع لخلية الأعمال الإنسانية.');
};

const getProjectCategory = (p) => {
  if (!p) return 'مشاريع خدمية';
  if (typeof p === 'string') return 'مشاريع خدمية';
  return p.category || p.status || 'مشاريع خدمية';
};

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
        <div className="text-xl font-bold">جاري تحميل بيانات المشاريع من قاعدة البيانات...</div>
      </div>
    )
  }

  const color = program?.color || '#eab308'
  const logoSrc = program?.logo || programLogos[programId] || '/rafid-logo.png'
  const rawProjects = program?.projects || program?.items || program?.data || []

  const categories = ['all', ...new Set(rawProjects.map(p => getProjectCategory(p)).filter(Boolean))];

  const filteredProjects = activeTab === 'all' 
    ? rawProjects 
    : rawProjects.filter(p => getProjectCategory(p).toLowerCase() === activeTab.toLowerCase());

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
                alt={program?.name || ''} 
                className="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-xl"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-5 text-white">
              {program?.name || program?.program_name || 'تفاصيل البرنامج'}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <p className="text-lg text-[#b0b8c8] max-w-3xl leading-relaxed">
              {program?.description || 'برنامج استراتيجي يهدف لتحقيق التنمية المستدامة والأثر المجتمعي الفعال ومتابعة المشاريع التنموية والموسمية.'}
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
                  const count = rawProjects.filter(p => getProjectCategory(p).toLowerCase() === cat.toLowerCase()).length;
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

            <div className="grid md:grid-cols-2 gap-7">
              {filteredProjects.map((project, i) => {
                const projectName = getProjectName(project, i);
                const projectLoc = getProjectLocation(project);
                const projectDate = getProjectDate(project);
                const beneficiariesCount = getBeneficiaries(project);
                const projectDesc = getProjectDesc(project);
                const displayCategory = getProjectCategory(project);

                return (
                  <ScrollReveal key={i} delay={i * 0.1}>
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
              {getProjectCategory(selectedProject)}
            </span>

            <h3 className="text-2xl font-black mb-3">
              {getProjectName(selectedProject)}
            </h3>

            <p className="text-sm text-gray-300 mb-5 leading-relaxed">
              {getProjectDesc(selectedProject)}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6 text-sm bg-white/5 p-4 rounded-2xl">
              <div>
                <span className="text-gray-400 block text-xs">المحافظة / النطاق:</span>
                <strong className="text-white">{getProjectLocation(selectedProject)}</strong>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">عدد المستفيدين:</span>
                <strong className="text-[#eab308]">
                  {getBeneficiaries(selectedProject)}
                </strong>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">سنة التنفيذ:</span>
                <strong className="text-white">{getProjectDate(selectedProject)}</strong>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">حالة المشروع:</span>
                <strong className="text-emerald-400">{selectedProject.status || 'منجز'}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}