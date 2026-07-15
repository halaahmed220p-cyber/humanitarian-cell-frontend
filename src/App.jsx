import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Stats from './components/Stats';
import Projects from './components/Projects';
import News from './components/News';
import Footer from './components/Footer';
import NewsPage from './components/NewsPage';
import Donation from './components/Donation'; 
// استيراد مكون ScrollToTop للتحكم بالتمرير لأعلى الصفحة
import ScrollToTop from './components/ScrollToTop'; 
import './App.css';

// مكون يجمع أقسام الصفحة الرئيسية
function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Stats />
      <Projects /> {/* يعرض الـ 3 مشاريع فقط في الصفحة الرئيسية */}
      <News />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* تم وضع المكون هنا ليعمل تلقائياً عند الانتقال بين كافة الصفحات */}
      <ScrollToTop />
      
      <Header />
      <Routes>
        {/* الصفحة الرئيسية */}
        <Route path="/" element={<HomePage />} />
        
        {/* صفحة المشاريع المستقلة */}
        <Route path="/projects" element={<Projects />} /> 
        <Route path="/news" element={<NewsPage />} />
        <Route path="/donate" element={<Donation />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;