import React, { useState, useEffect } from 'react';

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [particles, setParticles] = useState([]);
  
  // حالة التحكم بالعرض الانتقالي بين الصفحات (main = الرئيسية، reports = التقارير، stories = قصص إنسانية، news = النشرات والأخبار)
  const [currentView, setCurrentView] = useState('main');
  
  // حالات تخزين البيانات القادمة من السيرفر
  const [newsData, setNewsData] = useState([]);
  const [reportsData, setReportsData] = useState([]);
  const [featuredReport, setFeaturedReport] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [error, setError] = useState(null);

  // دالة لتنسيق التاريخ
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; 
      return date.toLocaleDateString('ar-YE', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  // جلب البيانات من السيرفر
  useEffect(() => {
    const API_BASE_URL = 'https://humanitarian-cell-backend.onrender.com';

    fetch(`${API_BASE_URL}/api/news`)
      .then((res) => {
        if (!res.ok) throw new Error('فشل في جلب بيانات الأخبار');
        return res.json();
      })
      .then((data) => {
        setNewsData(data);
        setLoadingNews(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoadingNews(false);
      });

    fetch(`${API_BASE_URL}/api/reports`) 
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
        setLoadingReports(false);
      });
  }, []);

  // توليد الجزيئات
  useEffect(() => {
    const generatedParticles = Array.from({ length: 20 }).map((_, index) => ({
      id: index,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${6 + Math.random() * 6}s`
    }));
    setParticles(generatedParticles);
  }, []);

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
        }

        .news-page-wrapper {
          font-family: 'Tajawal', sans-serif;
          background: var(--hac-white);
          color: var(--hac-text);
          overflow-x: hidden;
          line-height: 1.7;
          min-height: 100vh;
        }

        /* الهيرو العلوي */
        .hero {
          position: relative;
          padding: 4rem 2rem 5rem;
          background: linear-gradient(135deg, var(--hac-navy-dark) 0%, var(--hac-navy) 50%, var(--hac-navy-light) 100%);
          overflow: hidden;
          text-align: center;
        }
        .hero-particles {
          position: absolute;
          inset: 0;
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
          0%, 100% { opacity: 0; transform: translateY(50vh) scale(0); }
          10% { opacity: 0.6; }
          50% { opacity: 0.3; transform: translateY(-10vh) scale(1.2); }
          90% { opacity: 0.6; }
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 1000px;
          margin: 0 auto;
        }
        .hero-badge {
          display: inline-block;
          padding: 0.4rem 1.8rem;
          background: rgba(196, 163, 90, 0.15);
          border: 1px solid var(--hac-gold);
          border-radius: 50px;
          color: var(--hac-gold);
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 1.2rem;
        }
        .hero h1 {
          font-size: 2.8rem;
          font-weight: 900;
          color: white;
          margin-bottom: 1rem;
          line-height: 1.35;
        }
        .hero-subtitle {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.75);
          font-weight: 300;
          max-width: 800px;
          margin: 0 auto;
        }

        /* البطاقات الست الرئيسية */
        .portal-section {
          max-width: 1400px;
          margin: -2rem auto 0 auto;
          padding: 3rem 2rem 2rem 2rem;
          position: relative;
          z-index: 5;
        }
        .portal-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
          gap: 2rem;
          margin-bottom: 2.5rem;
          text-align: right;
        }
        .portal-card {
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid rgba(196, 163, 90, 0.2);
          display: flex;
          flex-direction: column;
          cursor: pointer;
        }
        .portal-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 18px 45px rgba(26, 42, 74, 0.15);
        }
        .portal-card-top {
          background: linear-gradient(135deg, var(--hac-navy-dark), var(--hac-navy));
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .portal-card-icon { font-size: 3.2rem; }
        .portal-card-body {
          padding: 1.8rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .portal-card-category {
          font-size: 0.75rem;
          color: var(--hac-gold-dark);
          font-weight: 700;
          margin-bottom: 0.4rem;
        }
        .portal-card-title {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--hac-navy);
          margin-bottom: 0.6rem;
        }
        .portal-card-desc {
          font-size: 0.85rem;
          color: var(--hac-text-light);
          margin-bottom: 1.5rem;
          line-height: 1.6;
          flex: 1;
        }
        .portal-card-link {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--hac-navy);
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }

        /* الشريط السفلي والزر العائد للرئيسية */
        .quick-nav-bar {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-top: 1.5rem;
          margin-bottom: 2rem;
        }
        .quick-nav-pill {
          background: white;
          border: 1px solid rgba(196, 163, 90, 0.3);
          padding: 0.6rem 1.4rem;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--hac-navy);
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 15px rgba(0,0,0,0.04);
        }
        .quick-nav-pill:hover, .quick-nav-pill.active {
          background: var(--hac-gold);
          color: var(--hac-navy-dark);
          border-color: var(--hac-gold);
        }
        
        .back-home-container {
          max-width: 1400px;
          margin: 2rem auto 0 auto;
          padding: 0 2rem;
        }

        /* الأقسام الداخلية المنفصلة */
        .section { max-width: 1400px; margin: 0 auto; padding: 3rem 2rem; }
        .section-header { text-align: center; margin-bottom: 3rem; }
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
        .section-title { font-size: 2.3rem; font-weight: 800; color: var(--hac-navy); margin-bottom: 1rem; }
        .section-desc { font-size: 1.05rem; color: var(--hac-text-light); max-width: 600px; margin: 0 auto; }

        /* تفاصيل التقارير */
        .reports-section { background: linear-gradient(180deg, var(--hac-cream) 0%, var(--hac-white) 100%); border-radius: 20px; }
        .featured-report {
          background: linear-gradient(135deg, var(--hac-navy) 0%, var(--hac-navy-light) 100%);
          border-radius: 24px;
          padding: 3rem;
          margin-bottom: 3rem;
          border: 1px solid rgba(196, 163, 90, 0.2);
          color: white;
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
        .featured-title { font-size: 1.8rem; font-weight: 800; margin-bottom: 1rem; }
        .featured-desc { color: rgba(255,255,255,0.75); font-size: 1rem; line-height: 1.7; margin-bottom: 2rem; max-width: 750px; }
        
        .reports-list { display: flex; flex-direction: column; gap: 1.2rem; }
        .report-card {
          display: flex; align-items: center; gap: 1.5rem;
          background: white;
          border-radius: 16px;
          padding: 1.5rem 2rem;
          box-shadow: var(--hac-shadow);
          border: 1px solid rgba(0,0,0,0.02);
        }
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

        .btn {
          padding: 0.6rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          border: none;
        }
        .btn-outline { background: transparent; color: var(--hac-navy); border: 1.5px solid var(--hac-border); }
        .btn-gold { background: var(--hac-gold); color: var(--hac-navy-dark); font-weight: 700; }
        .btn-ghost { background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); }
        
        .status-message { text-align: center; padding: 3rem; font-size: 1.1rem; color: var(--hac-text-light); }
      `}} />

      {/* ===== الهيرو العلوي الثابت في الواجهة ===== */}
      <div className="hero">
        <div className="hero-particles">
          {particles.map((p) => (
            <div key={p.id} className="particle" style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration }} />
          ))}
        </div>
        <div className="hero-content">
          <div className="hero-badge">المركز الإعلامي</div>
          <h1>الأخبار والنشرات والتقارير والقصص الإنسانية</h1>
          <p className="hero-subtitle">بوابة موحدة للمحتوى المؤسسي، تتيح لك الانتقال السريع والمستقل بين الأقسام والإصدارات الرسمية.</p>
        </div>
      </div>

      {/* زر العودة للرئيسية يظهر فقط عندما نكون داخل صفحة فرعية */}
      {currentView !== 'main' && (
        <div className="back-home-container">
          <button className="btn btn-outline" onClick={() => setCurrentView('main')}>
            ← العودة إلى واجهة المركز الإعلامي الرئيسية
          </button>
        </div>
      )}

      {/* ===== الشاشة الرئيسية (تظهر فقط إذا كان currentView === 'main') ===== */}
      {currentView === 'main' && (
        <div className="portal-section">
          <div className="portal-grid">
            
            {/* بطاقة قصص إنسانية */}
            <div className="portal-card" onClick={() => setCurrentView('stories')}>
              <div className="portal-card-top"><span className="portal-card-icon">📖</span></div>
              <div className="portal-card-body">
                <span className="portal-card-category">المركز الإعلامي</span>
                <h3 className="portal-card-title">قصص إنسانية</h3>
                <p className="portal-card-desc">قصص وتجارب إنسانية مؤثرة من الميدان</p>
                <span className="portal-card-link">استكشف القسم ←</span>
              </div>
            </div>

            {/* بطاقة التقارير (عند الضغط عليها تفتح صفحة التقارير المستقلة مثل الصورة الثانية) */}
            <div className="portal-card" onClick={() => setCurrentView('reports')}>
              <div className="portal-card-top"><span className="portal-card-icon">📊</span></div>
              <div className="portal-card-body">
                <span className="portal-card-category">المركز الإعلامي</span>
                <h3 className="portal-card-title">التقارير</h3>
                <p className="portal-card-desc">تقارير الأثر والشفافية والنداء الإنساني</p>
                <span className="portal-card-link">استكشف القسم ←</span>
              </div>
            </div>

            {/* بطاقة النشرات الإعلامية */}
            <div className="portal-card" onClick={() => setCurrentView('news')}>
              <div className="portal-card-top"><span className="portal-card-icon">📢</span></div>
              <div className="portal-card-body">
                <span className="portal-card-category">المركز الإعلامي</span>
                <h3 className="portal-card-title">النشرات الإعلامية</h3>
                <p className="portal-card-desc">واجهة نشر رسمية للبيانات والإعلانات</p>
                <span className="portal-card-link">استكشف القسم ←</span>
              </div>
            </div>

            {/* بطاقة المركز الصحفي */}
            <div className="portal-card" onClick={() => setCurrentView('news')}>
              <div className="portal-card-top"><span className="portal-card-icon">📰</span></div>
              <div className="portal-card-body">
                <span className="portal-card-category">المركز الإعلامي</span>
                <h3 className="portal-card-title">المركز الصحفي</h3>
                <p className="portal-card-desc">مصدر موحد للمواد الصحفية والإعلامية</p>
                <span className="portal-card-link">استكشف القسم ←</span>
              </div>
            </div>

            {/* بطاقة البيانات */}
            <div className="portal-card" onClick={() => setCurrentView('reports')}>
              <div className="portal-card-top"><span className="portal-card-icon">🗄️</span></div>
              <div className="portal-card-body">
                <span className="portal-card-category">المركز الإعلامي</span>
                <h3 className="portal-card-title">البيانات</h3>
                <p className="portal-card-desc">بيانات ومؤشرات قابلة للعرض بحسب الصلاحيات</p>
                <span className="portal-card-link">استكشف القسم ←</span>
              </div>
            </div>

            {/* بطاقة الوسائط */}
            <div className="portal-card" onClick={() => setCurrentView('news')}>
              <div className="portal-card-top"><span className="portal-card-icon">🖼️</span></div>
              <div className="portal-card-body">
                <span className="portal-card-category">المركز الإعلامي</span>
                <h3 className="portal-card-title">الوسائط</h3>
                <p className="portal-card-desc">صور وفيديوهات ومواد إعلامية للاستعراض</p>
                <span className="portal-card-link">استكشف القسم ←</span>
              </div>
            </div>

          </div>

          {/* شريط التنقل السفلي السريع */}
          <div className="quick-nav-bar">
            <button className="quick-nav-pill" onClick={() => setCurrentView('news')}><span>🖼️</span> الوسائط والمعرض</button>
            <button className="quick-nav-pill" onClick={() => setCurrentView('stories')}><span>📖</span> قصص إنسانية</button>
            <button className="quick-nav-pill" onClick={() => setCurrentView('reports')}><span>📊</span> التقارير</button>
            <button className="quick-nav-pill" onClick={() => setCurrentView('news')}><span>📢</span> النشرات الإعلامية</button>
          </div>
        </div>
      )}

      {/* ===== صفحة التقارير المستقلة (تظهر تماماً عند الضغط على التقارير مطابقة للصورة الثانية) ===== */}
      {currentView === 'reports' && (
        <section className="section reports-section">
          <div className="section-header">
            <span className="section-label">إصدارات رسمية</span>
            <h2 className="section-title">التقارير الدورية والدراسات</h2>
            <p className="section-desc">تقارير موثقة تبرز الإحصاءات العامة، والشفافية التشغيلية لكافة التدخلات الإنسانية.</p>
          </div>

          {loadingReports ? (
            <div className="status-message">جاري تحميل التقارير الرسمية...</div>
          ) : (
            <>
              {featuredReport && (
                <div className="featured-report">
                  <span className="featured-badge">⭐ التقرير السنوي الأحدث</span>
                  <h3 className="featured-title">{featuredReport.title}</h3>
                  <p className="featured-desc">{featuredReport.excerpt || featuredReport.summary}</p>
                  <div>
                    <a href={featuredReport.file_url || featuredReport.fileUrl} className="btn btn-gold" download>📥 تحميل التقرير (PDF)</a>
                    <a href={featuredReport.file_url || featuredReport.fileUrl} target="_blank" rel="noreferrer" className="btn btn-ghost">👁️ معاينة سريعة</a>
                  </div>
                </div>
              )}

              <div className="reports-list">
                {reportsData.map((report) => (
                  <div key={report.id} className="report-card">
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
      )}

      {/* ===== صفحة الأخبار والنشرات والقصص الإنسانية المستقلة ===== */}
      {(currentView === 'stories' || currentView === 'news') && (
        <section className="section">
          <div className="section-header">
            <span className="section-label">تغطية حية</span>
            <h2 className="section-title">{currentView === 'stories' ? 'قصص إنسانية من الميدان' : 'النشرات والأخبار الإعلامية'}</h2>
            <p className="section-desc">نوثق بالكلمة والصورة أثر المساعدات وتفاصيل المشاريع الإغاثية لحظة بلحظة.</p>
          </div>

          {loadingNews ? (
            <div className="status-message">جاري تحميل المحتوى...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2rem' }}>
              {newsData.map((news) => (
                <div key={news.id} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.03)' }}>
                  <div style={{ height: '220px', position: 'relative' }}>
                    <img src={news.image_url || news.image} alt={news.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '1.8rem' }}>
                    <div style={{ color: 'var(--hac-gold-dark)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.6rem' }}>🗓️ {formatDate(news.date_published || news.date)}</div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--hac-navy)', marginBottom: '0.8rem' }}>{news.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--hac-text-light)', lineHeight: 1.6 }}>{news.excerpt}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}