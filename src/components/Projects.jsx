import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// بيانات محلية
const localProjects = [
  { id: 1, title: 'السلال الغذائية', description: 'توزيع السلال الغذائية للأسر الأشد احتياجاً.', status: 'مكتمل', location: 'تعز' },
  { id: 2, title: 'التعليم للجميع', description: 'دعم التعليم الأساسي للأطفال النازحين والفقراء.', status: 'جديد', location: 'عدن' },
  { id: 3, title: 'التدخلات العاجلة', description: 'استجابة سريعة للأزمات الإنسانية في المناطق المتضررة.', status: 'جاري التنفيذ', location: 'إب' }
];

export default function Projects() {
  const [expandedId, setExpandedId] = useState(null);
  const location = useLocation();

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const isHomePage = location.pathname === "/";
  const displayProjects = isHomePage ? localProjects.slice(0, 3) : localProjects;

  return (
    <section className="projects" id="projects">
      <div className="container">
        <div className="section-header">
          <span className="section-label">مشاريعنا</span>
          <h2 className="section-title">{isHomePage ? "مشاريعنا الأحدث" : "جميع المشاريع"}</h2>
        </div>

        {/* إضافة قسم الخريطة محلياً لضمان عدم الحجب */}
        {!isHomePage && (
          <div className="map-placeholder" style={{ margin: '30px auto', padding: '20px', background: '#f9f9f9', borderRadius: '15px', textAlign: 'center', border: '1px solid #ddd' }}>
            <h3>خريطة التدخلات الإنسانية</h3>
            <svg width="100%" height="200" viewBox="0 0 400 200">
              <rect width="100%" height="100%" fill="#e0e0e0" />
              <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#555">
                خريطة اليمن (تعز، عدن، إب)
              </text>
              <circle cx="150" cy="80" r="8" fill="red" /> {/* تعز */}
              <circle cx="180" cy="130" r="8" fill="blue" /> {/* عدن */}
              <circle cx="130" cy="60" r="8" fill="green" /> {/* إب */}
            </svg>
            <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>هذه خريطة محلية لا تعتمد على اتصالات خارجية.</p>
          </div>
        )}

        <div className="projects-grid">
          {displayProjects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-image" style={{ background: '#003366', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="project-badge">{project.status}</span>
                <svg width="50" height="50" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-meta">
                  <span className="project-location">📍 {project.location}</span>
                  {isHomePage ? (
                    <Link to="/projects" className="project-btn" onClick={() => window.scrollTo(0, 0)}>
                      التفاصيل ←
                    </Link>
                  ) : (
                    <button onClick={() => toggleExpand(project.id)} className="project-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#003366', fontWeight: 'bold' }}>
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