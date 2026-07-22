import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';

export default function Navbar({ program }) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/90 backdrop-blur-md border-b border-white/10 px-6 py-4">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        
        {/* إذا كنا داخل صفحة تفاصيل البرنامج، نعرض زر العودة أو الشعار المناسب */}
        {program ? (
          <button
            onClick={() => navigate('/programs')}
            className="flex items-center gap-2 text-[#b0b8c8] hover:text-white transition-all duration-300 px-4 py-2 rounded-xl hover:bg-white/5"
          >
            <ArrowRight className="w-5 h-5" />
            <span className="font-medium">العودة للبرامج</span>
          </button>
        ) : (
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/20 border border-[#c9a84c]/40 flex items-center justify-center text-[#c9a84c] font-black text-lg">
              HAC
            </div>
            <span className="font-extrabold text-lg text-white">خلية الأعمال الإنسانية</span>
          </Link>
        )}

        {/* اسم البرنامج في المنتصف إذا وجد */}
        {program && (
          <div className="flex items-center gap-3 text-white">
            <span className="text-2xl">{program.icon}</span>
            <span className="text-xl font-extrabold" style={{ color: program.color }}>
              {program.name}
            </span>
          </div>
        )}

        {/* الروابط العامة في حال لم يكن هناك برنامج محدد */}
        {!program && (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#94a3b8]">
            <Link to="/" className="hover:text-[#c9a84c] transition-colors">الرئيسية</Link>
            <Link to="/about" className="hover:text-[#c9a84c] transition-colors">من نحن</Link>
            <Link to="/projects" className="hover:text-[#c9a84c] transition-colors">المشاريع</Link>
            <Link to="/programs" className="text-[#c9a84c] font-bold">برامجنا</Link>
            <Link to="/news" className="hover:text-[#c9a84c] transition-colors">الأخبار والتقارير</Link>
            <Link to="/contact" className="hover:text-[#c9a84c] transition-colors">تواصل معنا</Link>
          </nav>
        )}

        {/* زر التبرع أو مساحة متوازنة */}
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
  );
}