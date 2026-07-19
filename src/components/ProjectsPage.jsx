import React, { useState } from 'react';
import MapComponent from '../components/MapComponent'; 
import ProjectCard from './Projects'; 

const ProjectsPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProjectsByLocation = async (locationName) => {
    setLoading(true);
    try {
      const response = await fetch(`https://humanitarian-cell-frontend.onrender.com/api/projects/${locationName}`);
      const data = await response.json();
      
      // التعديل: التأكد دائماً أننا نضع مصفوفة في الحالة (State)
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("خطأ في جلب المشاريع:", err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (location) => {
    setSelectedLocation(location);
    fetchProjectsByLocation(location);
  };

  return (
    <div dir="rtl" className="projects-page">
      <h1>خريطة المشاريع التفاعلية</h1>
      
      <MapComponent onSelectLocation={handleMapClick} />
      
      {selectedLocation && (
        <section className="projects-results">
          <h2>مشاريع محافظة: {selectedLocation}</h2>
          {loading ? (
            <p>جاري التحميل...</p>
          ) : (
            <div className="projects-grid">
              {/* التعديل: فحص وجود المصفوفة قبل الـ map */}
              {projects && projects.length > 0 ? (
                projects.map((project, index) => (
                  // استخدام index كـ key احتياطي إذا لم يوجد id
                  <ProjectCard key={project?.id || index} data={project || {}} />
                ))
              ) : (
                <p>لا توجد مشاريع في هذه المحافظة حالياً.</p>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default ProjectsPage;