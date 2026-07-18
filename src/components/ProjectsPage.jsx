import React, { useState } from 'react';
import MapComponent from '../components/MapComponent'; // تأكدي من مسار المكون

const ProjectsPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // دالة لجلب المشاريع من السيرفر بناءً على المحافظة
  const fetchProjectsByLocation = async (locationName) => {
    setLoading(true);
    try {
      // استبدلي هذا الرابط برابط الباك إند الخاص بكِ
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
      
      {/* الخريطة التفاعلية */}
      <MapComponent onSelectLocation={handleMapClick} />
      
      {/* عرض المشاريع بناءً على المحافظة المختارة */}
      {selectedLocation && (
        <section className="projects-results">
          <h2>مشاريع محافظة: {selectedLocation}</h2>
          {loading ? (
            <p>جاري التحميل...</p>
          ) : (
            <div className="projects-grid">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div key={project.id} className="project-card">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <small>الحالة: {project.status}</small>
                  </div>
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