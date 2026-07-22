import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Calendar, Users, ChevronLeft } from 'lucide-react'
import BackgroundAnimation from '../components/BackgroundAnimation'
import Navbar from '../components/Navbar'
import ScrollReveal from '../components/ScrollReveal'
import ProgressBar from '../components/ProgressBar'

const statusConfig = {
  active: { label: 'نشط', className: 'bg-green-400/20 text-green-400 border-green-400/30' },
  completed: { label: 'مكتمل', className: 'bg-blue-400/20 text-blue-400 border-blue-400/30' },
  ongoing: { label: 'قيد التنفيذ', className: 'bg-orange-400/20 text-orange-400 border-orange-400/30' },
}

export default function ProgramDetail({ programs }) {
  const { programId } = useParams()
  const navigate = useNavigate()
  const program = programs[programId]

  if (!program) {
    return (
      <div className="program-detail-page py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">البرنامج غير موجود</h1>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#c9a84c] text-[#1a1a1a] rounded-xl font-bold"
          >
            العودة للبرامج
          </button>
        </div>
      </div>
    )
  }

  const { color, colorLight, gradient } = program

  return (
    <div className="min-h-screen relative">
      <BackgroundAnimation />
      <Navbar program={program} />

      <div className="max-w-[1400px] mx-auto px-6 relative z-[2]">
        {/* Hero */}
        <section className="pt-36 pb-16">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2 rounded-full text-sm font-bold mb-6" style={{ color }}>
              {program.badge}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-5">
              {program.name}<br />
              <span className="relative" style={{ color }}>
                {program.slogan}
                <span className="absolute -bottom-2 right-0 w-full h-1 rounded-full" style={{ background: gradient }} />
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-lg text-[#b0b8c8] max-w-3xl leading-relaxed">
              {program.description}
            </p>
          </ScrollReveal>
        </section>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16">
          {program.stats.map((stat, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <motion.div
                className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-7 text-center relative overflow-hidden group hover:-translate-y-1 transition-all duration-400 hover:border-white/20"
                whileHover={{ scale: 1.02 }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: gradient }}
                />
                <span className="text-3xl block mb-3">{stat.icon}</span>
                <span className="text-3xl font-black block mb-2" style={{ color }}>
                  {stat.value}
                </span>
                <span className="text-sm text-[#b0b8c8] font-medium">{stat.label}</span>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Impact Section */}
        <section className="py-14 px-10 mb-16 rounded-[32px] border border-white/5"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))' }}
        >
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-3xl font-extrabold">أثر البرنامج</h2>
              <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}, transparent)`, opacity: 0.3 }} />
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-10">
            {program.impacts.map((impact, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <div className="text-center py-5 group">
                  <div className="w-[70px] h-[70px] rounded-[20px] bg-white/5 border border-white/10 flex items-center justify-center text-3xl mx-auto mb-4 transition-all duration-400 group-hover:bg-white/10 group-hover:scale-110"
                    style={{ borderColor: `${color}40` }}
                  >
                    {impact.icon}
                  </div>
                  <h4 className="text-lg font-bold mb-2">{impact.title}</h4>
                  <p className="text-sm text-[#b0b8c8] leading-relaxed">{impact.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section className="pb-20">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-3xl font-extrabold">مشاريع البرنامج</h2>
              <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}, transparent)`, opacity: 0.3 }} />
              <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-sm font-bold" style={{ color }}>
                {program.projects.length} مشروع
              </span>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-7">
            {program.projects.map((project, i) => {
              const status = statusConfig[project.status]
              return (
                <ScrollReveal key={project.id} delay={i * 0.1}>
                  <motion.div
                    className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden group hover:-translate-y-2 hover:border-white/20 transition-all duration-500"
                    whileHover={{ y: -8 }}
                  >
                    {/* Image */}
                    <div className="w-full h-[220px] relative overflow-hidden flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))' }}
                    >
                      <span className="text-6xl opacity-30 group-hover:scale-110 transition-transform duration-500">
                        {project.icon}
                      </span>
                      <span className={`absolute top-4 right-4 px-3.5 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border ${status.className}`}>
                        {status.label}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-7">
                      <div className="flex gap-4 mb-3 flex-wrap text-sm text-[#b0b8c8]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {project.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {project.date}
                        </span>
                      </div>

                      <h3 className="text-xl font-extrabold mb-3">{project.title}</h3>
                      <p className="text-sm text-[#b0b8c8] leading-relaxed mb-5">{project.desc}</p>

                      {/* Progress */}
                      <div className="mb-5">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-[#b0b8c8]">نسبة الإنجاز</span>
                          <span className="font-bold" style={{ color }}>{project.progress}%</span>
                        </div>
                        <ProgressBar progress={project.progress} color={color} />
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between items-center pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 text-sm text-[#b0b8c8]">
                          <Users className="w-4 h-4" />
                          <span><strong style={{ color }}>{project.beneficiaries.split(' ')[0]}</strong> {project.beneficiaries.split(' ').slice(1).join(' ')}</span>
                        </div>
                        <button className="px-5 py-2 bg-transparent border border-white/15 rounded-xl text-sm font-bold hover:bg-white/10 hover:border-white/40 transition-all duration-300">
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

        {/* Timeline */}
        <section className="pb-20">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-3xl font-extrabold">أحداث وإنجازات</h2>
              <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}, transparent)`, opacity: 0.3 }} />
            </div>
          </ScrollReveal>

          <div className="relative pr-8">
            <div className="absolute right-[7px] top-0 bottom-0 w-0.5" style={{ background: `linear-gradient(180deg, ${color}, transparent)`, opacity: 0.3 }} />

            {program.timeline.map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1} direction="right">
                <div className="relative pr-10 pb-10">
                  <div
                    className="absolute right-[-5px] top-1 w-3.5 h-3.5 rounded-full border-[3px] border-[#1a2a4a]"
                    style={{ background: color, boxShadow: `0 0 0 3px rgba(255,255,255,0.1)` }}
                  />
                  <div className="text-sm font-bold mb-1.5" style={{ color }}>{item.date}</div>
                  <h4 className="text-lg font-bold mb-1">{item.title}</h4>
                  <p className="text-sm text-[#b0b8c8] leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <div className="text-center py-20 border-t border-white/5">
          <ScrollReveal>
            <h3 className="text-3xl font-extrabold mb-4">كن جزءاً من التغيير</h3>
            <p className="text-[#b0b8c8] mb-8 max-w-lg mx-auto">
              ساهم معنا في دعم برنامج {program.name} وإحداث فرق حقيقي في حياة المحتاجين
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <motion.button
                className="px-10 py-4 rounded-2xl font-extrabold text-base transition-all"
                style={{ background: gradient, color: '#1a1a1a' }}
                whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}
                whileTap={{ scale: 0.98 }}
              >
                تبرع للبرنامج
              </motion.button>
              <motion.button
                className="px-10 py-4 rounded-2xl font-bold text-base bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                تواصل معنا
              </motion.button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  )
}