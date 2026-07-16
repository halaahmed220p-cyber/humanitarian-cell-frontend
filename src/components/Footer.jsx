import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subMessage, setSubMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('تم استلام رسالتك، شكراً لتواصلك معنا!');
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://humanitarian-cell-backend.onrender.com/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setSubMessage(data.message);
      if (response.ok) setEmail('');
    } catch (err) {
      setSubMessage('حدث خطأ في الاتصال بالسيرفر.');
    }
  };

  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          {/* قسم الشعار */}
          <div className="footer-brand">
            <img 
              src="logo.png" 
              alt="شعار الخلية" 
              style={{ width: '45px', height: '45px', objectFit: 'contain' }} 
            />
            <p>
              خلية إنسانية غير ربحية تعمل في اليمن، تسعى لتعزيز العمل الإغاثي والتنموي بالتنسيق مع الجهات المعنية.
            </p>
            <div className="social-links">
              <a href="https://www.facebook.com/share/1HMU5Kbwjd/"><i className="fab fa-facebook-f"></i></a>
              <a href="https://x.com/HACYemen"><i className="fab fa-x"></i></a>
              <a href="https://www.tiktok.com/@hacyemen?_r=1&_t=ZS-981UoaZEQWi"><i className="fab fa-tiktok"></i></a>
              <a href="https://youtube.com/@hacyemen?si=uFgBiiPCLq4B_4Lr"><i className="fab fa-youtube"></i></a>
              <a href="https://telegram.me/HACY_org"><i className="fab fa-telegram-plane"></i></a>
            </div>
          </div>

          {/* الروابط السريعة */}
          <div className="footer-column">
            <h4>روابط سريعة</h4>
            <ul>
              <li><Link to="/" onClick={() => window.scrollTo(0,0)}><i className="fas fa-chevron-left"></i> الرئيسية</Link></li>
              <li><HashLink smooth to="/#about"><i className="fas fa-chevron-left"></i> من نحن</HashLink></li>
              <li><Link to="/projects" onClick={() => window.scrollTo(0,0)}><i className="fas fa-chevron-left"></i> المشاريع</Link></li>
              <li><Link to="/news" onClick={() => window.scrollTo(0,0)}><i className="fas fa-chevron-left"></i> الأخبار والتقارير</Link></li>
            </ul>
          </div>

          {/* النشرة البريدية ونموذج التواصل */}
          <div className="footer-column">
            <h4>النشرة البريدية</h4>
            <form onSubmit={handleSubscribe} className="newsletter-form" style={{ marginBottom: '20px' }}>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="أدخل بريدك الإلكتروني" 
                required 
              />
              <button type="submit">اشترك</button>
              {subMessage && <p style={{ fontSize: '12px', marginTop: '5px' }}>{subMessage}</p>}
            </form>

            <h4>تواصل معنا</h4>
            <div className="footer-contact">
              <p><i className="fas fa-envelope"></i> info@hac-yemen.org</p>
              <p><i className="fas fa-phone-alt"></i> +967 737002777</p>
              <p><i className="fas fa-map-marker-alt"></i> تعز - اليمن</p>
            </div>
          </div>

          {/* نموذج التواصل السريع */}
          <div className="footer-column">
            <h4>نموذج التواصل السريع</h4>
            <form className="contact-form" onSubmit={handleSubmit}>
              <input type="text" placeholder="الاسم الكامل" required />
              <input type="email" placeholder="بريدك الإلكتروني" required />
              <textarea placeholder="رسالتك..." required></textarea>
              <button type="submit"><i className="fas fa-paper-plane"></i> إرسال</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>جميع الحقوق محفوظة © 2026 <span>خلية الأعمال الإنسانية</span> - HAC</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;