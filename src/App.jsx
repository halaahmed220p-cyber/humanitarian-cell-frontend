import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Stats from './components/Stats';
import ProjectsPage from './components/ProjectsPage';
import Projects from './components/Projects'; // تم استيراده هنا ليعمل في HomePage
import News from './components/News';
import Footer from './components/Footer';
import NewsPage from './components/NewsPage';
import Donation from './components/Donation'; 
import ScrollToTop from './components/ScrollToTop'; 
import './App.css';

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
        {/* الصفحات التي تحتوي على الهيدر والفوتر */}
        <Route path="/" element={<><Header /><HomePage /><Footer /></>} />
        <Route path="/news" element={<><Header /><NewsPage /><Footer /></>} />
        <Route path="/donate" element={<><Header /><Donation /><Footer /></>} />
        
        {/* صفحة المشاريع: لوحة تحكم مستقلة بملء الشاشة وبدون تداخل */}
        // داخل ملف App.js
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