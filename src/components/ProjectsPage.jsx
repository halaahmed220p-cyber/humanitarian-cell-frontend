// src/pages/ProjectsPage.jsx
import React from 'react';
import { projectsData } from '../data'; // استيراد نفس البيانات

const ProjectsPage = () => {
  return (
    <div dir="rtl">
      <h1>جميع المشاريع</h1>
      <div className="projects-grid">
        {projectsData.map((project) => (
          <div key={project.id} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;