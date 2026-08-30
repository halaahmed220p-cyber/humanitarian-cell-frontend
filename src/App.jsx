import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Stats from './components/Stats';
import ProjectsPage from './components/ProjectsPage';
import Projects from './components/Projects';
import News from './components/News';
import Footer from './components/Footer';
import NewsPage from './components/NewsPage';
import Donation from './components/Donation'; 
import ProgramsPage from './components/ProgramsPage';
import ProgramDetail from './components/ProgramDetail';
import PartnersPortal from './components/PartnersPortal';
import { programsData } from './data/programsData';
import FAQ from './pages/FAQ';

import ScrollToTop from './components/ScrollToTop'; 
import ReportsAndFeedback from './components/ReportsAndFeedback'; // تأكدي من مسار الملف
import { Bot, Send, Paperclip, X, Sparkles } from 'lucide-react';
import './App.css';

// مكون المساعد الذكي العائم مع وعي كامل بتفاصيل المنصة
function FloatingAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  
  // معلومات وبيانات المنصة ليكون المساعد ملماً بكل شيء داخله
const platformContext = `
معلومات أساسية عن المنصة (خلية الأعمال الإنسانية):
- هي منظمة إنسانية غير ربحية تعمل في اليمن، تسعى لتعزيز العمل الإغاثي والتنموي بالتنسيق مع الجهات المعنية.
- الشعار: نعمل من أجل إنسان يستحق الحياة الكريمة.
- الأقسام والخدمات في الموقع:
  1. الرئيسية: تعرض نبذة عن المنظمة، الإحصائيات (مثل أكثر من 50,000 مستفيد و120+ مشروع)، والمشاريع والأخبار العاجلة.
  2. من نحن: التعريف برسالة الرؤية وأهداف المنظمة الإنسانية.
  3. البرامج: البرامج الإنسانية والتنموية المختلفة التي تقدمها الخلية.
  4. محفظة المشاريع: استعراض كافة المشاريع الإغاثية والتنموية المنفذة.
  5. الأخبار والتقارير: آخر مستجدات وأخبار العمل الإنساني والتقارير الدورية.
  6. الآراء والبلاغات: قسم مخصص لاستقبال بلاغات المواطنين، الشكاوى الإنسانية والميدانية، والمقترحات التطويرية. (ملاحظة للمساعد: يتطلب تقديم البلاغ أو الشكوى عبر هذا القسم تحديد الموقع الجغرافي GPS إجبارياً لضمان الاستجابة الميدانية السريعة).
  7. تواصل معنا: قنوات الاتصال بالمنظمة.
  8. بوابة الشركاء: مخصصة للشركاء والجهات الداعمة.
  9. تبرع الآن: صفحة مخصصة للمساهمة ودعم المشاريع الخيرية والإنسانية.
`;

  const [chatMessages, setChatMessages] = useState([
    { 
      sender: 'bot', 
      text: 'أهلاً بك! أنا المساعد الذكي لـ "خلية الأعمال الإنسانية". يمكنني إجابتك عن أي شيء يخص المنصة، مشاريعنا، أهدافنا، أو مساعدتك في تلخيص التقارير والمستندات المرفقة فوراً!' 
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setChatMessages(prev => [...prev, { sender: 'user', text: `📎 تم إرفاق الملف: ${file.name}` }]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim() && !selectedFile) return;

    const messageText = userInput;
    if (userInput.trim()) {
      setChatMessages(prev => [...prev, { sender: 'user', text: messageText }]);
    }
    setUserInput('');
    setIsLoading(true);

    // دمج سؤال المستخدم مع معلومات المنصة لضمان إجابة دقيقة وشاملة
    const enhancedMessage = `
بناءً على معلومات المنصة التالية:
${platformContext}

سؤال المستخدم أو طلبه هو: "${messageText || 'قم بتحليل وتلخيص الملف المرفق مع مراعاة طبيعة عمل المنصة.'}"
`;

    const formData = new FormData();
    formData.append('message', enhancedMessage);
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    try {
      const response = await fetch('https://humanitarian-cell-frontend.onrender.com/api/ai-assistant', {
        method: 'POST',
        mode: 'cors',
        body: formData 
      });
      
      const data = await response.json();
      setSelectedFile(null);
      setIsLoading(false);

      if (data && data.response) {
        setChatMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
      } else {
        setChatMessages(prev => [...prev, { sender: 'bot', text: data.error || 'عذراً، لم يتم العثور على حقل الرد في البيانات المسترجعة.' }]);
      }
    } catch (err) {
      setSelectedFile(null);
      setIsLoading(false);
      setChatMessages(prev => [...prev, { sender: 'bot', text: '⚠️ حدث خطأ في الاتصال بالسيرفر أو أن رابط الـ Backend لا يستجيب.' }]);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '25px', left: '25px', zIndex: 9999, fontFamily: 'Cairo, sans-serif' }} dir="rtl">
      
      {/* نافذة المحادثة المنبثقة */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '75px',
          left: '0',
          width: '360px',
          maxHeight: '520px',
          backgroundColor: '#fff',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.3s ease'
        }}>
          {/* رأس النافذة */}
          <div style={{ backgroundColor: '#10355c', color: '#fff', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={22} color="#c9a84c" />
              <span style={{ fontWeight: 'bold', fontSize: '15px' }}>مساعد خلية الأعمال الإنسانية</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* صندوق الرسائل */}
          <div style={{ padding: '12px', height: '320px', overflowY: 'auto', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {chatMessages.map((msg, index) => (
              <div key={index} style={{
                padding: '10px 14px',
                borderRadius: '10px',
                maxWidth: '85%',
                alignSelf: msg.sender === 'user' ? 'flex-start' : 'flex-end',
                backgroundColor: msg.sender === 'user' ? '#10355c' : '#fff',
                color: msg.sender === 'user' ? '#fff' : '#1e293b',
                border: msg.sender === 'bot' ? '1px solid #e2e8f0' : 'none',
                fontSize: '13px',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
                textAlign: 'right'
              }}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div style={{ padding: '10px 14px', borderRadius: '10px', maxWidth: '85%', alignSelf: 'flex-end', backgroundColor: '#fff', color: '#64748b', border: '1px solid #e2e8f0', fontSize: '13px', textAlign: 'right' }}>
                ⏳ جاري تحليل الطلب والبحث في بيانات المنصة...
              </div>
            )}
          </div>

          {/* نموذج الإرسال */}
          <form onSubmit={handleSendMessage} style={{ padding: '10px', backgroundColor: '#fff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label style={{ cursor: 'pointer', background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="إرفاق تقرير أو ملف">
              <Paperclip size={16} color="#64748b" />
              <input type="file" onChange={handleFileChange} style={{ display: 'none' }} accept=".xlsx,.xls,.pdf,.doc,.docx,.txt" />
            </label>

            <input 
              type="text" 
              value={userInput} 
              onChange={(e) => setUserInput(e.target.value)} 
              placeholder={selectedFile ? `ملف: ${selectedFile.name}` : "اسأل عن المنصة أو المشاريع..."} 
              style={{ flexGrow: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', background: '#fff', textAlign: 'right' }}
            />
            
            <button type="submit" disabled={isLoading} style={{ padding: '8px 14px', backgroundColor: '#c9a84c', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={14} />
            </button>
          </form>
          
          {selectedFile && (
            <div style={{ padding: '4px 10px', fontSize: '11px', color: '#047857', backgroundColor: '#ecfdf5', textAlign: 'right', borderTop: '1px solid #d1fae5' }}>
              ✓ الملف جاهز: {selectedFile.name}
            </div>
          )}
        </div>
      )}

      {/* حاوية الزر العائم مع فقاعة الترحيب النابضة */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        
        {/* فقاعة النص الترحيبية التفاعلية */}
        {!isOpen && (
          <div 
            onClick={() => setIsOpen(true)}
            style={{
              backgroundColor: '#10355c',
              color: '#fff',
              padding: '8px 14px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              cursor: 'pointer',
              border: '1px solid #c9a84c',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
          >
            <Sparkles size={15} color="#c9a84c" />
            <span>اسأل عن المنصة ومشاريعنا 🤖</span>
          </div>
        )}

        {/* زر الأيقونة العائمة */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#10355c',
            color: '#c9a84c',
            border: '2px solid #c9a84c',
            boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
          title="المساعد الذكي للمنصة"
        >
          <Bot size={30} />
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '12px',
            height: '12px',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            border: '2px solid #fff'
          }}></span>
        </button>

      </div>

    </div>
  );
}

// مكون يجمع أقسام الصفحة الرئيسية
function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Stats />
      <Projects />
      <News />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<><Header /><HomePage /><Footer /></>} />
        <Route path="/news" element={<><Header /><NewsPage /><Footer /></>} />
        <Route path="/donate" element={<><Header /><Donation /><Footer /></>} />
        <Route path="/partners" element={<><Header /><PartnersPortal /><Footer /></>} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/program/:programId" element={<ProgramDetail programs={programsData} />} />
        <Route path="/reports-feedback" element={<ReportsAndFeedback />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/projects" element={
          <div>
            <Header />
            <ProjectsPage />
            <Footer />
          </div>
        } />
      </Routes>
      <FloatingAIChat />
    </BrowserRouter>
  );
}

export default App;