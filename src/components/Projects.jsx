import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const isHomePage = location.pathname === "/";
  const displayProjects = isHomePage ? projects.slice(0, 3) : projects;

  return (
    <section className="projects" id="projects">
      <div className="container">
        
        {/* إضافة قسم العنوان هنا ليظهر في كلاً من الصفحة الرئيسية وصفحة المشاريع */}
        <div className="section-header">
          <span className="section-label">مشاريعنا</span>
          <h2 className="section-title">
            {isHomePage ? "مشاريعنا الأحدث" : "جميع المشاريع"}
          </h2>
        </div>

        <div className="projects-grid">
          {displayProjects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-image">
                <span className="project-badge">{project.status}</span>
                <i className={`fas ${project.icon}`}></i>
              </div>
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>

                {/* عرض التفاصيل فقط في صفحة المشاريع وعند توسيع البطاقة */}
                {!isHomePage && expandedId === project.id && (
                  <div className="project-details-expanded" style={{ marginTop: '15px', padding: '10px', borderTop: '1px solid #eee' }}>
                    <p>{project.full_details || "لا توجد تفاصيل إضافية حالياً."}</p>
                  </div>
                )}

                <div className="project-meta">
                  <span className="project-location">
                    <i className="fas fa-map-marker-alt"></i> {project.location}
                  </span>

                  {/* المنطق الشرطي للزر */}
                  {isHomePage ? (
                    <Link 
  to="/projects" 
  className="project-btn"
  onClick={() => window.scrollTo(0, 0)} // هذا سيجبر المتصفح على الصعود للأعلى
>
  التفاصيل <i className="fas fa-arrow-left"></i>
</Link>
                  ) : (
                    <button onClick={() => toggleExpand(project.id)} className="project-btn" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      {expandedId === project.id ? "إخفاء التفاصيل ↑" : "التفاصيل ↓"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}