import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FolderKanban, Calendar, Star, DollarSign, CheckCircle2 } from 'lucide-react';
import BackgroundAnimation from '../components/BackgroundAnimation';
import ScrollReveal from '../components/ScrollReveal';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ProjectsPage() {
  const [filter, setFilter] = useState('all'); // all, major, seasonal

  // محفظة المشاريع (المشاريع الكبرى الاستراتيجية والمشاريع الموسمية)
  const projectsList = [
    {
      id: 1,
      title: 'برنامج إفطار الصائم السنوي',
      category: 'seasonal',
      program: 'وسم (المشاريع الموسمية)',
      description: 'مشروع موسمي رمضاني مبارك يستهدف توزيع السلال الغذائية وإفطار الصائمين في العائلات الأكثر احتياجاً.',
      budget: '$45,000',
      status: 'منجز وموثق',
      progress: 100,
      color: '#eab308'
    },
    {
      id: 2,
      title: 'توفير المياه النظيفة للمناطق النائية',
      category: 'major',
      program: 'صرح (التنمية المستدامة)',
      description: 'مشروع استراتيجي حيوي لمد شبكات المياه، حفر الآبار الارتوازية، وتركيب محطات التحلية لتوفير المياه الآمنة.',
      budget: '$120,000',
      status: 'جاري التنفيذ',
      progress: 75,
      color: '#2563eb'
    },
    {
      id: 3,
      title: 'كسوة العيد للأطفال الأيتام',
      category: 'seasonal',
      program: 'الحماية الرعائية',
      description: 'إدخال البهجة والسرور في قلوب الأطفال الأيتام والأسر المتعففة وتوفير ملابس العيد كاملة.',
      budget: '$30,000',
      status: 'موسمي متجدد',
      progress: 90,
      color: '#38bdf8'
    },
    {
      id: 4,
      title: 'دعم المستشفيات التخصصية بالأدوية',
      category: 'major',
      program: 'رافد (الإغاثة الطارئة)',
      description: 'توفير الأدوية المنقذة للحياة، المحاليل، والمستلزمات الطبية العاجلة لدعم القطاع الصحي في ظل الظروف الصعبة.',
      budget: '$200,000',
      status: 'استراتيجي مستمر',
      progress: 85,
      color: '#16a34a'
    }
  ];

  const filteredProjects = filter === 'all' 
    ? projectsList 
    : projectsList.filter(p => p.category === filter);

  return (
    <div className="projects-theme min-h-screen flex flex-col" style={{ background: '#0b1d3a', color: '#fff' }}>
      <BackgroundAnimation />

      {/* استدعاء الهيدر الموحد */}
      <Navbar />

      {/* محتوى الصفحة الرئيسي */}
      <main className="flex-1 max-w-[1400px] mx-auto px-6 w-full relative z-[2] pt-24">
        
        {/* الترويسة */}
        <header className="text-center pt-20 pb-14">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 bg-[#c9a84c]/15 border border-[#c9a84c]/30 text-[#c9a84c] px-6 py-2 rounded-full text-sm font-bold mb-6">
              <span className="w-2 h-2 bg-[#c9a84c] rounded-full animate-pulse" />
              محفظة المشاريع الاستراتيجية والموسمية
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-black mb-5 leading-tight">
              محفظة <span className="text-[#c9a84c] relative">المشاريع<span className="absolute -bottom-1 right-0 w-full h-1 bg-gradient-to-l from-[#c9a84c] to-transparent rounded-full" /></span> الإنسانية
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-lg text-[#b0b8c8] max-w-2xl mx-auto leading-relaxed">
              استعراض تفصيلي لأبرز المشاريع الحيوية الكبرى والمشاريع الموسمية التي تم إنجازها أو جارٍ تنفيذها بأعلى معايير الشفافية والأثر المستدام.
            </p>
          </ScrollReveal>
        </header>

        {/* أزرار التصفية الفخمة (فلترة المحفظة) */}
        <ScrollReveal delay={0.3}>
          <div className="flex justify-center gap-4 mb-16 flex-wrap">
            <button 
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                filter === 'all' 
                  ? 'bg-[#c9a84c] text-[#0b1d3a] shadow-lg shadow-[#c9a84c]/20' 
                  : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
              }`}
            >
              جميع المشاريع
            </button>
            <button 
              onClick={() => setFilter('major')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                filter === 'major' 
                  ? 'bg-[#c9a84c] text-[#0b1d3a] shadow-lg shadow-[#c9a84c]/20' 
                  : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
              }`}
            >
              ⭐ المشاريع الحيوية الكبرى
            </button>
            <button 
              onClick={() => setFilter('seasonal')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                filter === 'seasonal' 
                  ? 'bg-[#c9a84c] text-[#0b1d3a] shadow-lg shadow-[#c9a84c]/20' 
                  : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
              }`}
            >
              🌙 المشاريع الموسمية
            </button>
          </div>
        </ScrollReveal>

        {/* شبكة المشاريع */}
        <div className="grid md:grid-cols-2 gap-8 pb-24">
          {filteredProjects.map((proj, index) => (
            <ScrollReveal key={proj.id} delay={index * 0.1}>
              <div className="group relative rounded-3xl overflow-hidden p-8 bg-white/[0.06] backdrop-blur-xl border border-white/10 transition-all duration-500 hover:-translate-y-2 hover:border-[#c9a84c]/50 hover:bg-white/[0.09] shadow-xl flex flex-col justify-between h-full">
                
                <div>
                  {/* ترويسة البطاقة */}
                  <div className="flex justify-between items-center mb-5">
                    <span className="px-4 py-1.5 rounded-full text-xs font-bold" style={{ background: `${proj.color}20`, color: proj.color, border: `1px solid ${proj.color}40` }}>
                      {proj.category === 'major' ? 'مشروع استراتيجي كبير' : 'مشروع موسمي'}
                    </span>
                    <span className="text-sm font-bold text-[#4ade80] flex items-center gap-1">
                      <DollarSign className="w-4 h-4" /> {proj.budget}
                    </span>
                  </div>

                  <span className="text-xs text-[#c9a84c] font-semibold block mb-2">البرنامج التابع: {proj.program}</span>
                  <h3 className="text-2xl font-extrabold mb-3 text-white group-hover:text-[#c9a84c] transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-sm text-[#b0b8c8] leading-relaxed mb-6">
                    {proj.description}
                  </p>
                </div>

                <div>
                  {/* شريط الإنجاز */}
                  <div className="mb-6">
                    <div className="flex justify-between text-xs text-slate-300 mb-2 font-medium">
                      <span>نسبة الإنجاز والأثر</span>
                      <span style={{ color: proj.color }}>{proj.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: proj.color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${proj.progress}%` }}
                        transition={{ duration: 1.2, delay: 0.2 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>

                  {/* تذييل البطاقة */}
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#4ade80]" /> {proj.status}
                    </span>
                    <Link 
                      to={`/projects`} 
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#c9a84c] hover:underline"
                    >
                      التفاصيل الكاملة <ArrowLeft className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>

      </main>

      {/* استدعاء الفوتر الموحد */}
      <Footer />
    </div>
  );
}