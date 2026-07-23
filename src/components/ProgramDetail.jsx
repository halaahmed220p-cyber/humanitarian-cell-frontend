import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Calendar, Users, ChevronLeft } from 'lucide-react'
import BackgroundAnimation from '../components/BackgroundAnimation'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ScrollReveal from '../components/ScrollReveal'
import ProgressBar from '../components/ProgressBar'
import './ProgramDetail.css'

const statusConfig = {
  active: { label: 'نشط', className: 'bg-green-400/25 text-green-400 border-green-400/30' },
  completed: { label: 'مكتمل', className: 'bg-blue-400/25 text-blue-400 border-blue-400/30' },
  ongoing: { label: 'قيد التنفيذ', className: 'bg-orange-400/25 text-orange-400 border-orange-400/30' },
}

export default function ProgramDetail({ programs }) {
  const { programId } = useParams()
  const navigate = useNavigate()
  
  // جلب البيانات الأساسية إن وجدت
  let program = programs && programs[programId] ? { ...programs[programId] } : {};

  // فرض التعديلات الجذرية لبرنامج "رافد" لضمان تغير اللون والنصوص فوراً
  if (programId === 'rafid') {
    program = {
      name: "برنامج رافد",
      slogan: "التدخلات الإنسانية العاجلة والغذاء والمأوى لكل محتاج",
      badge: "برنامج الاستجابة الإنسانية العاجلة",
      description: "برنامج رافد هو خط الدفاع الإنساني الأول في خلية الأعمال الإنسانية، يتخصص في التدخلات الإنسانية العاجلة والطوارئ وتقديم المعونات الغذائية الطارئة والمأوى والاحتياجات الأساسية للمتضررين والنازحين.",
      color: "#16a34a", // اللون الأخضر الإنساني الصحيح
      colorLight: "#4ade80",
      gradient: "linear-gradient(135deg, #16a34a, #15803d)",
      icon: "🚑",
      stats: [
        { label: "أسرة مستفيدة من الغذاء", value: "75,000+", icon: "🍲" },
        { label: "خيمة ومأوى طارئ", value: "15,000+", icon: "⛺" },
        { label: "تدخل عاجل منفذ", value: "120+", icon: "⚡" },
        { label: "منطقة متضررة مغطاة", value: "22", icon: "📍" }
      ],
      impacts: [
        { title: "الأمن الغذائي الطارئ", desc: "توزيع السلال الغذائية المتكاملة على الأسر الأشد فقراً والنازحين في مناطق الطوارئ.", icon: "🌾" },
        { title: "المأوى والإيواء العاجل", desc: "توفير الخيام والمساعدات غير الغذائية والخيام الإيوائية للعائلات المتضررة.", icon: "🏠" },
        { title: "التدخلات الإنسانية السريعة", desc: "الاستجابة الفورية للكوارث والأزمات الطارئة عبر فرق الميدان المتنقلة.", icon: "🚨" }
      ],
      projects: [
        {
          id: "rafid-1",
          title: "مشروع الاستجابة العاجلة وتوزيع الغذاء",
          location: "المناطق المتضررة والنازحون",
          date: "2026",
          desc: "توفير الحصص الغذائية الإغاثية العاجلة لتخفيف حدة انعدام الأمن الغذائي.",
          progress: 92,
          beneficiaries: "50,000 مستفيد",
          status: "active",
          icon: "📦"
        },
        {
          id: "rafid-2",
          title: "حملة إيواء المتضررين وتوفير المساكن المؤقتة",
          location: "مخيمات النزوح والطوارئ",
          date: "2026",
          desc: "توزيع المواد الإيوائية والخيام لتوفير بيئة آمنة للعائلات التي فقدت مساكنها.",
          progress: 80,
          beneficiaries: "25,000 مستفيد",
          status: "ongoing",
          icon: "⛺"
        }
      ],
      timeline: [
        { date: "مارس 2026", title: "توسيع عمليات الإغاثة الطارئة", desc: "رفع جاهزية فرق التدخل السريع للوصول إلى المناطق النائية والمتضررة." },
        { date: "مشاريع سابقة", title: "إغاثة مئات الآلاف من المتضررين", desc: "تنفيذ حملات واسعة النطاق لتوزيع الغذاء والمأوى في مختلف المحافظات." }
      ]
    };
  } else if (programId === 'sarh') {
    program = {
      name: "برنامج صرح",
      slogan: "التنمية المستدامة والعمل المناخي في كل القطاعات",
      badge: "برنامج التنمية المستدامة والمناخ",
      description: "برنامج صرح هو الركيزة الاستراتيجية للتنمية المستدامة والعمل المناخي الشامل في اليمن.",
      color: "#2563eb",
      colorLight: "#93c5fd",
      gradient: "linear-gradient(135deg, #2563eb, #1d4ed8)",
      icon: "🏛️",
      stats: [
        { label: "مشروع تنموي ومناخي", value: "85+", icon: "🌍" },
        { label: "محافظة مستفيدة", value: "18", icon: "📍" },
        { label: "مستفيد مباشر", value: "250,000+", icon: "👥" },
        { label: "قطاع حيوي مغطى", value: "6+", icon: "⚡" }
      ],
      impacts: [
        { title: "الطاقة المتجددة والمياه", desc: "إنشاء محطات الطاقة الشمسية وأنظمة إمداد المياه النظيفة.", icon: "💧" },
        { title: "الصحة والتعليم المستدام", desc: "تأهيل وبناء المرافق الصحية والتعليمية بمعايير صديقة للبيئة.", icon: "🏫" },
        { title: "البنية التحتية والطرق", desc: "تطوير الطرق وشبكات الربط الحيوي لتسهيل حركة التجارة.", icon: "🛣️" }
      ],
      projects: [
        { id: "sarh-1", title: "مشروع الطاقة الشمسية للمياه", location: "مختلف المحافظات", date: "2026", desc: "تشغيل آبار المياه بالطاقة النظيفة.", progress: 90, beneficiaries: "80,000 مستفيد", status: "active", icon: "☀️" }
      ],
      timeline: [
        { date: "يناير 2026", title: "إطلاق استراتيجية العمل المناخي", desc: "توسيع نطاق مشاريع صرح ليشمل قطاعات الطاقة." }
      ]
    };
  } else if (programId === 'wasam' || programId === 'wasm') {
    program = {
      name: "برنامج وسم",
      slogan: "التدريب والتأهيل وبناء القدرات ودعم مشاريع التمكين",
      badge: "برنامج التدريب وبناء القدرات",
      description: "برنامج وسم هو الذراع المتخصص في خلية الأعمال الإنسانية للتدريب والتأهيل وبناء القدرات.",
      color: "#9333ea",
      colorLight: "#c084fc",
      gradient: "linear-gradient(135deg, #9333ea, #7e22ce)",
      icon: "🎯",
      stats: [
        { label: "متدرب مؤهل", value: "22,000+", icon: "👥" },
        { label: "برنامج تدريبي", value: "45+", icon: "📚" },
        { label: "مشروع تمكين", value: "120+", icon: "💡" },
        { label: "محافظة مستهدفة", value: "15", icon: "📍" }
      ],
      impacts: [
        { title: "التدريب المهني والحرفي", desc: "برامج تأهيلية مكثفة لاكتساب المهارات الحرفية.", icon: "🛠️" },
        { title: "بناء القدرات القيادية", desc: "تطوير القدرات الإدارية والقيادية للشباب.", icon: "📈" },
        { title: "دعم مشاريع التمكين", desc: "تقديم الدعم الفني والتمويلي لمشاريع التمكين.", icon: "🤝" }
      ],
      projects: [
        { id: "wasam-1", title: "مشروع التمكين الاقتصادي", location: "المحافظات المحررة", date: "2026", desc: "توفير التدريب اللازم للأسر المنتجة.", progress: 85, beneficiaries: "5,000 مستفيد", status: "active", icon: "💼" }
      ],
      timeline: [
        { date: "فبراير 2026", title: "إطلاق حزمة برامج التمكين الجديدة", desc: "توسيع نطاق دورات التدريب المهني." }
      ]
    };
  }

  if (!program || !program.name) {
    return (
      <div className="program-detail-page min-h-screen flex flex-col justify-between pt-24">
        <Navbar />
        <div className="text-center py-24">
          <h1 className="text-4xl font-black mb-4 text-white">البرنامج غير موجود</h1>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#16a34a] text-white rounded-xl font-bold"
          >
            العودة للبرامج
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  const { color, gradient } = program

  return (
    <div className="program-detail-page min-h-screen flex flex-col relative pt-28">
      <BackgroundAnimation />
      <Navbar program={program} />

      <div className="flex-1 max-w-[1400px] mx-auto px-6 relative z-[2] w-full pt-10">
        {/* Hero */}
        <section className="pt-12 pb-16">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2 rounded-full text-sm font-bold mb-6" style={{ color: color }}>
              {program.badge}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-5 text-white">
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
          {program.stats && program.stats.map((stat, i) => (
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
                <span className="text-3xl font-black block mb-2" style={{ color: color }}>
                  {stat.value}
                </span>
                <span className="text-sm text-[#b0b8c8] font-medium">{stat.label}</span>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Impact Section */}
        {program.impacts && (
          <section className="py-14 px-10 mb-16 rounded-[32px] border border-white/5"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))' }}
          >
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-10">
                <h2 className="text-3xl font-extrabold text-white">أثر البرنامج</h2>
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
                    <h4 className="text-lg font-bold mb-2 text-white">{impact.title}</h4>
                    <p className="text-sm text-[#b0b8c8] leading-relaxed">{impact.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {program.projects && (
          <section className="pb-20">
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-10">
                <h2 className="text-3xl font-extrabold text-white">مشاريع البرنامج</h2>
                <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}, transparent)`, opacity: 0.3 }} />
                <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-sm font-bold" style={{ color: color }}>
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
                          {project.icon}
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
                        <p className="text-sm text-[#b0b8c8] leading-relaxed mb-5">{project.desc}</p>

                        <div className="mb-5">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-[#b0b8c8]">نسبة الإنجاز</span>
                            <span className="font-bold" style={{ color: color }}>{project.progress}%</span>
                          </div>
                          <ProgressBar progress={project.progress} color={color} />
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-white/5">
                          <div className="flex items-center gap-2 text-sm text-[#b0b8c8]">
                            <Users className="w-4 h-4" />
                            <span><strong style={{ color: color }}>{project.beneficiaries.split(' ')[0]}</strong> {project.beneficiaries.split(' ').slice(1).join(' ')}</span>
                          </div>
                          <button className="px-5 py-2 bg-transparent border border-white/15 rounded-xl text-sm font-bold text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300">
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

        {/* Timeline */}
        {program.timeline && (
          <section className="pb-20">
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-10">
                <h2 className="text-3xl font-extrabold text-white">أحداث وإنجازات</h2>
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
                    <div className="text-sm font-bold mb-1.5" style={{ color: color }}>{item.date}</div>
                    <h4 className="text-lg font-bold mb-1 text-white">{item.title}</h4>
                    <p className="text-sm text-[#b0b8c8] leading-relaxed">{item.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* Footer CTA */}
        <div className="text-center py-20 border-t border-white/5">
          <ScrollReveal>
            <h3 className="text-3xl font-extrabold mb-4 text-white">كن جزءاً من التغيير</h3>
            <p className="text-[#b0b8c8] mb-8 max-w-lg mx-auto">
              ساهم معنا في دعم برنامج {program.name} وإحداث فرق حقيقي في حياة المحتاجين
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <motion.button
                className="px-10 py-4 rounded-2xl font-extrabold text-base transition-all text-[#1a1a1a]"
                style={{ background: color }}
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

      <Footer />
    </div>
  )
}