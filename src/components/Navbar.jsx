import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { ArrowRight, Heart, Globe } from 'lucide-react';

export default function Navbar({ program }) {
  const [tickerNews, setTickerNews] = useState([]);
  const [currentLang, setCurrentLang] = useState('ar');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // قراءة اللغة الحالية من الكوكيز للتعرف على الوضع الحالي
    const match = document.cookie.match(/(?:^|; )googtrans=([^;]*)/);
    if (match && match[1].endsWith('/en')) {
      setCurrentLang('en');
    } else {
      setCurrentLang('ar');
    }

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://humanitarian-cell-frontend.onrender.com';
    fetch(`${baseUrl}/api/news/ticker`)
      .then(res => res.json())
      .then(data => setTickerNews(data))
      .catch(err => console.error("Error fetching ticker news:", err));
  }, []);

  // دالة لتغيير اللغة المباشرة عبر كوكيز ترجمة جوجل وإعادة تحميل الصفحة
  const handleGoogleTranslate = () => {
    if (currentLang === 'ar') {
      document.cookie = "googtrans=/ar/en; path=/";
      document.cookie = "googtrans=/ar/en; domain=" + window.location.hostname + "; path=/";
    } else {
      document.cookie = "googtrans=/ar/ar; path=/";
      document.cookie = "googtrans=/ar/ar; domain=" + window.location.hostname + "; path=/";
    }
    window.location.reload();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[9999] bg-white shadow-md border-b border-slate-200" dir="rtl">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
          
          {/* الشعار */}
          {program ? (
            <button
              onClick={() => navigate('/programs')}
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900 px-4 py-2 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              <ArrowRight className="w-5 h-5" />
              <span className="font-medium">العودة للبرامج</span>
            </button>
          ) : (
            <a href="/" className="logo flex items-center gap-3">
              <img src="/logo.png" alt="شعار الخلية" style={{ width: '45px', height: '45px', objectFit: 'contain' }} />
              <div className="logo-text flex flex-col text-right">
                <span className="font-extrabold text-lg text-slate-900">خلية الأعمال الإنسانية</span>
                <span className="text-xs text-slate-500">HUMANITARIAN ACTION CELL</span>
              </div>
            </a>
          )}

          {/* روابط التنقل */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" className="text-slate-700 hover:text-[#c9a84c] font-medium">الرئيسية</NavLink>
            <HashLink smooth to="/#about" className="text-slate-700 hover:text-[#c9a84c] font-medium">من نحن</HashLink>
            <NavLink to="/projects" className="text-slate-700 hover:text-[#c9a84c] font-medium">المشاريع</NavLink>
            <NavLink to="/programs" className="text-slate-700 hover:text-[#c9a84c] font-medium">البرامج</NavLink>
            <NavLink to="/news" className="text-slate-700 hover:text-[#c9a84c] font-medium">الأخبار والتقارير</NavLink>
          </nav>

          {/* الأزرار */}
          <div className="flex items-center gap-3">
            <button 
              onClick={handleGoogleTranslate}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition text-sm font-medium flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Globe className="w-4 h-4 text-slate-500" />
              <span>{currentLang === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            <NavLink to="/donate" className="bg-[#c9a84c] text-slate-900 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#e5c158] transition shadow-sm">
              <Heart className="w-4 h-4 fill-current" />
              تبرع الآن
            </NavLink>
          </div>
        </div>

        {/* الشريط الإخباري */}
        {tickerNews.length > 0 && (
          <div className="bg-slate-900 text-white py-1.5 px-4 text-xs overflow-hidden whitespace-nowrap border-t border-slate-200">
            <div className="inline-block animate-marquee">
              {tickerNews.map((item, index) => (
                <span key={index} className="mx-4">{item.title} {index < tickerNews.length - 1 ? " | " : ""}</span>
              ))}
            </div>
          </div>
        )}
      </header>

      <div style={{ height: '110px' }}></div>
    </>
  );
}