import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState(''); 
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // تحديث الرابط النشط عند تغيير الصفحة أو الهاش في الرابط
  useEffect(() => {
    if (location.hash) {
      setActiveAnchor(location.hash);
    } else {
      setActiveAnchor('');
    }
  }, [location]);

  // دالة ذكية للتمرير إلى الفوتر في نفس الصفحة الحالية فوراً دون الانتقال للرئيسية
  const handleContactClick = (e) => {
    e.preventDefault();
    setActiveAnchor('#footer');
    setIsMenuOpen(false);

    // تحديث الهاش في الرابط الحالي دون إعادة تحميل الصفحة
    window.history.pushState(null, '', `${location.pathname}#footer`);

    // التمرير مباشرة لأسفل الصفحة الحالية
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <header className="header" id="header">
      <div className="header-inner">
        <a href="/" className="logo" onClick={() => setActiveAnchor('')}>
          <img src="logo.png" alt="شعار الخلية" style={{ width: '45px', height: '45px', objectFit: 'contain' }} />
          <div className="logo-text">
            <span className="brand-ar">خلية الأعمال الإنسانية</span>
            <span className="brand-en">HUMANITARIAN ACTION CELL</span>
          </div>
        </a>

        <nav>
          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`} id="navMenu">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => (isActive && activeAnchor === '' ? "active" : "")} 
                end
                onClick={() => setActiveAnchor('')}
              >
                الرئيسية
              </NavLink>
            </li>
            
            {/* من نحن: تقود للصفحة الرئيسية ثم جزء من نحن كالمعتاد */}
            <li>
              <HashLink 
                smooth
                to="/#about" 
                className={activeAnchor === '#about' ? 'active' : ''}
                onClick={() => {
                  setActiveAnchor('#about');
                  setIsMenuOpen(false);
                }}
              >
                من نحن
              </HashLink>
            </li>

            <li>
              <NavLink 
                to="/projects" 
                className={({ isActive }) => (isActive && activeAnchor === '' ? "active" : "")}
                onClick={() => setActiveAnchor('')}
              >
                المشاريع
              </NavLink>
            </li>

            <li>
              <NavLink 
                to="/news" 
                className={({ isActive }) => (isActive && activeAnchor === '' ? "active" : "")}
                onClick={() => setActiveAnchor('')}
              >
                الأخبار والتقارير
              </NavLink>
            </li>

            {/* تواصل معنا: تهبط لأسفل الصفحة المفتوحة حالياً مباشرة دون الخروج منها! */}
            <li>
              <a 
                href="#footer" 
                className={activeAnchor === '#footer' ? 'active' : ''}
                onClick={handleContactClick}
              >
                تواصل معنا
              </a>
            </li>

            {/* زر تبرع الآن */}
            <li>
              <NavLink 
                to="/donate" 
                className="donate-btn"
                onClick={() => {
                  setActiveAnchor('');
                  setIsMenuOpen(false);
                }}
              >
                تبرّع الآن
              </NavLink>
            </li>
          </ul>
        </nav>

        <button className="mobile-toggle" id="mobileToggle" onClick={toggleMenu}>
          <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </button>
      </div>
    </header>
  );
};

export default Header;