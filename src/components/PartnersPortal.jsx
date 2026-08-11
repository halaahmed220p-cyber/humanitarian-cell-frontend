import React, { useState, useEffect } from 'react';

export default function PartnersPortal() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://humanitarian-cell-frontend.onrender.com/api/partners')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPartners(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('خطأ في الاتصال:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container py-5" style={{ direction: 'rtl', textAlign: 'right' }}>
      <div className="text-center mb-5">
        <h2 className="fw-bold" style={{ color: '#0d3b66' }}>بوابة الشركاء والمانحين</h2>
        <p className="text-muted">نعتز بشراكاتنا الإستراتيجية ودعم مانحينا الأجلاء لتحقيق أهدافنا الإنسانية والتنموية.</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">جاري تحميل بيانات الشركاء...</p>
        </div>
      ) : partners.length === 0 ? (
        <div className="alert alert-info text-center">لا يوجد شركاء أو مانحين مسجلين حالياً.</div>
      ) : (
        <div className="row g-4">
          {partners.map((partner) => (
            <div className="col-md-4" key={partner.id}>
              <div className="card h-100 shadow-sm border-0 p-3">
                {partner.logo_url && (
                  <img 
                    src={partner.logo_url} 
                    alt={partner.name} 
                    className="card-img-top mx-auto mt-2" 
                    style={{ height: '80px', objectFit: 'contain', width: '80px' }} 
                  />
                )}
                <div className="card-body">
                  <span className={`badge mb-2 ${partner.type === 'donor' ? 'bg-success' : 'bg-primary'}`}>
                    {partner.type === 'donor' ? 'مانح معتمد' : 'شريك إستراتيجي'}
                  </span>
                  <h5 className="card-title fw-bold">{partner.name}</h5>
                  <p className="card-text text-muted small">{partner.description || 'شريك فاعل في مسيرة العمل الإنساني.'}</p>
                  {partner.contribution_amount > 0 && (
                    <p className="text-success fw-bold small">إجمالي المساهمات: ${partner.contribution_amount}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}