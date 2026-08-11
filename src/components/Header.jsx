import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState('');
  const [tickerNews, setTickerNews] = useState([]);
  const [currentLang, setCurrentLang] = useState('ar');
  const location = useLocation();

  const isHomePage = location.pathname === '/' || location.pathname === '';
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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

  const handleGoogleTranslate = () => {
    const targetLang = currentLang === 'ar' ? 'en' : 'ar';
    document.cookie = `googtrans=/ar/${targetLang}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=/ar/${targetLang}; path=/`;
    window.location.reload();
  };

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
      <div id="google_translate_element" style={{ display: 'none' }}></div>

      <header className="header" id="header" style={{ background: '#0b1d3a', borderBottom: '1px solid rgba(201, 168, 76, 0.3)', position: 'sticky', top: 0, zIndex: 1000, direction: 'rtl' }}>
        <div className="header-inner" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px' }}>
          
          {/* الشعار */}
          <Link to="/" className="logo" onClick={() => setActiveAnchor('')} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.png" alt="شعار الخلية" style={{ width: '45px', height: '45px', objectFit: 'contain' }} />
            <div className="logo-text" style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="brand-ar" style={{ fontSize: '15px', color: '#fff', fontWeight: 'bold' }}>خلية الأعمال الإنسانية</span>
              <span className="brand-en" style={{ fontSize: '10px', color: '#c9a84c', letterSpacing: '0.5px' }}>HUMANITARIAN ACTION CELL</span>
            </div>
          </Link>

          {/* القائمة الرئيسية بالترتيب الاستراتيجي الجديد */}
          <nav>
            <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`} id="navMenu" style={{ display: 'flex', alignItems: 'center', gap: '20px', listStyle: 'none', margin: 0, padding: 0 }}>
              
              <li>
                <NavLink to="/" className={({ isActive }) => (isActive && activeAnchor === '' ? "active" : "")} end onClick={() => setActiveAnchor('')} style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                  الرئيسية
                </NavLink>
              </li>

              <li>
                <HashLink smooth to="/#about" className={activeAnchor === '#about' ? 'active' : ''} onClick={() => { setActiveAnchor('#about'); setIsMenuOpen(false); }} style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                  من نحن
                </HashLink>
              </li>

              {/* تبويب البرامج الاستراتيجية أولاً */}
              <li>
                <NavLink to="/programs" className={({ isActive }) => (isActive && activeAnchor === '' ? "active" : "")} onClick={() => setActiveAnchor('')} style={{ color: '#c9a84c', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
                  البرامج
                </NavLink>
              </li>

              {/* تبويب محفظة المشاريع تليها مباشرة */}
              <li>
                <NavLink to="/projects" className={({ isActive }) => (isActive && activeAnchor === '' ? "active" : "")} onClick={() => setActiveAnchor('')} style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                  محفظة المشاريع
                </NavLink>
              </li>

              <li>
                <NavLink to="/news" className={({ isActive }) => (isActive && activeAnchor === '' ? "active" : "")} onClick={() => setActiveAnchor('')} style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                  الأخبار والتقارير
                </NavLink>
              </li>

              <li>
                <a href="#footer" className={activeAnchor === '#footer' ? 'active' : ''} onClick={handleContactClick} style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                  تواصل معنا
                </a>
              </li>

              {/* بوابة الشركاء (VIP) */}
              <li className="nav-item">
                <Link className="nav-link" to="/partners" style={{ fontWeight: 'bold', color: '#c9a84c', textDecoration: 'none', fontSize: '14px', border: '1px solid rgba(201, 168, 76, 0.4)', padding: '6px 12px', borderRadius: '8px', background: 'rgba(201, 168, 76, 0.1)' }}>
                  بوابة الشركاء
                </Link>
              </li>

              {/* زر الترجمة */}
              {isHomePage && (
                <li>
                  <button 
                    onClick={handleGoogleTranslate}
                    className="translate-btn"
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px'
                    }}
                  >
                    <i className="fas fa-globe" style={{ color: '#c9a84c' }}></i>
                    <span>{currentLang === 'en' ? 'العربية' : 'English'}</span>
                  </button>
                </li>
              )}

              {/* زر التبرع الفخم */}
              <li>
                <NavLink to="/donate" className="donate-btn" onClick={() => { setActiveAnchor(''); setIsMenuOpen(false); }} style={{ background: '#c9a84c', color: '#0b1d3a', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 12px rgba(201, 168, 76, 0.3)' }}>
                  تبرّع الآن
                </NavLink>
              </li>
            </ul>
          </nav>

          <button className="mobile-toggle" id="mobileToggle" onClick={toggleMenu} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '22px', cursor: 'pointer', display: 'none' }}>
            <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </button>
        </div>

        {/* الشريط الإخباري الديناميكي */}
        {tickerNews.length > 0 && (
          <div className="news-ticker" style={{ background: 'rgba(0,0,0,0.2)', padding: '6px 0', overflow: 'hidden', whiteSpace: 'nowrap', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="ticker-content" style={{ display: 'inline-block', animation: 'ticker 25s linear infinite', color: '#cbd5e1', fontSize: '13px' }}>
              {tickerNews.map((item, index) => (
                <span key={index} style={{ margin: '0 25px' }}>
                  <span style={{ color: '#c9a84c' }}>▪</span> {item.title}
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