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
        {/* الصفحة الرئيسية */}
        <Route path="/" element={<><Header /><HomePage /><Footer /></>} />
        
        {/* صفحة الأخبار */}
        <Route path="/news" element={<><Header /><NewsPage /><Footer /></>} />
        
        {/* صفحة التبرع */}
        <Route path="/donate" element={<><Header /><Donation /><Footer /></>} />
        
        {/* صفحة البرامج العامة (تم تصحيح المسار ليكون /programs بدلاً من تكرار /) */}
        <Route path="/programs" element={<ProgramsPage />} />
        
        {/* صفحة تفاصيل البرنامج المحدد */}
        <Route path="/program/:programId" element={<ProgramDetail programs={programsData} />} />
        
        {/* صفحة المشاريع */}
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