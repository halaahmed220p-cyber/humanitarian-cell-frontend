import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState('');
  const [tickerNews, setTickerNews] = useState([]);
  const [currentLang, setCurrentLang] = useState('ar');
  const location = useLocation();

  // التحقق مما إذا كانت الصفحة الحالية هي الصفحة الرئيسية
  const isHomePage = location.pathname === '/' || location.pathname === '';

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // جلب الأخبار العاجلة والتحقق من لغة المتصفح/الكوكيز
  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )googtrans=([^;]*)/);
    if (match) {
      const langValue = decodeURIComponent(match[1]);
      if (langValue.includes('/en')) {
        setCurrentLang('en');
      }
    }

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://humanitarian-cell-frontend.onrender.com';
    
    fetch(`${baseUrl}/api/news/ticker`)
      .then(res => res.json())
      .then(data => setTickerNews(data))
      .catch(err => console.error("Error fetching ticker news:", err));
  }, []);

  // دالة تبديل اللغة عبر جوجل
  const handleGoogleTranslate = () => {
    const targetLang = currentLang === 'ar' ? 'en' : 'ar';
    document.cookie = `googtrans=/ar/${targetLang}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=/ar/${targetLang}; path=/`;
    window.location.reload();
  };

  // تحديث الرابط النشط عند تغيير الصفحة أو الهاش
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
    <>
      {/* عنصر ترجمة جوجل المخفي الضروري لتشغيل الترجمة */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>

      <header className="header" id="header">
        <div className="header-inner">
          <a href="/" className="logo" onClick={() => setActiveAnchor('')}>
            <img src="/logo.png" alt="شعار الخلية" style={{ width: '45px', height: '45px', objectFit: 'contain' }} />
            <div className="logo-text">
              <span className="brand-ar">خلية الأعمال الإنسانية</span>
              <span className="brand-en">HUMANITARIAN ACTION CELL</span>
            </div>
          </a>

          <nav>
            <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`} id="navMenu">
              <li>
                <NavLink to="/" className={({ isActive }) => (isActive && activeAnchor === '' ? "active" : "")} end onClick={() => setActiveAnchor('')}>
                  الرئيسية
                </NavLink>
              </li>
              <li>
                <HashLink smooth to="/#about" className={activeAnchor === '#about' ? 'active' : ''} onClick={() => { setActiveAnchor('#about'); setIsMenuOpen(false); }}>
                  من نحن
                </HashLink>
              </li>
              <li>
                <NavLink to="/projects" className={({ isActive }) => (isActive && activeAnchor === '' ? "active" : "")} onClick={() => setActiveAnchor('')}>
                  المشاريع
                </NavLink>
              </li>
              <li>
                <NavLink to="/programs" className={({ isActive }) => (isActive && activeAnchor === '' ? "active" : "")} onClick={() => setActiveAnchor('')}>
                  البرامج
                </NavLink>
              </li>
              <li>
                <NavLink to="/news" className={({ isActive }) => (isActive && activeAnchor === '' ? "active" : "")} onClick={() => setActiveAnchor('')}>
                  الأخبار والتقارير
                </NavLink>
              </li>
              <li>
                <a href="#footer" className={activeAnchor === '#footer' ? 'active' : ''} onClick={handleContactClick}>
                  تواصل معنا
                </a>
              </li>

              {/* زر الترجمة: يظهر حصرياً إذا كنا في الصفحة الرئيسية */}
              {isHomePage && (
                <li>
                  <button 
                    onClick={handleGoogleTranslate}
                    className="translate-btn"
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#f8fafc',
                      color: '#1e293b',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '14sspx'
                    }}
                  >
                    <i className="fas fa-globe" style={{ color: '#c9a84c' }}></i>
                    <span>{currentLang === 'en' ? 'العربية' : 'English'}</span>
                  </button>
                </li>
              )}

              <li>
                <NavLink to="/donate" className="donate-btn" onClick={() => { setActiveAnchor(''); setIsMenuOpen(false); }}>
                  تبرّع الآن
                </NavLink>
              </li>
            </ul>
          </nav>

          <button className="mobile-toggle" id="mobileToggle" onClick={toggleMenu}>
            <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </button>
        </div>

        {/* الشريط الإخباري الديناميكي */}
        {tickerNews.length > 0 && (
          <div className="news-ticker">
            <div className="ticker-content">
              {tickerNews.map((item, index) => (
                <span key={index}>
                  {item.title} {index < tickerNews.length - 1 ? " | " : ""}
                </span>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;