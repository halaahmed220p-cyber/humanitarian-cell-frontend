import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Calendar, Users, X } from 'lucide-react'
import BackgroundAnimation from '../components/BackgroundAnimation'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ScrollReveal from '../components/ScrollReveal'
import './ProgramDetail.css'

// خريطة تحويل الأسماء النصية في الرابط إلى الـ ID الرقمي المطابق لقاعدة البيانات
const programIdMap = {
  rafed: 3,
  himaya: 4,
  sarh: 1,
  wasam: 2,
}

const statusConfig = {
  active: { label: 'نشط', className: 'bg-green-400/25 text-green-400 border-green-400/30' },
  completed: { label: 'مكتمل', className: 'bg-blue-400/25 text-blue-400 border-blue-400/30' },
  ongoing: { label: 'قيد التنفيذ', className: 'bg-orange-400/25 text-orange-400 border-orange-400/30' },
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
    
    // تحويل النص (مثل rafed) إلى الرقم الصحيح (مثل 1) الذي يطلبه السيرفر
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
  const gradient = program.gradient || 'linear-gradient(135deg, #eab308, #ca8a04)'
  const logoSrc = program.logo || programLogos[programId] || '/rafid-logo.png'

  const rawProjects = program.projects || []

  const categories = ['all', ...new Set(rawProjects.map(p => p.project_category || p.is_seasonal || 'عام'))]

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
                alt={program.name} 
                className="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-xl"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-5 text-white">
              {program.name}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <p className="text-lg text-[#b0b8c8] max-w-3xl leading-relaxed">
              {program.description || 'برنامج استراتيجي يهدف لتحقيق التنمية المستدامة.'}
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

    {/* الأزرار والتصنيفات المستخرجة من project_category */}
    <ScrollReveal delay={0.1}>
      <div className="flex flex-wrap gap-3 mb-10 border-b border-white/10 pb-5">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'all' ? 'text-[#0b132b] shadow-lg' : 'bg-white/5 text-white border border-white/10'
          }`}
          style={activeTab === 'all' ? { backgroundColor: color } : {}}
        >
          جميع المشاريع ({rawProjects.length})
        </button>

        {categories.filter(c => c !== 'all').map((cat, idx) => {
          // حساب عدد المشاريع التابعة لهذا التصنيف
          const count = rawProjects.filter(p => p.project_category === cat).length;
          
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

    {/* شبكة المشاريع المصفاة */}
    <div className="grid md:grid-cols-2 gap-7">
      {filteredProjects.map((project, i) => {
        return (
          <ScrollReveal key={project.id || i} delay={i * 0.1}>
            <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-500 p-7">
              <div className="flex gap-4 mb-3 flex-wrap text-sm text-[#b0b8c8]">
                <span className="flex items-center gap-1">📍 {project.location || 'اليمن'}</span>
                <span className="flex items-center gap-1">📅 {project.date || '2026'}</span>
                {project.project_category && (
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-white/10 text-[#c9a84c]">
                    {project.project_category}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-extrabold mb-3 text-white">{project.title || project.project_name}</h3>
              <p className="text-sm text-[#b0b8c8] leading-relaxed mb-5">{project.description || project.quality_notes || 'مشروع تنموي مستدام.'}</p>

              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-sm text-[#b0b8c8]">
                  <span>المستفيدون: <strong style={{ color }}>{project.beneficiaries || project.beneficiaries_count || 'غير محدد'}</strong></span>
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
      <Footer />
    </div>
  )
}