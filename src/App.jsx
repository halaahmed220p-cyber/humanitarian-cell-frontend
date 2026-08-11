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
import PartnersPortal from './components/PartnersPortal'; // تم استيراد بوابة الشركاء والمانحين
import { programsData } from './data/programsData';
import ScrollToTop from './components/ScrollToTop'; 
import { Bot, Send } from 'lucide-react';
import './App.css';

// مكون الشات والتلخيص المدمج
// مكون الشات والتلخيص المدمج مع دعم إرسال ورفع الملفات
function AIChatSection() {
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'أهلاً بك! أنا مساعد الذكاء الاصطناعي، يمكنك كتابة سؤالك أو إرفاق ملف/تقرير لتلخيصه فوراً.' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // حالة لحفظ الملف المرفق

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

    // تجهيز البيانات للإرسال (FormData لدعم الملفات والرسائل النصية معاً)
    const formData = new FormData();
    formData.append('message', messageText);
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    try {
      // ملاحظة: تأكدي أن مسار الـ API يدعم استقبال الـ FormData والملفات في الباك اند (Backend)
      // اجعلي الطلب هكذا تماماً:
const response = await fetch('https://humanitarian-cell-frontend.onrender.com/api/ai-assistant', {
  method: 'POST',
  mode: 'cors', // ضروري جداً لتجنب مشاكل التصريح
  body: formData 
});
      
      const data = await response.json();
      setSelectedFile(null); // إعادة تعيين الملف بعد الإرسال

  if (data && data.response) {
        setChatMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
      } else {
        setChatMessages(prev => [...prev, { sender: 'bot', text: data.error || 'عذراً، لم يتم العثور على حقل الرد في البيانات المسترجعة.' }]);
      }
    } catch (err) {
  setSelectedFile(null);
  setChatMessages(prev => [...prev, { sender: 'bot', text: '⚠️ حدث خطأ في الاتصال بالسيرفر أو أن رابط الـ Backend لا يستجيب. تأكدي من عمل سيرفر Render.' }]);
}
  };

  return (
    <section style={{ padding: '60px 20px', background: '#f1f5f9', borderTop: '1px solid #e2e8f0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', color: '#10355c', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <Bot className="w-6 h-6 text-[#c9a84c]" />
            المساعد الذكي <span style={{ color: '#c9a84c' }}>للتلخيص وإرفاق التقارير</span>
          </h3>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '5px' }}>قم برفع ملفات التقارير أو اكتب استفسارك لتلخيصها فوراً</p>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', height: '300px', overflowY: 'auto', border: '1px solid #cbd5e1', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {chatMessages.map((msg, index) => (
            <div key={index} style={{
              padding: '12px 16px',
              borderRadius: '10px',
              maxWidth: '80%',
              alignSelf: msg.sender === 'user' ? 'flex-start' : 'flex-end',
              backgroundColor: msg.sender === 'user' ? '#10355c' : '#f8fafc',
              color: msg.sender === 'user' ? '#fff' : '#1e293b',
              border: msg.sender === 'bot' ? '1px solid #e2e8f0' : 'none',
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              {msg.text}
            </div>
          ))}
        </div>

        {/* نموذج الإرسال مع زر إرفاق الملفات */}
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          
          {/* زر إرفاق ملف المخفي الذي يتم تفعيله عبر أيقونة */}
          <label style={{ cursor: 'pointer', background: '#fff', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="إرفاق تقرير أو ملف">
            <span style={{ fontSize: '18px' }}>📎</span>
            <input type="file" onChange={handleFileChange} style={{ display: 'none' }} accept=".pdf,.doc,.docx,.txt" />
          </label>

          <input 
            type="text" 
            value={userInput} 
            onChange={(e) => setUserInput(e.target.value)} 
            placeholder={selectedFile ? `ملف مرفق: ${selectedFile.name} (اكتب تعليقاً أو اضغط إرسال)` : "اكتب سؤالك أو اطلب تلخيص التقارير المرفقة..."} 
            style={{ flexGrow: 1, padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', background: '#fff' }}
          />
          
          <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#c9a84c', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={16} /> إرسال
          </button>
        </form>
        {selectedFile && (
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#047857', fontWeight: 'bold' }}>
            ✓ الملف جاهز للإرسال: {selectedFile.name}
          </div>
        )}
      </div>
    </section>
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
      <AIChatSection /> {/* تم إضافة الشات هنا ليظهر بالصفحة الرئيسية */}
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
<Route path="/partners" element={<><Header /><PartnersPortal /><Footer /></>} /> {/* تم إضافة مسار بوابة الشركاء */}
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/program/:programId" element={<ProgramDetail programs={programsData} />} />
        <Route path="/projects" element={
          <div>
            <Header />
            <ProjectsPage />
            <Footer />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;