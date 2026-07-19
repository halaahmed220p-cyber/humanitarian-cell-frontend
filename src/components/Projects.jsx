import React from 'react';

export default function Projects({ data }) {
  // إضافة حماية: إذا لم تكن البيانات موجودة، لا نعرض شيئاً أو نتوقف
  if (!data) return null;

  return (
    <div className="project-card">
      <div className="project-image">
        {/* حماية إضافية للخصائص */}
        <span className="project-badge">{data.status || 'غير محدد'}</span>
        <i className={`fas ${data.icon || 'fa-project-diagram'}`}></i>
      </div>
      <div className="project-content">
        <h3>{data.title || 'عنوان غير متوفر'}</h3>
        <p>{data.description || 'لا يوجد وصف'}</p>

        <div className="project-details-expanded" style={{ marginTop: '15px', padding: '10px', borderTop: '1px solid #eee' }}>
          <p>{data.full_details || "لا توجد تفاصيل إضافية حالياً."}</p>
        </div>

        <div className="project-meta">
          <span className="project-location">
            <i className="fas fa-map-marker-alt"></i> {data.location || 'غير محدد'}
          </span>
        </div>
      </div>
    </div>
  );
}