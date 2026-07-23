import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // استيراد الترجمة

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const [latestNews, setLatestNews] = useState([]);

  useEffect(() => {
    // استخدام رابط السيرفر المباشر على Render بدلاً من localhost
    fetch('https://humanitarian-cell-frontend.onrender.com/api/news/latest')
      .then(res => res.json())
      .then(data => {
        console.log("البيانات الأصلية من السيرفر:", data);
        const topThree = Array.isArray(data) ? data.slice(0, 3) : []; 
        setLatestNews(topThree);
      })
      .catch(err => console.error("Error:", err));
  }, []);

  // دالة ذكية لاختصار نص الخبر
  const truncateText = (text, wordLimit = 18) => {
    if (!text) return '';
    const words = text.split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  return (
    <div className="home-page">
      <h1>{t('welcomeMessage') || "مرحباً بك في خلية الأعمال الإنسانية"}</h1>
      
      {/* قسم المشاريع */}
      <div className="projects-section">
        {/* كود عرض المشاريع */}
      </div>
      <Link to="/projects">
        <button>{t('moreProjects') || "المزيد من المشاريع"}</button>
      </Link>

      {/* قسم الأخبار في الصفحة الرئيسية */}
      <section className="projects" id="news">
        <div className="container">
          <div className="section-header">
            <span className="section-label">{t('ourNews') || "أخبارنا"}</span>
            <h2 className="section-title">{t('latestUpdates') || "آخر المستجدات"}</h2>
          </div>

          <div className="projects-grid"> 
            {latestNews.slice(0, 3).map(item => (
              <div key={item.id} className="project-card">
                
                {item.image_url && (
                  <div className="project-image">
                    <span className="project-badge">{t('newBadge') || "جديد"}</span>
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                )}
                
                <div className="project-content">
                  <h3>{item.title}</h3>
                  
                  <p>{truncateText(item.description)}</p>
                  
                  <div className="project-meta">
                    <span className="project-location">
                      <i className="fas fa-calendar-alt"></i> {item.date || "2026"}
                    </span>
                    
                    <Link to={`/news/${item.id}`} className="project-btn">
                      {t('details') || "التفاصيل"} <i className="fas fa-arrow-left"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* الزر الرئيسي لعرض كافة الأخبار والتقارير */}
          <div className="view-all-container" style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link 
              to="/news" 
              className="view-all-btn" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{
                display: 'inline-block',
                padding: '12px 30px',
                backgroundColor: '#10355c',
                color: '#fff',
                borderRadius: '25px',
                textDecoration: 'none',
                fontWeight: 'bold',
                boxShadow: '0 4px 10px rgba(16, 53, 92, 0.2)'
              }}
            >
              {t('viewAllNews') || "عرض كافة الأخبار والتقارير"} <i className="fas fa-long-arrow-alt-left" style={{ marginRight: '8px' }}></i>
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
};

export default HomePage;