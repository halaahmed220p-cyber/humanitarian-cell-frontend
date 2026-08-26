import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Calendar, Users, X, Image as ImageIcon, Download } from 'lucide-react'
import BackgroundAnimation from '../components/BackgroundAnimation'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ScrollReveal from '../components/ScrollReveal'
import ProgressBar from '../components/ProgressBar'
import './ProgramDetail.css'

const statusConfig = {
  active: { label: 'نشط', className: 'bg-green-400/25 text-green-400 border-green-400/30' },
  completed: { label: 'مكتمل', className: 'bg-blue-400/25 text-blue-400 border-blue-400/30' },
  ongoing: { label: 'قيد التنفيذ', className: 'bg-orange-400/25 text-orange-400 border-orange-400/30' },
}

const programLogos = {
  rafid: '/rafid-logo.png',
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
  
  // حالة لتحديد التبويب النشط (مثلاً 'all' أو تصنيف معين / مشروع موسمي)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    setLoading(true)
    // جلب بيانات البرنامج مع مشاريعه المرتبطة بناءً على الـ API الخاص بك
    fetch(`https://humanitarian-cell-frontend.onrender.com/api/programs/${programId}`)
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
            onClick={() => navigate('/')}
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
  const gradient = program.gradient || 'linear-gradient(135deg, #eab308, #ca8a04)'
  const logoSrc = program.logo || programLogos[programId] || '/rafid-logo.png'

  // استخراج قائمة المشاريع ومطابقة أسماء الحقول من قاعدة البيانات
  const rawProjects = program.projects || []

  // استخراج التصنيفات المتاحة بناءً على حقل project_category أو is_seasonal
  const categories = ['all', ...new Set(rawProjects.map(p => p.project_category || p.is_seasonal || 'عام'))]

  // فلترة المشاريع بناءً على التبويب النشط المختار
  const filteredProjects = activeTab === 'all' 
    ? rawProjects 
    : rawProjects.filter(p => (p.project_category || p.is_seasonal || 'عام') === activeTab)

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
                className="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-xl transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2 rounded-full text-sm font-bold mb-6" style={{ color }}>
              {program.badge || 'برنامج استراتيجي'}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-5 text-white">
              {program.name || program.program_name}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <p className="text-xl md:text-2xl font-bold mb-6" style={{ color }}>
              {program.slogan}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <p className="text-lg text-[#b0b8c8] max-w-3xl leading-relaxed">
              {program.description}
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

            {/* أزرار التبويبات التفاعلية (مثل المشاريع الموسمية والتصنفيات المندرجة) */}
            <ScrollReveal delay={0.1}>
              <div className="flex flex-wrap gap-3 mb-10 border-b border-white/10 pb-5">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                    activeTab === 'all' 
                      ? 'text-[#0b132b] shadow-lg' 
                      : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                  }`}
                  style={activeTab === 'all' ? { backgroundColor: color } : {}}
                >
                  جميع المشاريع ({rawProjects.length})
                </button>

                {categories.filter(c => c !== 'all').map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(cat)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                      activeTab === cat 
                        ? 'text-[#0b132b] shadow-lg' 
                        : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                    }`}
                    style={activeTab === cat ? { backgroundColor: color } : {}}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </ScrollReveal>

            {/* شبكة عرض المشاريع المندرجة تحت التبويب النشط */}
            <div className="grid md:grid-cols-2 gap-7">
              {filteredProjects.map((project, i) => {
                const statusKey = project.project_status || 'active'
                const status = statusConfig[statusKey] || statusConfig['active']
                
                return (
                  <ScrollReveal key={project.id || i} delay={i * 0.1}>
                    <motion.div
                      className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden group hover:-translate-y-2 hover:border-white/20 transition-all duration-500"
                      whileHover={{ y: -8 }}
                    >
                      <div className="w-full h-[220px] relative overflow-hidden flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))' }}
                      >
                        <span className="text-6xl opacity-30 group-hover:scale-110 transition-transform duration-500">
                          {project.icon || '📁'}
                        </span>
                        <span className={`absolute top-4 right-4 px-3.5 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border ${status.className}`}>
                          {status.label}
                        </span>
                      </div>

                      <div className="p-7">
                        <div className="flex gap-4 mb-3 flex-wrap text-sm text-[#b0b8c8]">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {project.landmark_type || 'اليمن'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> {project.execution_year || '2024'}
                          </span>
                        </div>

                        {/* اسم المشروع المطابق لحقل project_name في قاعدة البيانات */}
                        <h3 className="text-xl font-extrabold mb-3 text-white">{project.project_name}</h3>
                        <p className="text-sm text-[#b0b8c8] leading-relaxed mb-5">{project.quality_notes || 'مشروع تنموي مستدام تابع لخلية الأعمال الإنسانية.'}</p>

                        <div className="mb-5">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-[#b0b8c8]">التصنيف أو الموسم</span>
                            <span className="font-bold text-amber-400">{project.project_category || project.is_seasonal || 'عام'}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-white/5">
                          <div className="flex items-center gap-2 text-sm text-[#b0b8c8]">
                            <Users className="w-4 h-4" />
                            <span>المستفيدون: <strong style={{ color }}>{project.beneficiaries_count || 0}</strong></span>
                          </div>
                          <button 
                            onClick={() => setSelectedProject(project)}
                            className="px-5 py-2 bg-transparent border border-white/15 rounded-xl text-sm font-bold text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 cursor-pointer"
                          >
                            التفاصيل
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </ScrollReveal>
                )
              })}
            </div>
          </section>
        )}
      </div>

      {/* نافذة التفاصيل المنبثقة */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-md overflow-y-auto py-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#111827] border border-white/15 rounded-3xl p-8 max-w-2xl w-full relative shadow-2xl overflow-hidden my-auto max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: gradient }} />
              
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl">📁</span>
                <div>
                  <h3 className="text-2xl font-black text-white">{selectedProject.project_name}</h3>
                </div>
              </div>

              <div className="space-y-4 mb-6 text-sm text-[#b0b8c8]">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <h4 className="font-bold text-white mb-2">ملاحظات الجودة / الوصف:</h4>
                  <p className="leading-relaxed">{selectedProject.quality_notes || 'لا توجد ملاحظات إضافية.'}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-gray-400 block mb-1">معرّف التنفيذ:</span>
                    <span className="font-bold text-white">{selectedProject.implementation_id || 'غير محدد'}</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-gray-400 block mb-1">سنة التنفيذ:</span>
                    <span className="font-bold text-white">{selectedProject.execution_year || '2024'}</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-gray-400 block mb-1">الجهة المانحة:</span>
                    <span className="font-bold" style={{ color }}>{selectedProject.donor || 'خلية الأعمال الإنسانية'}</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-gray-400 block mb-1">عدد المستفيدين:</span>
                    <span className="font-bold text-white">{selectedProject.beneficiaries_count || 0}</span>
                  </div>
                </div>

                {selectedProject.google_maps_link && (
                  <div className="pt-2">
                    <a 
                      href={selectedProject.google_maps_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                    >
                      <span>عرض الموقع على خريطة جوجل (Google Maps)</span>
                    </a>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="w-full py-3 rounded-xl font-bold text-white transition-all cursor-pointer"
                style={{ background: gradient }}
              >
                إغلاق
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}