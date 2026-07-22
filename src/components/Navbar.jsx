import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { ArrowRight, Heart } from 'lucide-react';

export default function Navbar({ program }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState('');
  const [tickerNews, setTickerNews] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
    <header className="header fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200" id="header">
      <div className="header-inner max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* زر العودة أو الشعار */}
        {program ? (
          <button
            onClick={() => navigate('/programs')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-all duration-300 px-4 py-2 rounded-xl hover:bg-slate-100"
          >
            <ArrowRight className="w-5 h-5" />
            <span className="font-medium">العودة للبرامج</span>
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

        {/* الروابط العامة بلون داكن وواضح */}
        <nav>
          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''} flex items-center gap-6 list-none m-0 p-0`} id="navMenu">
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive && activeAnchor === '' ? "text-[#c9a84c] font-bold" : "text-slate-700 hover:text-[#c9a84c] transition-colors")} end onClick={() => setActiveAnchor('')}>
                الرئيسية
              </NavLink>
            </li>
            <li>
              <HashLink smooth to="/#about" className={activeAnchor === '#about' ? 'text-[#c9a84c] font-bold' : 'text-slate-700 hover:text-[#c9a84c] transition-colors'} onClick={() => { setActiveAnchor('#about'); setIsMenuOpen(false); }}>
                من نحن
              </HashLink>
            </li>
            <li>
              <NavLink to="/projects" className={({ isActive }) => (isActive && activeAnchor === '' ? "text-[#c9a84c] font-bold" : "text-slate-700 hover:text-[#c9a84c] transition-colors")} onClick={() => setActiveAnchor('')}>
                المشاريع
              </NavLink>
            </li>
            <li>
              <NavLink to="/programs" className={({ isActive }) => (isActive && activeAnchor === '' ? "text-[#c9a84c] font-bold" : "text-slate-700 hover:text-[#c9a84c] transition-colors")} onClick={() => setActiveAnchor('')}>
                البرامج
              </NavLink>
            </li>
            <li>
              <NavLink to="/news" className={({ isActive }) => (isActive && activeAnchor === '' ? "text-[#c9a84c] font-bold" : "text-slate-700 hover:text-[#c9a84c] transition-colors")} onClick={() => setActiveAnchor('')}>
                الأخبار والتقارير
              </NavLink>
            </li>
            <li>
              <a href="#footer" className={activeAnchor === '#footer' ? 'text-[#c9a84c] font-bold' : 'text-slate-700 hover:text-[#c9a84c] transition-colors'} onClick={handleContactClick}>
                تواصل معنا
              </a>
            </li>
            <li>
              <NavLink to="/donate" className="donate-btn bg-[#c9a84c] text-slate-900 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#e5c158] transition-all shadow-sm" onClick={() => { setActiveAnchor(''); setIsMenuOpen(false); }}>
                <Heart className="w-4 h-4 fill-current" />
                تبرّع الآن
              </NavLink>
            </li>
          </ul>
        </nav>

        <button className="mobile-toggle md:hidden text-slate-800 text-2xl" id="mobileToggle" onClick={toggleMenu}>
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