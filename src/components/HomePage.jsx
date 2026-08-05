import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Bot, Send } from 'lucide-react'; // إضافة أيقونات الشات

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const [latestNews, setLatestNews] = useState([]);
  const [currentLang, setCurrentLang] = useState('ar');

  // حالات خاصة بالمساعد الذكي للشات والتلخيص
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'أهلاً بك! أنا مساعد الذكاء الاصطناعي، جاهز لتلخيص التقارير والرد على استفساراتك حول المنصة.' }
  ]);
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    // التحقق من اللغة الحالية عبر الكوكيز الخاصة بـ Google Translate
    const match = document.cookie.match(/(?:^|; )googtrans=([^;]*)/);
    if (match) {
      const langValue = decodeURIComponent(match[1]);
      if (langValue.includes('/en')) {
        setCurrentLang('en');
      }
    }

    // استخدام رابط السيرفر المباشر على Render
    fetch('https://humanitarian-cell-frontend.onrender.com/api/news/latest')
      .then(res => res.json())
      .then(data => {
        const topThree = Array.isArray(data) ? data.slice(0, 3) : []; 
        setLatestNews(topThree);
      })
      .catch(err => console.error("Error:", err));
  }, []);

  // دالة تغيير اللغة عبر Google Translate
  const handleGoogleTranslate = () => {
    const targetLang = currentLang === 'ar' ? 'en' : 'ar';
    document.cookie = `googtrans=/ar/${targetLang}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=/ar/${targetLang}; path=/`;
    window.location.reload();
  };

  const truncateText = (text, wordLimit = 18) => {
    if (!text) return '';
    const words = text.split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  // دالة إرسال السؤال أو طلب التلخيص للمساعد الذكي والاتصال بالسيرفر الفعلي
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMsg = userInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: newMsg }]);
    setUserInput('');

    try {
      const response = await fetch('https://humanitarian-cell-frontend.onrender.com/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMsg })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setChatMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
      } else {
        setChatMessages(prev => [...prev, { sender: 'bot', text: 'عذراً، حدث خطأ في معالجة الطلب من الخادم.' }]);
      }
    } catch (err) {
      console.error("Error:", err);
      setChatMessages(prev => [...prev, { sender: 'bot', text: 'عذراً، تعذر الاتصال بالمساعد الذكي تأكد من تشغيل الخادم.' }]);
    }
  };

  return (
    <div className="home-page">
      
      {/* عنصر ترجمة جوجل المخفي */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>

      {/* زر الترجمة */}
      <div className="max-w-[1400px] mx-auto px-6 pt-4 flex justify-end">
        <button 
          onClick={handleGoogleTranslate}
          className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 transition text-sm font-bold flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Globe className="w-4 h-4 text-[#c9a84c]" />
          <span>{currentLang === 'en' ? 'العربية (Arabic)' : 'English'}</span>
        </button>
      </div>

      <h1 className="px-6 mt-4">{t('welcomeMessage') || "مرحباً بك في خلية الأعمال الإنسانية"}</h1>
      
      {/* قسم المشاريع */}
      <div className="projects-section">
        {/* كود عرض المشاريع */}
      </div>
      <Link to="/projects">
        <button>{t('moreProjects') || "المزيد من المشاريع"}</button>
      </Link>

      {/* قسم الأخبار */}
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

          {/* زر عرض كافة الأخبار */}
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

      {/* ===== قسم المساعد الذكي (تلخيص التقارير والرد على الأسئلة) ===== */}
      <section className="ai-assistant-section" style={{ padding: '60px 20px', background: '#f7f9fc' }}>
        <div className="ai-assistant-container">
          <div className="section-header" style={{ marginBottom: '20px', textAlign: 'center' }}>
            <h3 className="section-title" style={{ fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Bot className="w-6 h-6 text-[#c9a84c]" />
              المساعد الذكي <span>للتلخيص والإجابة</span>
            </h3>
            <p style={{ color: '#4a5568', fontSize: '14px' }}>اسأل عن التقارير أو اطلب تلخيصاً فورياً للبيانات البرمجية والإدارية</p>
          </div>

          {/* صندوق المحادثة */}
          <div className="ai-chat-box">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`ai-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>

          {/* نموذج إرسال الأسئلة */}
          <form onSubmit={handleSendMessage} className="ai-input-group">
            <input 
              type="text" 
              value={userInput} 
              onChange={(e) => setUserInput(e.target.value)} 
              placeholder="اكتب سؤالك هنا أو اطلب تلخيص التقارير..." 
            />
            <button type="submit">
              <Send className="w-4 h-4" /> إرسال
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default HomePage;