import React, { useState } from 'react';
import MapComponent from '../components/MapComponent'; 
import ProjectCard from './Projects'; // تأكدي أن اسم الملف هو Projects.jsx في نفس المجلد

const ProjectsPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // تم تصحيح الرابط بإضافة علامات الـ backticks (`)
  const fetchProjectsByLocation = async (locationName) => {
    setLoading(true);
    try {
      const response = await fetch(`https://humanitarian-cell-ftontend.onrender.com/api/projects/${locationName}`);
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      console.error("خطأ في جلب المشاريع:", err);
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
              {projects.length > 0 ? (
                projects.map((project) => (
                  <ProjectCard key={project.id} data={project} />
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