import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { ArrowRight, Heart, Globe } from 'lucide-react';

export default function Navbar({ program }) {
  const [tickerNews, setTickerNews] = useState([]);
  const [currentLang, setCurrentLang] = useState('ar');
  const location = useLocation();
  const navigate = useNavigate();

  // دالة تغيير اللغة عبر محرك جوجل وتحديث اتجاه الصفحة (RTL / LTR)
  const toggleLanguage = () => {
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    setCurrentLang(newLang);
    
    // تحديث اتجاه لغة الصفحة
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';

    // البحث عن قائمة اختيار جوجل المخفية وتغيير قيمتها برمجياً
    const selectElement = document.querySelector('.goog-te-combo');
    if (selectElement) {
      selectElement.value = newLang;
      selectElement.dispatchEvent(new Event('change'));
    }
  };

  useEffect(() => {
    // جلب الشريط الإخباري
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://humanitarian-cell-frontend.onrender.com';
    fetch(`${baseUrl}/api/news/ticker`)
      .then(res => res.json())
      .then(data => setTickerNews(data))
      .catch(err => console.error("Error fetching ticker news:", err));
  }, []);

  const isAr = currentLang === 'ar';

  return (
    <>
      {/* عنصر ترجمة جوجل المخفي (ضروري لكي يعمل المحرك في الخلفية) */}
      <div id="google_translate_element"></div>

      <header 
        className="fixed top-0 left-0 right-0 z-[9999] bg-white shadow-md border-b border-slate-200"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
          
          {/* الشعار أو زر العودة */}
          {program ? (
            <button
              onClick={() => navigate('/programs')}
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900 px-4 py-2 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              <ArrowRight className={`w-5 h-5 ${isAr ? '' : 'rotate-180'}`} />
              <span className="font-medium">{isAr ? "العودة للبرامج" : "Back to Programs"}</span>
            </button>
          ) : (
            <a href="/" className="logo flex items-center gap-3">
              <img src="/logo.png" alt="شعار الخلية" style={{ width: '45px', height: '45px', objectFit: 'contain' }} />
              <div className={`logo-text flex flex-col ${isAr ? 'text-right' : 'text-left'}`}>
                <span className="font-extrabold text-lg text-slate-900">{isAr ? "خلية الأعمال الإنسانية" : "Humanitarian Action Cell"}</span>
                <span className="text-xs text-slate-500">HUMANITARIAN ACTION CELL</span>
              </div>
            </a>
          )}

          {/* روابط التنقل */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" className="text-slate-700 hover:text-[#c9a84c] font-medium">
              {isAr ? "الرئيسية" : "Home"}
            </NavLink>
            <HashLink smooth to="/#about" className="text-slate-700 hover:text-[#c9a84c] font-medium">
              {isAr ? "من نحن" : "About Us"}
            </HashLink>
            <NavLink to="/projects" className="text-slate-700 hover:text-[#c9a84c] font-medium">
              {isAr ? "المشاريع" : "Projects"}
            </NavLink>
            <NavLink to="/programs" className="text-slate-700 hover:text-[#c9a84c] font-medium">
              {isAr ? "البرامج" : "Programs"}
            </NavLink>
            <NavLink to="/news" className="text-slate-700 hover:text-[#c9a84c] font-medium">
              {isAr ? "الأخبار والتقارير" : "News & Reports"}
            </NavLink>
          </nav>

          {/* أزرار اللغة والتبرع */}
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleLanguage}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition text-sm font-medium flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Globe className="w-4 h-4 text-slate-500" />
              <span>{isAr ? 'English' : 'العربية'}</span>
            </button>

            <NavLink to="/donate" className="bg-[#c9a84c] text-slate-900 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#e5c158] transition shadow-sm">
              <Heart className="w-4 h-4 fill-current" />
              {isAr ? "تبرّع الآن" : "Donate Now"}
            </NavLink>
          </div>
        </div>

        {/* الشريط الإخباري */}
        {tickerNews.length > 0 && (
          <div className="bg-slate-900 text-white py-1.5 px-4 text-xs overflow-hidden whitespace-nowrap border-t border-slate-200">
            <div className="inline-block animate-marquee">
              {tickerNews.map((item, index) => (
                <span key={index} className="mx-4">
                  {item.title} {index < tickerNews.length - 1 ? " | " : ""}
                </span>
              ))}
            </div>
          </div>
        )}
      </header>

      <div style={{ height: '110px' }}></div>
    </>
  );
}