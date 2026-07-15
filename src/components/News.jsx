import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function News() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/news')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        // التعديل الأول: نأخذ أول 3 أخبار فقط عند حفظ البيانات في الـ State
        const topThreeNews = Array.isArray(data) ? data.slice(0, 3) : [];
        setNews(topThreeNews);
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  // دالة ذكية لاختصار النص لضمان تناسق شكل كروت الأخبار بالصفحة
  const truncateText = (text, wordLimit = 25) => {
    if (!text) return '';
    const words = text.split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  if (news.length === 0) {
    return <p style={{ textAlign: 'center', padding: '40px', fontSize: '1.2rem' }}>جاري تحميل الأخبار...</p>;
  }

  return (
    <div className="news-page container" style={{ paddingBottom: '60px' }}>
      <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>آخر المستجدات</h2>
      
      <div className="projects-grid">
        {/* التعديل الثاني والأقوى: عمل slice هنا أيضاً للتأكيد الحاسم على عرض 3 عناصر فقط */}
        {news.slice(0, 3).map(item => (
          <div key={item.id} className="project-card">
            
            {/* عرض الصورة فقط إذا كانت متوفرة */}
            {item.image_url && (
              <div className="project-image">
                <span className="project-badge">جديد</span>
                <img 
                  src={item.image_url} 
                  alt={item.title} 
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                />
              </div>
            )}
            
            <div className="project-content">
              <h3>{item.title}</h3>
              {/* قمنا باختصار النص هنا أيضاً لتصميم أكثر أناقة وتناسقاً */}
              <p>{truncateText(item.description)}</p>
              
             {/* ابحثي عن هذا الجزء في أسفل الكارت داخل ملف News.jsx وعدلي الـ Link كالتالي: */}
<div className="project-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
  
  {/* عرض التاريخ */}
  <span className="project-location">
    <i className="fas fa-calendar-alt"></i> {item.date ? item.date.split('T')[0] : "2026"}
  </span>
  
  {/* التعديل هنا: غيرنا المسار ليوجه إلى /news مباشرة لفتح صفحة الأخبار الكاملة */}
  <Link 
    to="/news" 
    className="project-btn" 
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    style={{ textDecoration: 'none', fontWeight: 'bold' }}
  >
    التفاصيل <i className="fas fa-arrow-left"></i>
  </Link>

</div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}