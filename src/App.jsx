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
import { programsData } from './data/programsData';
import ScrollToTop from './components/ScrollToTop'; 
import { Bot, Send } from 'lucide-react';
import './App.css';

// مكون الشات والتلخيص المدمج
function AIChatSection() {
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'أهلاً بك! أنا مساعد الذكاء الاصطناعي، جاهز لتلخيص التقارير والرد على استفساراتك حول المنصة.' }
  ]);
  const [userInput, setUserInput] = useState('');

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
        setChatMessages(prev => [...prev, { sender: 'bot', text: '📋 ملخص التقرير: يوضح النظام تقدم العمل في مشاريع خلية الأعمال الإنسانية بنسبة نمو مستقرة.' }]);
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'bot', text: '📋 ملخص تفاعلي: العمل جاري في مشاريع البنية التحتية والتعليم والتحول الرقمي للأنظمة الإنسانية.' }]);
    }
  };

  return (
    <section style={{ padding: '60px 20px', background: '#f1f5f9', borderTop: '1px solid #e2e8f0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', color: '#10355c', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <Bot className="w-6 h-6 text-[#c9a84c]" />
            المساعد الذكي <span style={{ color: '#c9a84c' }}>للتلخيص والإجابة</span>
          </h3>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '5px' }}>اسأل عن التقارير أو اطلب تلخيصاً فورياً للبيانات البرمجية والإدارية</p>
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

        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            value={userInput} 
            onChange={(e) => setUserInput(e.target.value)} 
            placeholder="اكتب سؤالك هنا أو اطلب تلخيص التقارير..." 
            style={{ flexGrow: 1, padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
          />
          <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#c9a84c', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={16} /> إرسال
          </button>
        </form>
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