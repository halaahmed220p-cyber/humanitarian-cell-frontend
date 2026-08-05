import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Bot, Send, Calendar, ArrowLeft, Paperclip } from 'lucide-react';

const HomePage = () => {
  const { t } = useTranslation();
  const [latestNews, setLatestNews] = useState([]);
  const [currentLang, setCurrentLang] = useState('ar');

  // حالات خاصة بالمساعد الذكي للشات والتلخيص وإرفاق الملفات
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'أهلاً بك! أنا مساعد الذكاء الاصطناعي، جاهز لتلخيص التقارير وإجابتك على أي سؤال بكل سلاسة ودقة.' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // التحقق من اللغة الحالية عبر الكوكيز الخاصة بـ Google Translate
    const match = document.cookie.match(/(?:^|; )googtrans=([^;]*)/);
    if (match) {
      const langValue = decodeURIComponent(match[1]);
      if (langValue.includes('/en')) {
        setCurrentLang('en');
      }
    }

    // جلب الأخبار من السيرفر
    fetch('https://humanitarian-cell-frontend.onrender.com/api/news/latest')
      .then(res => res.json())
      .then(data => {
        const topThree = Array.isArray(data) ? data.slice(0, 3) : []; 
        setLatestNews(topThree);
      })
      .catch(err => {
        console.error("Error fetching news:", err);
        setLatestNews([
          { id: 1, title: 'تقرير إنجاز مشاريع الإغاثة والتنمية للعام الحالي', description: 'تم بحمد الله استكمال المرحلة الأولى من توزيع المساعدات الإنسانية وتوفير الاحتياجات الأساسية.', date: '2026' }
        ]);
      });
  }, []);

  const handleGoogleTranslate = () => {
    const targetLang = currentLang === 'ar' ? 'en' : 'ar';
    document.cookie = `googtrans=/ar/${targetLang}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=/ar/${targetLang}; path=/`;
    window.location.reload();
  };

  const truncateText = (text, wordLimit = 15) => {
    if (!text) return '';
    const words = text.split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  // دالة التعامل مع اختيار الملف
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setChatMessages(prev => [...prev, { sender: 'user', text: `📎 تم إرفاق الملف: ${file.name}` }]);
    }
  };

  // دالة إرسال الرسالة والملف للسيرفر للحصول على رد جيميناي الحقيقي والمفصل
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim() && !selectedFile) return;

    const messageText = userInput;
    if (userInput.trim()) {
      setChatMessages(prev => [...prev, { sender: 'user', text: messageText }]);
    }
    setUserInput('');
    setIsLoading(true);

    const formData = new FormData();
    formData.append('message', messageText || "قم بتلخيص وتحليل هذا المستند أو الملف بدقة واحترافية.");
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    try {
      const response = await fetch('https://humanitarian-cell-frontend.onrender.com/api/ai-assistant', {
        method: 'POST',
        body: formData 
      });
      
      const data = await response.json();
      setSelectedFile(null); 
      setIsLoading(false);

      if (response.ok && data.response) {
        setChatMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
      } else {
        setChatMessages(prev => [...prev, { sender: 'bot', text: data.error || 'عذراً، لم يتمكن السيرفر من معالجة الرد.' }]);
      }
    } catch (err) {
      setSelectedFile(null);
      setIsLoading(false);
      setChatMessages(prev => [...prev, { sender: 'bot', text: 'خطأ في الاتصال بالسيرفر. تأكدي من تشغيل وتحديث الباك إند على Render.' }]);
    }
  };

  return (
    <div className="home-page" style={{ width: '100%', overflowX: 'hidden' }}>
      
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

      <div className="px-6 mt-4 text-center">
        <h1 className="text-3xl font-bold text-[#10355c]">{t('welcomeMessage') || "مرحباً بك في خلية الأعمال الإنسانية"}</h1>
      </div>
      
      {/* قسم الأخبار والمستجدات */}
      <section style={{ padding: '60px 20px', backgroundColor: '#fff' }} id="news">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ color: '#c9a84c', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase' }}>{t('ourNews') || "أخبارنا"}</span>
            <h2 style={{ fontSize: '28px', color: '#10355c', fontWeight: 'bold', marginTop: '5px' }}>{t('latestUpdates') || "آخر المستجدات"}</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}> 
            {latestNews.map(item => (
              <div key={item.id} style={{ background: '#f8fafc', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
                
                {item.image_url ? (
                  <div style={{ height: '180px', position: 'relative' }}>
                    <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ) : (
                  <div style={{ height: '120px', background: 'linear-gradient(135deg, #10355c, #1a4f8a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>
                    خلية الأعمال الإنسانية
                  </div>
                )}
                
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ fontSize: '18px', color: '#10355c', fontWeight: 'bold', marginBottom: '10px' }}>{item.title}</h3>
                  <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', flexGrow: 1, marginBottom: '15px' }}>{truncateText(item.description)}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                    <span style={{ fontSize: '13px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={14} /> {item.date || "2026"}
                    </span>
                    <Link to={`/news/${item.id}`} style={{ color: '#10355c', fontWeight: 'bold', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {t('details') || "التفاصيل"} <ArrowLeft size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link 
              to="/news" 
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
              {t('viewAllNews') || "عرض كافة الأخبار والتقارير"}
            </Link>
          </div>
        </div>
      </section>

      {/* ===== قسم المساعد الذكي (تلخيص التقارير وإرفاق الملفات) ===== */}
      <section style={{ padding: '60px 20px', background: '#f1f5f9', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '24px', color: '#10355c', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Bot className="w-6 h-6 text-[#c9a84c]" />
              المساعد الذكي <span style={{ color: '#c9a84c' }}>للتلخيص وإرفاق التقارير</span>
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '5px' }}>قم برفع ملفات التقارير (Excel / PDF) أو اكتب استفسارك ليقوم جيميناي بتحليلها وتلخيصها فوراً</p>
          </div>

          {/* صندوق المحادثة */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', height: '350px', overflowY: 'auto', border: '1px solid #cbd5e1', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {chatMessages.map((msg, index) => (
              <div key={index} style={{
                padding: '12px 16px',
                borderRadius: '10px',
                maxWidth: '85%',
                // تصحيح المحاذاة لتبدو رسائل المستخدم يسار/يمين بشكل متناسق
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'user' ? '#10355c' : '#f8fafc',
                color: msg.sender === 'user' ? '#fff' : '#1e293b',
                border: msg.sender === 'bot' ? '1px solid #e2e8f0' : 'none',
                fontSize: '14px',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap'
              }}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div style={{ padding: '12px 16px', borderRadius: '10px', maxWidth: '85%', alignSelf: 'flex-start', backgroundColor: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', fontSize: '14px' }}>
                ⏳ جاري قراءة الملف وتحليل محتواه بواسطة جيميناي بدقة...
              </div>
            )}
          </div>

          {/* نموذج إرسال الأسئلة وإرفاق الملفات */}
          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label style={{ cursor: 'pointer', background: '#fff', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="إرفاق تقرير أو ملف">
              <Paperclip size={18} color="#64748b" />
              <input type="file" onChange={handleFileChange} style={{ display: 'none' }} accept=".xlsx,.xls,.pdf,.txt,.csv" />
            </label>

            <input 
              type="text" 
              value={userInput} 
              onChange={(e) => setUserInput(e.target.value)} 
              placeholder={selectedFile ? `ملف مرفق: ${selectedFile.name} (اكتب سؤالك أو اضغط إرسال)` : "اكتب سؤالك أو اطلب تلخيص التقارير المرفقة..."} 
              style={{ flexGrow: 1, padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', background: '#fff' }}
            />
            
            <button type="submit" disabled={isLoading} style={{ padding: '12px 24px', backgroundColor: '#c9a84c', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: isLoading ? 0.7 : 1 }}>
              <Send size={16} /> إرسال
            </button>
          </form>

          {selectedFile && (
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#047857', fontWeight: 'bold' }}>
              ✓ الملف جاهز للإرسال والتحليل: {selectedFile.name}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default HomePage;