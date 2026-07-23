import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { ArrowRight, Heart, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // استيراد الترجمة

export default function Navbar({ program }) {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState('');
  const [tickerNews, setTickerNews] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // دالة تبديل اللغة وتحديث اتجاه الصفحة
  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://humanitarian-cell-frontend.onrender.com';
    
    fetch(`${baseUrl}/api/news/ticker`)
      .then(res => res.json())
      .then(data => setTickerNews(data))
      .catch(err => console.error("Error fetching ticker news:", err));
  }, []);

  useEffect(() => {
    if (location.hash) {
      setActiveAnchor(location.hash);
    } else {
      setActiveAnchor('');
    }
  }, [location]);

  const handleContactClick = (e) => {
    e.preventDefault();
    setActiveAnchor('#footer');
    setIsMenuOpen(false);
    window.history.pushState(null, '', `${location.pathname}#footer`);
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-[100] shadow-md border-b border-slate-200" 
      style={{ backgroundColor: '#ffffff', backdropFilter: 'none' }}
      id="header"
    >
      <div className="header-inner max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* زر العودة أو الشعار */}
        {program ? (
          <button
            onClick={() => navigate('/programs')}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-all duration-300 px-4 py-2 rounded-xl hover:bg-slate-100 cursor-pointer"
          >
            <ArrowRight className="w-5 h-5" />
            <span className="font-medium">{t('backToPrograms') || "العودة للبرامج"}</span>
          </button>
        ) : (
          <a href="/" className="logo flex items-center gap-3" onClick={() => setActiveAnchor('')}>
            <img src="/logo.png" alt="شعار الخلية" style={{ width: '45px', height: '45px', objectFit: 'contain' }} />
            <div className="logo-text flex flex-col">
              <span className="brand-ar font-extrabold text-lg text-slate-900">خلية الأعمال الإنسانية</span>
              <span className="brand-en text-xs text-slate-500">HUMANITARIAN ACTION CELL</span>
            </div>
          </a>
        )}

        {/* اسم البرنامج في المنتصف إن وجد */}
        {program && (
          <div className="flex items-center gap-3 text-slate-900">
            <span className="text-2xl">{program.icon}</span>
            <span className="text-xl font-extrabold" style={{ color: program.color }}>
              {program.name}
            </span>
          </div>
        )}

        {/* الروابط العامة بلون داكن وواضحة تماماً */}
        <nav>
          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''} flex items-center gap-6 list-none m-0 p-0`} id="navMenu">
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive && activeAnchor === '' ? "text-[#c9a84c] font-bold" : "text-slate-700 hover:text-[#c9a84c] transition-colors")} end onClick={() => setActiveAnchor('')}>
                {t('home') || "الرئيسية"}
              </NavLink>
            </li>
            <li>
              <HashLink smooth to="/#about" className={activeAnchor === '#about' ? 'text-[#c9a84c] font-bold' : 'text-slate-700 hover:text-[#c9a84c] transition-colors'} onClick={() => { setActiveAnchor('#about'); setIsMenuOpen(false); }}>
                {t('about') || "من نحن"}
              </HashLink>
            </li>
            <li>
              <NavLink to="/projects" className={({ isActive }) => (isActive && activeAnchor === '' ? "text-[#c9a84c] font-bold" : "text-slate-700 hover:text-[#c9a84c] transition-colors")} onClick={() => setActiveAnchor('')}>
                {t('projects') || "المشاريع"}
              </NavLink>
            </li>
            <li>
              <NavLink to="/programs" className={({ isActive }) => (isActive && activeAnchor === '' ? "text-[#c9a84c] font-bold" : "text-slate-700 hover:text-[#c9a84c] transition-colors")} onClick={() => setActiveAnchor('')}>
                {t('programs') || "البرامج"}
              </NavLink>
            </li>
            <li>
              <NavLink to="/news" className={({ isActive }) => (isActive && activeAnchor === '' ? "text-[#c9a84c] font-bold" : "text-slate-700 hover:text-[#c9a84c] transition-colors")} onClick={() => setActiveAnchor('')}>
                {t('newsAndReports') || "الأخبار والتقارير"}
              </NavLink>
            </li>
            <li>
              <a href="#footer" className={activeAnchor === '#footer' ? 'text-[#c9a84c] font-bold' : 'text-slate-700 hover:text-[#c9a84c] transition-colors'} onClick={handleContactClick}>
                {t('contactUs') || "تواصل معنا"}
              </a>
            </li>

            {/* أزرار الإجراءات: زر اللغة وزر التبرع */}
            <li className="flex items-center gap-3">
              <button 
                onClick={toggleLanguage}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition text-sm font-medium flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="تغيير اللغة / Change Language"
              >
                <Globe className="w-4 h-4 text-slate-500" />
                <span>{i18n.language === 'ar' ? 'English' : 'العربية'}</span>
              </button>

              <NavLink to="/donate" className="donate-btn bg-[#c9a84c] text-slate-900 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#e5c158] transition-all shadow-sm" onClick={() => { setActiveAnchor(''); setIsMenuOpen(false); }}>
                <Heart className="w-4 h-4 fill-current" />
                {t('donateNow') || "تبرّع الآن"}
              </NavLink>
            </li>
          </ul>
        </nav>

        <button className="mobile-toggle md:hidden text-slate-800 text-2xl cursor-pointer" id="mobileToggle" onClick={toggleMenu}>
          <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </button>
      </div>

      {/* الشريط الإخباري الديناميكي */}
      {tickerNews.length > 0 && (
        <div className="news-ticker bg-slate-900 text-white py-1.5 px-4 text-xs overflow-hidden whitespace-nowrap border-t border-slate-200">
          <div className="ticker-content inline-block animate-marquee">
            {tickerNews.map((item, index) => (
              <span key={index} className="mx-4">
                {item.title} {index < tickerNews.length - 1 ? " | " : ""}
              </span>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}