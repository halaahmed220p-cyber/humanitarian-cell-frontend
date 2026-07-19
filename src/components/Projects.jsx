import React from 'react';

// تم تعديل المكون ليأخذ البيانات عبر props (data)
export default function Projects({ data }) {
  // قمت بتبسيط المكون ليعرض بطاقة مشروع واحدة فقط كما اتفقنا
  
  return (
    <div className="project-card">
      <div className="project-image">
        <span className="project-badge">{data.status}</span>
        {/* تأكدي من أن اسم الأيقونة في قاعدة البيانات متوافق مع FontAwesome */}
        <i className={`fas ${data.icon || 'fa-project-diagram'}`}></i>
      </div>
      <div className="project-content">
        <h3>{data.title}</h3>
        <p>{data.description}</p>

        {/* التفاصيل الكاملة */}
        <div className="project-details-expanded" style={{ marginTop: '15px', padding: '10px', borderTop: '1px solid #eee' }}>
          <p>{data.full_details || "لا توجد تفاصيل إضافية حالياً."}</p>
        </div>

        <div className="project-meta">
          <span className="project-location">
            <i className="fas fa-map-marker-alt"></i> {data.location}
          </span>
        </div>
      </div>
    </div>
  );
}