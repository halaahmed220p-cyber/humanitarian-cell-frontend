import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import BackgroundAnimation from '../components/BackgroundAnimation';
import ScrollReveal from '../components/ScrollReveal';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { programsData, programIds } from '../data/programsData';

// تحديد الهوية البصرية بدقة بناءً على ألوان الشعارات الفعليّة لكل برنامج مع ربط المشاريع التابعة رسمياً
const programStyles = {
  rafid: { 
    color: '#16a34a', 
    glowPos: 'top-[-50px] right-[-50px]',
    logo: '/rafid-logo.png',
    subProjects: ['نسك (لحوم الأضاحي)', 'قطوف (تمرة الإفطار)', 'موائد الخير (الوجبات)', 'يُسر (المساعدات النقدية)']
  },
  himaya: { 
    color: '#38bdf8', 
    glowPos: 'bottom-[-50px] left-[-50px]',
    logo: '/himaya-logo.png',
    subProjects: ['إعفاف (الزواج الجماعي)', 'عيدكم عيدنا (كسوة العيد)']
  },
  sarh: { 
    color: '#2563eb', 
    glowPos: 'top-1/2 right-[-80px]',
    logo: '/sarh-logo.png',
    subProjects: ['المشاريع التنموية', 'مشاريع البنية التحتية والاستدامة']
  },
  wasam: { 
    color: '#eab308', 
    glowPos: 'bottom-[-50px] right-[-50px]',
    logo: '/wasam-logo.png',
    subProjects: ['إقرأ (الحقيبة المدرسية)', 'أهل الذكر (مسابقة القرآن الكريم)']
  },
};

export default function ProgramsPage() {
  return (
    <div className="programs-theme min-h-screen flex flex-col" style={{ background: '#0b1d3a', color: '#fff' }}>
      <BackgroundAnimation />

      {/* --- استدعاء الهيدر الموحد الجديد --- */}
      <Header />

      {/* --- محتوى الصفحة الرئيسي --- */}
      <main className="flex-1 max-w-[1400px] mx-auto px-6 w-full relative z-[2] pt-24">
        
        {/* Header Section */}
        <header className="text-center pt-16 pb-16">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 bg-[#c9a84c]/15 border border-[#c9a84c]/30 text-[#c9a84c] px-6 py-2 rounded-full text-sm font-bold mb-6">
              <span className="w-2 h-2 bg-[#c9a84c] rounded-full animate-pulse" />
              البرامج الاستراتيجية والمشاريع المندرجة
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-black mb-5 leading-tight">
              البرامج <span className="text-[#c9a84c] relative">الرباعية الرئيسية<span className="absolute -bottom-1 right-0 w-full h-1 bg-gradient-to-l from-[#c9a84c] to-transparent rounded-full" /></span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-base text-[#b0b8c8] max-w-2xl mx-auto leading-relaxed">
              تندرج تحت البرامج الاستراتيجية الأربعة (رافد، وسم، الحماية، صرح) كافة المشاريع التنموية والموسميّة لخلية الأعمال الإنسانية وفق خطط العمل المعتمدة.
            </p>
          </ScrollReveal>
        </header>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 gap-8 pb-24">
          {programIds.map((id, index) => {
            const prog = programsData[id] || { name: id, slogan: '', description: '', stats: [] };
            const style = programStyles[id] || { color: '#c9a84c', glowPos: '', logo: '', subProjects: [] };

            return (
              <ScrollReveal key={id} delay={index * 0.1}>
                <div
                  className="group block relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2.5 hover:scale-[1.01]"
                >
                  {/* Glass Background */}
                  <div className="absolute inset-0 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl transition-all duration-500 group-hover:bg-white/[0.07] group-hover:border-white/20" />

                  {/* Glow Effect */}
                  <div
                    className={`absolute w-[200px] h-[200px] rounded-full blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none ${style.glowPos}`}
                    style={{ background: style.color }}
                  />

                  {/* Content */}
                  <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                    
                    {/* Top: Logo & Number */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-3 shadow-inner">
                          <img 
                            src={style.logo} 
                            alt={prog.name} 
                            className="w-full h-full object-contain relative z-10 drop-shadow-md transition-transform duration-300 group-hover:scale-110" 
                            onError={(e) => {
                              e.target.style.display = 'none';
                              if(e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                            }}
                          />
                          <span className="text-2xl hidden font-bold" style={{ color: style.color }}>{prog.name?.[0]}</span>
                        </div>
                        <div>
                          <h2 className="text-2xl font-extrabold mb-1" style={{ color: style.color }}>
                            {prog.name}
                          </h2>
                          <span className="text-xs font-medium text-white/70 block">
                            {prog.slogan}
                          </span>
                        </div>
                      </div>

                      <span className="text-6xl font-black opacity-[0.07] leading-none" style={{ color: style.color }}>0{index + 1}</span>
                    </div>

                    {/* Body Description */}
                    <div className="flex-1 mb-6">
                      <p className="text-sm text-[#b0b8c8] leading-relaxed mb-5">
                        {prog.description || "برنامج استراتيجي يهدف لتحقيق التنمية المستدامة والأثر المجتمعي الفعال."}
                      </p>

                      {/* Sub-projects Box (المشاريع المندرجة تحت البرنامج حسب توجيه العميل) */}
                      <div className="bg-black/20 border border-white/5 rounded-2xl p-4">
                        <span className="text-xs font-bold text-[#c9a84c] block mb-3 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]"></span>
                          المشاريع المندرجة تحت البرنامج:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {style.subProjects.map((sub, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-white/80 bg-white/5 px-3 py-2 rounded-xl">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: style.color }} />
                              <span className="truncate">{sub}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-3 pt-4 border-t border-white/5">
                      <Link
                        to={`/program/${id}`}
                        className="flex-1 py-3 px-5 rounded-xl font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 shadow-lg text-center flex items-center justify-center gap-2"
                        style={{ background: style.color, color: '#0b1d3a' }}
                      >
                        <span>اكتشف تفاصيل البرنامج</span>
                        <ArrowLeft className="w-4 h-4" />
                      </Link>
                    </div>

                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </main>

      {/* --- استدعاء الفوتر الموحد --- */}
      <Footer />
    </div>
  );
}