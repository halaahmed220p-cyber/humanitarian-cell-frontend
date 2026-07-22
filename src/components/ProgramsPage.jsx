import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Globe, Mail, Phone, MapPin } from 'lucide-react';
import BackgroundAnimation from '../components/BackgroundAnimation';
import ScrollReveal from '../components/ScrollReveal';
import { programsData, programIds } from '../data/programsData';

const programStyles = {
  rafed: { color: '#e8a87c', glowPos: 'top-[-50px] right-[-50px]' },
  himaya: { color: '#7ec8e8', glowPos: 'bottom-[-50px] left-[-50px]' },
  sarh: { color: '#a8e87e', glowPos: 'top-1/2 right-[-80px]' },
  wasam: { color: '#e87ec8', glowPos: 'bottom-[-50px] right-[-50px]' },
};

export default function ProgramsPage() {
  return (
    <div className="min-h-screen relative bg-[#0a0f1a] text-white flex flex-col font-['Tajawal',sans-serif]" dir="rtl">
      <BackgroundAnimation />

      {/* --- الهيدر الثابت (Header) --- */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-[#334155] px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/20 border border-[#c9a84c]/40 flex items-center justify-center text-[#c9a84c] font-black text-lg">
              HAC
            </div>
            <span className="font-extrabold text-lg text-white">خلية الأعمال الإنسانية</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#94a3b8]">
            <Link to="/" className="hover:text-[#c9a84c] transition-colors">الرئيسية</Link>
            <Link to="/about" className="hover:text-[#c9a84c] transition-colors">من نحن</Link>
            <Link to="/projects" className="hover:text-[#c9a84c] transition-colors">المشاريع</Link>
            <Link to="/programs" className="text-[#c9a84c] font-bold">برامجنا</Link>
            <Link to="/news" className="hover:text-[#c9a84c] transition-colors">الأخبار والتقارير</Link>
            <Link to="/contact" className="hover:text-[#c9a84c] transition-colors">تواصل معنا</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              to="/donate" 
              className="bg-[#c9a84c] text-[#0f172a] px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#e5c158] transition-all"
            >
              <Heart className="w-4 h-4 fill-current" />
              تبرع الآن
            </Link>
          </div>
        </div>
      </header>

      {/* --- محتوى الصفحة الرئيسي --- */}
      <main className="flex-1 max-w-[1400px] mx-auto px-6 w-full relative z-[2]">
        {/* Header Section */}
        <header className="text-center pt-36 pb-16">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 bg-[#c9a84c]/15 border border-[#c9a84c]/30 text-[#c9a84c] px-6 py-2 rounded-full text-sm font-bold mb-6">
              <span className="w-2 h-2 bg-[#c9a84c] rounded-full animate-pulse" />
              برامجنا الإنسانية والتنموية
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-black mb-5 leading-tight">
              نُحدث <span className="text-[#c9a84c] relative">فرقاً<span className="absolute -bottom-1 right-0 w-full h-1 bg-gradient-to-l from-[#c9a84c] to-transparent rounded-full" /></span> في حياة الناس
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-lg text-[#b0b8c8] max-w-2xl mx-auto leading-relaxed">
              أربعة برامج استراتيجية متخصصة (رافد، صرح، وسم، والحماية) تعمل بشكل متكامل لتقديم الدعم والإغاثة والتنمية المستدامة في المجتمعات الأكثر احتياجاً.
            </p>
          </ScrollReveal>
        </header>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 gap-8 pb-24">
          {programIds.map((id, index) => {
            const prog = programsData[id];
            const style = programStyles[id];

            return (
              <ScrollReveal key={id} delay={index * 0.1}>
                <Link
                  to={`/program/${id}`}
                  className="group block relative rounded-3xl overflow-hidden min-h-[420px] transition-all duration-500 hover:-translate-y-2.5 hover:scale-[1.02]"
                >
                  {/* Glass Background */}
                  <div className="absolute inset-0 bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/20" />

                  {/* Glow Effect */}
                  <div
                    className={`absolute w-[200px] h-[200px] rounded-full blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none ${style.glowPos}`}
                    style={{ background: style.color }}
                  />

                  {/* Content */}
                  <div className="relative z-10 p-10 h-full flex flex-col justify-between">
                    {/* Top */}
                    <div className="flex justify-between items-start mb-6">
                      <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl relative overflow-hidden"
                        style={{ background: `${style.color}20`, border: `1px solid ${style.color}40` }}
                      >
                        <div className="absolute inset-0 opacity-20 rounded-2xl" style={{ background: style.color }} />
                        <span className="relative z-10">{prog.icon}</span>
                      </div>
                      <span className="text-7xl font-black opacity-[0.08] leading-none">0{index + 1}</span>
                    </div>

                    {/* Body */}
                    <div className="flex-1">
                      <h2 className="text-3xl font-extrabold mb-3" style={{ color: style.color }}>
                        {prog.name}
                      </h2>
                      <p className="text-base font-medium mb-4 opacity-90" style={{ color: prog.colorLight }}>
                        {prog.slogan}
                      </p>

                      {/* Progress */}
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-5">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: style.color }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${[85, 72, 90, 68][index]}%` }}
                          transition={{ duration: 1.5, delay: 0.3 }}
                          viewport={{ once: true }}
                        />
                      </div>

                      <p className="text-sm text-[#b0b8c8] leading-relaxed mb-6">
                        {prog.description.slice(0, 120)}...
                      </p>

                      {/* Stats */}
                      <div className="flex gap-6 mb-6">
                        <div className="text-center">
                          <span className="text-xl font-extrabold block" style={{ color: style.color }}>
                            {prog.stats[0].value}
                          </span>
                          <span className="text-xs opacity-70">{prog.stats[0].label}</span>
                        </div>
                        <div className="text-center">
                          <span className="text-xl font-extrabold block" style={{ color: style.color }}>
                            {prog.stats[1].value}
                          </span>
                          <span className="text-xs opacity-70">{prog.stats[1].label}</span>
                        </div>
                        <div className="text-center">
                          <span className="text-xl font-extrabold block" style={{ color: style.color }}>
                            {prog.stats[2].value}
                          </span>
                          <span className="text-xs opacity-70">{prog.stats[2].label}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3">
                      <button
                        className="flex-1 py-3.5 px-6 rounded-xl font-bold text-sm transition-all duration-300 hover:-translate-y-0.5"
                        style={{ background: prog.gradient, color: '#1a1a1a' }}
                      >
                        <span className="flex items-center justify-center gap-2">
                          اكتشف البرنامج
                          <ArrowLeft className="w-4 h-4" />
                        </span>
                      </button>
                      <button className="py-3.5 px-6 rounded-xl font-bold text-sm bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300">
                        التفاصيل
                      </button>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </main>

      {/* --- الفوتر (Footer) --- */}
      <footer className="bg-[#0f172a] border-t border-[#334155] pt-16 pb-8 relative z-[2]">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/20 border border-[#c9a84c]/40 flex items-center justify-center text-[#c9a84c] font-black text-lg">
                HAC
              </div>
              <span className="font-extrabold text-lg text-white">خلية الأعمال الإنسانية</span>
            </div>
            <p className="text-[#94a3b8] text-sm leading-relaxed mb-4">
              منظمة تنموية وإنسانية تسعى لتقديم استجابات عضوية مستدامة ومؤثرة في المجتمعات الأكثر حاجة.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-base">روابط سريعة</h4>
            <ul className="space-y-2 text-sm text-[#94a3b8]">
              <li><Link to="/" className="hover:text-[#c9a84c] transition-colors">الرئيسية</Link></li>
              <li><Link to="/about" className="hover:text-[#c9a84c] transition-colors">من نحن</Link></li>
              <li><Link to="/projects" className="hover:text-[#c9a84c] transition-colors">المشاريع التنموية</Link></li>
              <li><Link to="/programs" className="hover:text-[#c9a84c] transition-colors">برامجنا الرئيسية</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-base">برامجنا الاستراتيجية</h4>
            <ul className="space-y-2 text-sm text-[#94a3b8]">
              <li><span className="hover:text-[#c9a84c] transition-colors cursor-pointer">برنامج رافد (الإغاثة العاجلة)</span></li>
              <li><span className="hover:text-[#c9a84c] transition-colors cursor-pointer">برنامج صرح (التنمية المستدامة)</span></li>
              <li><span className="hover:text-[#c9a84c] transition-colors cursor-pointer">برنامج وسم (التدريب والتمكين)</span></li>
              <li><span className="hover:text-[#c9a84c] transition-colors cursor-pointer">برنامج الحماية (الطفل والمرأة)</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-base">تواصل معنا</h4>
            <ul className="space-y-3 text-sm text-[#94a3b8]">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c9a84c]" />
                <span>اليمن - الجمهورية اليمنية</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#c9a84c]" />
                <span>info@humancell.org</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#c9a84c]" />
                <span>+967 000 000 000</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 border-t border-[#334155]/60 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-[#94a3b8]">
          <p>© 2026 خلية الأعمال الإنسانية (HAC).جميع الحقوق محفوظة.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="hover:text-[#c9a84c] cursor-pointer">سياسة الخصوصية</span>
            <span>•</span>
            <span className="hover:text-[#c9a84c] cursor-pointer">الشروط والأحكام</span>
          </div>
        </div>
      </footer>
    </div>
  );
}