import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import BackgroundAnimation from '../components/BackgroundAnimation';
import ScrollReveal from '../components/ScrollReveal';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { programsData, programIds } from '../data/programsData';

// تحديد مسارات الشعارات وألوان الهوية البصرية لكل برنامج
const programStyles = {
  rafed: { 
    color: '#e8a87c', 
    glowPos: 'top-[-50px] right-[-50px]',
    logo: '/rafid-logo.png' 
  },
  himaya: { 
    color: '#7ec8e8', 
    glowPos: 'bottom-[-50px] left-[-50px]',
    logo: '/himaya-logo.png' // استبدليه بمسار شعار الحماية عند توفره
  },
  sarh: { 
    color: '#a8e87e', 
    glowPos: 'top-1/2 right-[-80px]',
    logo: '/sarh-logo.png' // مسار شعار صرح
  },
  wasam: { 
    color: '#e87ec8', 
    glowPos: 'bottom-[-50px] right-[-50px]',
    logo: '/wasam-logo.png' // مسار شعار وسم
  },
};

export default function ProgramsPage() {
  return (
    <div className="programs-theme min-h-screen flex flex-col">
      <BackgroundAnimation />

      {/* --- استدعاء الهيدر الموحد --- */}
      <Navbar />

      {/* --- محتوى الصفحة الرئيسي --- */}
      <main className="flex-1 max-w-[1400px] mx-auto px-6 w-full relative z-[2] pt-24">
        {/* Header Section */}
        <header className="text-center pt-20 pb-16">
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
                      {/* عرض الشعار مباشرة بدون خلفية أو مربعات وبحجم واضح */}
                      <div className="flex items-center">
                        <img 
                          src={style.logo} 
                          alt={prog.name} 
                          className="w-24 h-24 object-contain relative z-10 drop-shadow-md transition-transform duration-300 group-hover:scale-105" 
                          onError={(e) => {
                            // في حال لم يتم رفع الصورة بعد، يتم إظهار الإيموجي الاحتياطي مؤقتاً
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <span className="text-4xl hidden" style={{ color: style.color }}>{prog.icon}</span>
                      </div>

                      <span className="text-7xl font-black opacity-[0.08] leading-none" style={{ color: style.color }}>0{index + 1}</span>
                    </div>

                    {/* Body */}
                    <div className="flex-1">
                      <h2 className="text-3xl font-extrabold mb-3" style={{ color: style.color }}>
                        {prog.name}
                      </h2>
                      <p className="text-base font-medium mb-4 opacity-90" style={{ color: style.color }}>
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
                          <span className="text-xs opacity-70 text-white/70">{prog.stats[0].label}</span>
                        </div>
                        <div className="text-center">
                          <span className="text-xl font-extrabold block" style={{ color: style.color }}>
                            {prog.stats[1].value}
                          </span>
                          <span className="text-xs opacity-70 text-white/70">{prog.stats[1].label}</span>
                        </div>
                        <div className="text-center">
                          <span className="text-xl font-extrabold block" style={{ color: style.color }}>
                            {prog.stats[2].value}
                          </span>
                          <span className="text-xs opacity-70 text-white/70">{prog.stats[2].label}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3">
                      <button
                        className="flex-1 py-3.5 px-6 rounded-xl font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
                        style={{ background: style.color, color: '#1a1a1a' }}
                      >
                        <span className="flex items-center justify-center gap-2">
                          اكتشف البرنامج
                          <ArrowLeft className="w-4 h-4" />
                        </span>
                      </button>
                      <button 
                        className="py-3.5 px-6 rounded-xl font-bold text-sm bg-transparent border transition-all duration-300 hover:bg-white/10"
                        style={{ borderColor: `${style.color}66`, color: style.color }}
                      >
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

      {/* --- استدعاء الفوتر الموحد --- */}
      <Footer />
    </div>
  );
}