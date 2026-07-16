import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState('');
  const [tickerNews, setTickerNews] = useState([]); // حالة جديدة لجلب أخبار الشريط
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // جلب الأخبار العاجلة من السيرفر عند تحميل الصفحة
  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://humanitarian-cell-frontend.onrender.com';
    
    fetch(`${baseUrl}/api/news/ticker`)
      .then(res => res.json())
      .then(data => setTickerNews(data))
      .catch(err => console.error("Error fetching ticker news:", err));
  }, []);

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
              <NavLink to="/news" className={({ isActive }) => (isActive && activeAnchor === '' ? "active" : "")} onClick={() => setActiveAnchor('')}>
                الأخبار والتقارير
              </NavLink>
            </li>
            <li>
              <a href="#footer" className={activeAnchor === '#footer' ? 'active' : ''} onClick={handleContactClick}>
                تواصل معنا
              </a>
            </li>
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
  );
};

export default Header;