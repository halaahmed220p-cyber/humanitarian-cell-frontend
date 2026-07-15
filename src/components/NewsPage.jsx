import React, { useState, useEffect } from 'react';

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [particles, setParticles] = useState([]);
  
  // حالات تخزين البيانات القادمة من قاعدة البيانات
  const [newsData, setNewsData] = useState([]);
  const [reportsData, setReportsData] = useState([]);
  const [featuredReport, setFeaturedReport] = useState(null);
  
  // حالة التحكم بالنافذة المنبثقة للخبر المفتوح
  const [selectedNews, setSelectedNews] = useState(null);
  
  // حالات التحميل والأخطاء
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [error, setError] = useState(null);

  // دالة ذكية لتنسيق التاريخ لصيغة عربية أنيقة ومقروءة
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; 
      
      return date.toLocaleDateString('ar-YE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // 1. جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    fetch('/api/news') 
      .then((res) => {
        if (!res.ok) throw new Error('فشل في جلب بيانات الأخبار');
        return res.json();
      })
      .then((data) => {
        setNewsData(data);
        setLoadingNews(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoadingNews(false);
      });

    fetch('/api/reports') 
      .then((res) => {
        if (!res.ok) throw new Error('فشل في جلب بيانات التقارير');
        return res.json();
      })
      .then((data) => {
        const featured = data.find(r => r.is_featured || r.featured) || data[0];
        const ordinaryReports = data.filter(r => r.id !== (featured?.id || null));
        
        setFeaturedReport(featured);
        setReportsData(ordinaryReports);
        setLoadingReports(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingReports(false);
      });
  }, []);

  // 2. توليد جزيئات الخلفية التفاعلية
  useEffect(() => {
    const generatedParticles = Array.from({ length: 25 }).map((_, index) => ({
      id: index,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${6 + Math.random() * 6}s`
    }));
    setParticles(generatedParticles);
  }, []);

  // 3. تشغيل حركات الظهور للـ Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((el) => observer.observe(el));

    return () => {
      fadeElements.forEach((el) => observer.unobserve(el));
    };
  }, [activeCategory, newsData, reportsData]);

  return (
    <div className="news-page-wrapper" dir="rtl">
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --hac-navy: #1a2a4a;
          --hac-navy-light: #2a3f6a;
          --hac-navy-dark: #0f1a2e;
          --hac-gold: #c4a35a;
          --hac-gold-light: #d4b76a;
          --hac-gold-dark: #a68b4a;
          --hac-white: #fafbfc;
          --hac-cream: #f5f0e8;
          --hac-text: #2c3e50;
          --hac-text-light: #6b7c93;
          --hac-border: rgba(196, 163, 90, 0.2);
          --hac-shadow: 0 8px 40px rgba(26, 42, 74, 0.12);
          --hac-shadow-hover: 0 16px 60px rgba(26, 42, 74, 0.2);
        }

        .news-page-wrapper {
          font-family: 'Tajawal', sans-serif;
          background: var(--hac-white);
          color: var(--hac-text);
          overflow-x: hidden;
          line-height: 1.7;
        }

        /* ===== قسم الهيرو التفاعلي ===== */
        .hero {
          position: relative;
          min-height: 75vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--hac-navy-dark) 0%, var(--hac-navy) 50%, var(--hac-navy-light) 100%);
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c4a35a' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.5;
        }
        .hero-particles {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .particle {
          position: absolute;
          width: 5px;
          height: 5px;
          background: var(--hac-gold);
          border-radius: 50%;
          opacity: 0;
          animation: float-particle 8s infinite ease-in-out;
        }
        @keyframes float-particle {
          0%, 100% { opacity: 0; transform: translateY(75vh) scale(0); }
          10% { opacity: 0.6; }
          50% { opacity: 0.3; transform: translateY(-10vh) scale(1.2); }
          90% { opacity: 0.6; }
        }
        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 2rem;
          max-width: 900px;
        }
        .hero-logo {
          width: 140px;
          height: 140px;
          margin: 0 auto 2rem;
          background: linear-gradient(135deg, var(--hac-gold), var(--hac-gold-light));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 60px rgba(196, 163, 90, 0.3);
          animation: logo-glow 3s ease-in-out infinite alternate;
        }
        @keyframes logo-glow {
          from { box-shadow: 0 0 50px rgba(196, 163, 90, 0.3); }
          to { box-shadow: 0 0 70px rgba(196, 163, 90, 0.5); }
        }
        .hero-logo svg { width: 80px; height: 80px; }
        .hero-badge {
          display: inline-block;
          padding: 0.5rem 2rem;
          background: rgba(196, 163, 90, 0.15);
          border: 1px solid var(--hac-gold);
          border-radius: 50px;
          color: var(--hac-gold);
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          backdrop-filter: blur(10px);
        }
        .hero h1 {
          font-size: 3.5rem;
          font-weight: 900;
          color: white;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        .hero h1 span { color: var(--hac-gold); }
        .hero-subtitle {
          font-size: 1.25rem;
          color: rgba(255,255,255,0.7);
          margin-bottom: 2rem;
          font-weight: 300;
        }

        /* ===== الهيكلة العامة للتصميم المنسق ===== */
        .section { max-width: 1400px; margin: 0 auto; padding: 5rem 2rem; }
        .section-header { text-align: center; margin-bottom: 4rem; }
        .section-label {
          display: inline-block;
          padding: 0.5rem 2rem;
          background: linear-gradient(135deg, rgba(196, 163, 90, 0.1), rgba(196, 163, 90, 0.2));
          border: 1px solid var(--hac-gold);
          border-radius: 50px;
          color: var(--hac-gold-dark);
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .section-title { font-size: 2.5rem; font-weight: 800; color: var(--hac-navy); margin-bottom: 1rem; }
        .section-desc { font-size: 1.1rem; color: var(--hac-text-light); max-width: 600px; margin: 0 auto; }

        /* ===== الفلاتر المخصصة ===== */
        .filters-bar { display: flex; align-items: center; justify-content: center; gap: 0.8rem; margin-bottom: 3rem; flex-wrap: wrap; }
        .filter-btn {
          padding: 0.6rem 1.8rem;
          border-radius: 50px;
          border: 1px solid var(--hac-border);
          background: white;
          color: var(--hac-text-light);
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .filter-btn:hover, .filter-btn.active {
          background: var(--hac-navy);
          color: white;
          border-color: var(--hac-navy);
          box-shadow: 0 4px 15px rgba(26, 42, 74, 0.2);
        }

        /* ===== شبكة كروت الأخبار ===== */
        .news-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 2rem; }
        .news-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: var(--hac-shadow);
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          cursor: pointer;
          border: 1px solid rgba(0,0,0,0.03);
          position: relative;
        }
        .news-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--hac-gold), var(--hac-gold-light));
          z-index: 2;
        }
        .news-card:hover { transform: translateY(-10px); box-shadow: var(--hac-shadow-hover); }
        
        .news-image {
          height: 240px;
          width: 100%;
          position: relative;
          overflow: hidden;
          background-color: var(--hac-navy-dark);
        }
        .news-image img { 
          width: 100%; 
          height: 100%; 
          object-fit: cover;
          transition: transform 0.5s ease; 
        }
        .news-card:hover .news-image img { transform: scale(1.08); }
        
        .news-category {
          position: absolute;
          top: 1rem; right: 1rem;
          padding: 0.4rem 1.1rem;
          background: rgba(196, 163, 90, 0.95);
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          border-radius: 30px;
          backdrop-filter: blur(5px);
          z-index: 2;
        }
        .news-content { padding: 1.8rem; }
        .news-date {
          display: flex; align-items: center; gap: 0.5rem;
          color: var(--hac-gold-dark); font-size: 0.8rem; font-weight: 600; margin-bottom: 0.8rem;
        }
        .news-title { font-size: 1.2rem; font-weight: 700; color: var(--hac-navy); margin-bottom: 0.8rem; line-height: 1.5; }
        .news-card:hover .news-title { color: var(--hac-gold-dark); }
        .news-excerpt { font-size: 0.9rem; color: var(--hac-text-light); line-height: 1.6; margin-bottom: 1.5rem; }
        .news-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 1rem; border-top: 1px solid rgba(0,0,0,0.05); }
        
        /* جعل زر التفاصيل يبدو كعنصر تفاعلي بالـ Pointer */
        .news-read-more { 
          display: flex; 
          align-items: center; 
          gap: 0.4rem; 
          color: var(--hac-navy); 
          font-weight: 700; 
          font-size: 0.85rem; 
          border: none;
          background: transparent;
          cursor: pointer;
          font-family: inherit;
        }
        .news-card:hover .news-read-more { color: var(--hac-gold-dark); }

        /* ===== نافذة التفاصيل المنبثقة (Modal) ===== */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 26, 46, 0.85);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          animation: modal-fade-in 0.3s ease-out;
        }
        @keyframes modal-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .modal-container {
          background: white;
          width: 100%;
          max-width: 850px;
          max-height: 90vh;
          border-radius: 24px;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          border: 1px solid var(--hac-border);
          position: relative;
          animation: modal-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes modal-slide-up {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .modal-close-btn {
          position: absolute;
          top: 1.2rem;
          left: 1.2rem;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.5rem;
          color: var(--hac-navy-dark);
          transition: all 0.2s;
          z-index: 10;
        }
        .modal-close-btn:hover {
          background: var(--hac-navy-dark);
          color: white;
          transform: rotate(90deg);
        }
        .modal-media-wrapper {
          width: 100%;
          height: 380px;
          background: black;
          position: relative;
        }
        .modal-media-wrapper img, .modal-media-wrapper video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .modal-body {
          padding: 2.5rem;
        }
        .modal-meta {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1.2rem;
        }
        .modal-category-badge {
          padding: 0.3rem 1.2rem;
          background: rgba(196, 163, 90, 0.15);
          color: var(--hac-gold-dark);
          border-radius: 30px;
          font-size: 0.8rem;
          font-weight: 700;
        }
        .modal-date {
          font-size: 0.85rem;
          color: var(--hac-text-light);
          font-weight: 600;
        }
        .modal-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--hac-navy);
          line-height: 1.4;
          margin-bottom: 1.5rem;
        }
        .modal-text-content {
          font-size: 1.05rem;
          color: var(--hac-text);
          line-height: 1.8;
          text-align: justify;
          white-space: pre-wrap; /* يحافظ على الفراغات وتوزيع الفقرات القادمة من قاعدة البيانات */
        }

        /* ===== قسم التقارير ===== */
        .reports-section { background: linear-gradient(180deg, var(--hac-cream) 0%, var(--hac-white) 100%); }
        .featured-report {
          background: linear-gradient(135deg, var(--hac-navy) 0%, var(--hac-navy-light) 100%);
          border-radius: 24px;
          padding: 3rem;
          margin-bottom: 3rem;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(196, 163, 90, 0.2);
        }
        .featured-badge {
          display: inline-block;
          padding: 0.4rem 1.2rem;
          background: var(--hac-gold);
          color: var(--hac-navy-dark);
          font-size: 0.8rem;
          font-weight: 800;
          border-radius: 30px;
          margin-bottom: 1.5rem;
        }
        .featured-title { font-size: 1.8rem; font-weight: 800; color: white; margin-bottom: 1rem; }
        .featured-desc { color: rgba(255,255,255,0.7); font-size: 1rem; line-height: 1.7; margin-bottom: 2rem; max-width: 750px; }
        
        .reports-list { display: flex; flex-direction: column; gap: 1.2rem; }
        .report-card {
          display: flex; align-items: center; gap: 1.5rem;
          background: white;
          border-radius: 16px;
          padding: 1.5rem 2rem;
          box-shadow: var(--hac-shadow);
          transition: all 0.3s ease;
          border: 1px solid rgba(0,0,0,0.02);
          position: relative;
        }
        .report-card::after {
          content: '';
          position: absolute;
          right: 0; top: 0; bottom: 0;
          width: 4px;
          background: var(--hac-gold);
          transform: scaleY(0);
          transition: transform 0.3s;
          border-radius: 0 16px 16px 0;
        }
        .report-card:hover { transform: translateX(-5px); }
        .report-card:hover::after { transform: scaleY(1); }
        .report-icon {
          width: 55px; height: 55px; min-width: 55px;
          background: linear-gradient(135deg, var(--hac-navy), var(--hac-navy-light));
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          color: var(--hac-gold); font-size: 1.4rem;
        }
        .report-info { flex: 1; }
        .report-title { font-size: 1.1rem; font-weight: 700; color: var(--hac-navy); margin-bottom: 0.4rem; }
        .report-meta { display: flex; align-items: center; gap: 1.5rem; color: var(--hac-text-light); font-size: 0.8rem; }
        
        /* رسائل الحالة */
        .status-message {
          text-align: center;
          padding: 3rem;
          font-size: 1.2rem;
          color: var(--hac-text-light);
        }

        .btn {
          padding: 0.6rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          border: none;
        }
        .btn-outline { background: transparent; color: var(--hac-navy); border: 1.5px solid var(--hac-border); }
        .btn-outline:hover { background: rgba(196, 163, 90, 0.05); border-color: var(--hac-gold); }
        .btn-gold { background: var(--hac-gold); color: var(--hac-navy-dark); font-weight: 700; }
        .btn-gold:hover { background: var(--hac-gold-light); }
        .btn-ghost { background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); }
        .btn-ghost:hover { background: rgba(255,255,255,0.2); }

        .fade-in { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .fade-in.visible { opacity: 1; transform: translateY(0); }

        @media (max-width: 768px) {
          .hero h1 { font-size: 2.2rem; }
          .news-grid { grid-template-columns: 1fr; }
          .report-card { flex-direction: column; text-align: center; padding: 1.5rem; }
          .modal-media-wrapper { height: 240px; }
          .modal-body { padding: 1.5rem; }
          .modal-title { font-size: 1.4rem; }
        }
      `}} />

      {/* ===== الهيرو البصري ===== */}
      <div className="hero">
        <div className="hero-particles">
          {particles.map((p) => (
            <div
              key={p.id}
              className="particle"
              style={{
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.duration
              }}
            />
          ))}
        </div>
        <div className="hero-content">
          <div className="hero-logo">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="10" y="65" fontFamily="serif" fontSize="45" fontWeight="bold" fill="#1a2a4a">H</text>
              <text x="40" y="65" fontFamily="serif" fontSize="45" fontWeight="300" fill="#1a2a4a">A</text>
              <circle cx="75" cy="48" r="15" stroke="#1a2a4a" strokeWidth="3" fill="none"/>
              <path d="M75 38 C75 38 71 44 71 48 C71 50 73 52 75 52 C77 52 79 50 79 48 C79 44 75 38 75 38Z" fill="#1a2a4a"/>
            </svg>
          </div>
          <div className="hero-badge">التوثيق والمستجدات</div>
          <h1>المركز <span>الإعلامي</span></h1>
          <p className="hero-subtitle">نافذتكم المباشرة على مشاريع الدعم، المساعدات، والتقارير الميدانية لخلية الأعمال الإنسانية</p>
        </div>
      </div>

      {/* ===== قسم الأخبار والمستجدات ===== */}
      <section className="section" id="news">
        <div className="section-header fade-in">
          <span className="section-label">تغطية حية</span>
          <h2 className="section-title">آخر مستجداتنا الميدانية</h2>
          <p className="section-desc">نوثق بالكلمة والصورة أثر المساعدات وتفاصيل المشاريع الإغاثية لحظة بلحظة.</p>
        </div>

        {/* فلاتر التصفية السريعة */}
        <div className="filters-bar fade-in">
          {['all', 'relief', 'medical', 'education'].map((cat) => (
            <button 
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`} 
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'all' && 'كل المستجدات'}
              {cat === 'relief' && 'إغاثة ومساعدات'}
              {cat === 'medical' && 'صحة ومياه'}
              {cat === 'education' && 'تعليم وتنمية'}
            </button>
          ))}
        </div>

        {/* شبكة كروت الأخبار */}
        {loadingNews ? (
          <div className="status-message">جاري تحميل مستجداتنا الميدانية...</div>
        ) : error ? (
          <div className="status-message" style={{ color: '#e74c3c' }}>حدث خطأ أثناء جلب البيانات: {error}</div>
        ) : (
          <div className="news-grid">
            {newsData
              .filter(item => activeCategory === 'all' || item.category === activeCategory)
              .map((news) => (
                <div key={news.id} className="news-card fade-in" onClick={() => setSelectedNews(news)}>
                  <div className="news-image">
                    <img src={news.image_url || news.image} alt={news.title} />
                    <span className="news-category">{news.category_name || news.categoryName}</span>
                  </div>
                  <div className="news-content">
                    <div className="news-date">🗓️ {formatDate(news.date_published || news.date)}</div>
                    <h3 className="news-title">{news.title}</h3>
                    <p className="news-excerpt">{news.excerpt}</p>
                    <div className="news-footer">
                      {/* تفعيل الـ onClick لفتح النافذة بـ State */}
                      <button className="news-read-more">التفاصيل الكاملة 👈</button>
                      <span style={{ color: 'var(--hac-text-light)', fontSize: '0.8rem' }}>قراءة: {news.read_time || news.readTime || '3 د'}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>

      {/* ===== النافذة التفاعلية للخبر (Modal) ===== */}
      {selectedNews && (
        <div className="modal-overlay" onClick={() => setSelectedNews(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedNews(null)}>×</button>
            
            {/* عرض الميديا: صورة أو فيديو تفاعلي */}
            <div className="modal-media-wrapper">
              {selectedNews.media_type === 'video' || (selectedNews.media_url && selectedNews.media_url.endsWith('.mp4')) ? (
                <video src={selectedNews.media_url} controls autoPlay muted playsInline />
              ) : (
                <img src={selectedNews.image_url || selectedNews.image} alt={selectedNews.title} />
              )}
            </div>

            <div className="modal-body">
              <div className="modal-meta">
                <span className="modal-category-badge">
                  {selectedNews.category_name || selectedNews.categoryName}
                </span>
                <span className="modal-date">
                  🗓️ {formatDate(selectedNews.date_published || selectedNews.date)}
                </span>
              </div>
              <h2 className="modal-title">{selectedNews.title}</h2>
              {/* عرض المحتوى الكامل بالتنسيق والمحافظة على المسافات */}
              <div className="modal-text-content">
                {selectedNews.full_content || selectedNews.description || selectedNews.excerpt}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== قسم التقارير والدراسات ===== */}
      <section className="section reports-section" id="reports">
        <div className="section-header fade-in">
          <span className="section-label">إصدارات رسمية</span>
          <h2 className="section-title">التقارير الدورية والدراسات</h2>
          <p className="section-desc">تقارير موثقة تبرز الإحصاءات العامة، والشفافية التشغيلية لكافة التدخلات الإنسانية.</p>
        </div>

        {/* التقرير المميز البارز */}
        {loadingReports ? (
          <div className="status-message">جاري تحميل التقارير الرسمية...</div>
        ) : (
          <>
            {featuredReport && (
              <div className="featured-report fade-in">
                <span className="featured-badge">⭐ التقرير السنوي الأحدث</span>
                <h3 className="featured-title">{featuredReport.title}</h3>
                <p className="featured-desc">{featuredReport.excerpt || featuredReport.summary}</p>
                <div>
                  <a href={featuredReport.file_url || featuredReport.fileUrl} className="btn btn-gold" download>📥 تحميل التقرير (PDF)</a>
                  <a href={featuredReport.file_url || featuredReport.fileUrl} target="_blank" rel="noreferrer" className="btn btn-ghost">👁️ معاينة سريعة</a>
                </div>
              </div>
            )}

            {/* قائمة بقية التقارير الدورية */}
            <div className="reports-list">
              {reportsData.map((report) => (
                <div key={report.id} className="report-card fade-in">
                  <div className="report-icon">📊</div>
                  <div className="report-info">
                    <h4 className="report-title">{report.title}</h4>
                    <div className="report-meta">
                      <span>📅 {formatDate(report.date_published || report.date)}</span> • 
                      <span>📂 PDF ({report.file_size || report.fileSize || 'غير معروف'})</span> • 
                      <span>⬇️ {report.downloads_count || report.downloadsCount || 0} عملية تحميل</span>
                    </div>
                  </div>
                  <div>
                    <a href={report.file_url || report.fileUrl} className="btn btn-outline" download>تحميل التقرير</a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}