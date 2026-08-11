import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Calendar, Users, X, Image as ImageIcon, Download } from 'lucide-react'
import BackgroundAnimation from '../components/BackgroundAnimation'
import Header from '../components/Header';
import Navbar from '../components/Navbar';

import Footer from '../components/Footer'
import ScrollReveal from '../components/ScrollReveal'
import ProgressBar from '../components/ProgressBar'
import './ProgramDetail.css'
import Navbar from './Navbar';

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

  useEffect(() => {
    setLoading(true)
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

  if (!program || !program.name) {
    return (
      <div className="program-detail-page min-h-screen flex flex-col justify-between pt-24 bg-[#0b132b]">
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

  const { color, gradient } = program
  const logoSrc = program.logo || programLogos[programId] || '/rafid-logo.png'

  return (
    <div className="program-detail-page min-h-screen flex flex-col relative pt-28">
      <BackgroundAnimation />
      <Navbar program={program} />

      <div className="flex-1 max-w-[1400px] mx-auto px-6 relative z-[2] w-full pt-10">
        
        <section className="pt-12 pb-16 text-center flex flex-col items-center">
          <ScrollReveal>
            <div className="mb-6 flex justify-center">
              <img 
                src={logoSrc} 
                alt={program.name} 
                className="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-xl transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2 rounded-full text-sm font-bold mb-6" style={{ color }}>
              {program.badge}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-5 text-white">
              {program.name}
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

        {program.projects && program.projects.length > 0 && (
          <section className="pb-20">
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-10">
                <h2 className="text-3xl font-extrabold text-white">مشاريع البرنامج</h2>
                <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}, transparent)`, opacity: 0.3 }} />
                <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-sm font-bold" style={{ color }}>
                  {program.projects.length} مشروع
                </span>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-7">
              {program.projects.map((project, i) => {
                const status = statusConfig[project.status] || statusConfig['active']
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
                            <MapPin className="w-3.5 h-3.5" /> {project.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> {project.date}
                          </span>
                        </div>

                        <h3 className="text-xl font-extrabold mb-3 text-white">{project.title}</h3>
                        <p className="text-sm text-[#b0b8c8] leading-relaxed mb-5">{project.description}</p>

                        <div className="mb-5">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-[#b0b8c8]">نسبة الإنجاز</span>
                            <span className="font-bold" style={{ color }}>{project.progress}%</span>
                          </div>
                          <ProgressBar progress={project.progress} color={color} />
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-white/5">
                          <div className="flex items-center gap-2 text-sm text-[#b0b8c8]">
                            <Users className="w-4 h-4" />
                            <span><strong style={{ color }}>{project.beneficiaries}</strong></span>
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
                <span className="text-5xl">{selectedProject.icon || '📁'}</span>
                <div>
                  <h3 className="text-2xl font-black text-white">{selectedProject.title}</h3>
                </div>
              </div>

              <div className="space-y-4 mb-6 text-sm text-[#b0b8c8]">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <h4 className="font-bold text-white mb-2">وصف المشروع:</h4>
                  <p className="leading-relaxed">{selectedProject.description}</p>
                </div>

                {/* التعريف الاستراتيجي */}
                {selectedProject.strategic_overview && (
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <h4 className="font-extrabold text-white mb-2 flex items-center gap-2 text-sm" style={{ color }}>
                      التعريف الاستراتيجي (OVERVIEW)
                    </h4>
                    <p className="text-sm text-[#b0b8c8] leading-relaxed mb-2">{selectedProject.strategic_overview}</p>
                    {selectedProject.strategic_overview_en && (
                      <p className="text-xs text-gray-500 italic">{selectedProject.strategic_overview_en}</p>
                    )}
                  </div>
                )}

                {/* الأهداف الاستراتيجية الميدانية */}
                {selectedProject.strategic_goals && selectedProject.strategic_goals.length > 0 && (
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <h4 className="font-extrabold text-white mb-3 text-sm" style={{ color }}>
                      الأهداف الاستراتيجية الميدانية
                    </h4>
                    <ul className="space-y-2 text-sm text-[#b0b8c8] list-disc list-inside">
                      {selectedProject.strategic_goals.map((goal, idx) => (
                        <li key={idx} className="leading-relaxed">{goal}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* التوافق الدولي */}
                {selectedProject.sdg_alignment && (
                  <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-xs font-bold text-amber-400 flex items-center gap-2">
                    <span>التوافق الدولي:</span>
                    <span>{selectedProject.sdg_alignment}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-gray-400 block mb-1">الموقع:</span>
                    <span className="font-bold text-white">{selectedProject.location || 'غير محدد'}</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-gray-400 block mb-1">التاريخ / الموسم:</span>
                    <span className="font-bold text-white">{selectedProject.date || 'مستمر'}</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-gray-400 block mb-1">نسبة الإنجاز:</span>
                    <span className="font-bold" style={{ color }}>{selectedProject.progress}%</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-gray-400 block mb-1">المستفيدون:</span>
                    <span className="font-bold text-white">{selectedProject.beneficiaries || 'غير محدد'}</span>
                  </div>
                </div>

                {selectedProject.download_url && (
                  <div className="pt-2">
                    <a 
                      href={selectedProject.download_url} 
                      download 
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>تحميل تفاصيل المشروع / التقرير (PDF)</span>
                    </a>
                  </div>
                )}

                {selectedProject.media && selectedProject.media.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h4 className="font-extrabold text-white mb-4 flex items-center gap-2 text-base">
                      <ImageIcon className="w-5 h-5" style={{ color }} />
                      توثيق الصور والفيديوهات للمشروع
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedProject.media.map((item, idx) => (
                        <div key={idx} className="bg-black/30 rounded-2xl overflow-hidden border border-white/10">
                          {item.type === 'image' ? (
                            <img src={item.url} alt={item.caption || "توثيق"} className="w-full h-40 object-cover" />
                          ) : (
                            <video src={item.url} controls className="w-full h-40 object-cover" />
                          )}
                          {item.caption && (
                            <div className="p-2 text-xs text-center text-white bg-white/5">{item.caption}</div>
                          )}
                        </div>
                      ))}
                    </div>
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