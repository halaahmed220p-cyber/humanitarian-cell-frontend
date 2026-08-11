import React, { useState, useEffect } from 'react';
import { Handshake, Building, DollarSign, FileText, Lock, User, ArrowRight, ShieldCheck, Download } from 'lucide-react';

export default function PartnersPortal() {
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null); // الشريك الذي تم اختيار حسابه
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingReports, setLoadingReports] = useState(false);

  // جلب قائمة الشركاء عند تحميل الصفحة
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
        console.error('خطأ في جلب البيانات:', err);
        setLoading(false);
      });
  }, []);

  // جلب تقارير الشريك المختار عند تسجيل الدخول التجريبي
  const handleSelectPartner = (partner) => {
    setSelectedPartner(partner);
    setLoadingReports(true);
    fetch(`https://humanitarian-cell-frontend.onrender.com/api/partners/${partner.id}/reports`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setReports(data);
        } else {
          setReports([]);
        }
        setLoadingReports(false);
      })
      .catch(err => {
        console.error('خطأ في جلب التقارير:', err);
        setReports([]);
        setLoadingReports(false);
      });
  };

  return (
    <div style={{ minHeight: '85vh', background: 'linear-gradient(135deg, #0b1d3a 0%, #10355c 100%)', padding: '60px 20px', direction: 'rtl', textAlign: 'right', color: '#fff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* ترويسة الصفحة الملكية */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(201, 168, 76, 0.15)', borderRadius: '50%', marginBottom: '15px', border: '1px solid rgba(201, 168, 76, 0.3)' }}>
            <Handshake size={42} color="#c9a84c" />
          </div>
          <h2 style={{ fontSize: '36px', color: '#fff', fontWeight: 'bold', marginBottom: '10px' }}>
            بوابة الشركاء <span style={{ color: '#c9a84c' }}>والمانحين (VIP)</span>
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '16px', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            منصة الإفصاح المالي والتقارير الحية المخصصة لشركائنا الإستراتيجيين والمانحين الأجلاء، لمتابعة أثر التمويل أولاً بأول بكل شفافية وسرية.
          </p>
        </div>

        {/* إذا لم يتم اختيار شريك (عرض شاشة الدخول أو اختيار الحساب التجريبي) */}
        {!selectedPartner ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
              <h3 style={{ fontSize: '20px', color: '#c9a84c', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={22} /> اختر حساب الجهة للدخول الآمن للتقارير:
              </h3>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>انقر على بطاقة الجهة لاستعراض لوحتك الخاصة</span>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <div className="spinner-border text-warning" role="status"></div>
                <p style={{ marginTop: '15px', color: '#cbd5e1' }}>جاري تحميل بوابة الشركاء...</p>
              </div>
            ) : partners.length === 0 ? (
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '40px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Building size={48} color="#c9a84c" style={{ marginBottom: '15px' }} />
                <h4 style={{ color: '#fff', fontWeight: 'bold' }}>لا يوجد شركاء مسجلين حالياً</h4>
                <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '5px' }}>سيتم تفعيل حسابات المانحين قريباً.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                {partners.map((partner) => (
                  <div 
                    key={partner.id} 
                    onClick={() => handleSelectPartner(partner)}
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.07)', 
                      borderRadius: '16px', 
                      padding: '28px', 
                      border: '1px solid rgba(255, 255, 255, 0.1)', 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.borderColor = '#c9a84c';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                      {partner.logo_url ? (
                        <img src={partner.logo_url} alt={partner.name} style={{ width: '65px', height: '65px', objectFit: 'contain', borderRadius: '12px', background: '#fff', padding: '6px' }} />
                      ) : (
                        <div style={{ width: '65px', height: '65px', background: 'rgba(201, 168, 76, 0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Building size={30} color="#c9a84c" />
                        </div>
                      )}
                      <span style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: partner.type === 'donor' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                        color: partner.type === 'donor' ? '#4ade80' : '#38bdf8',
                        border: partner.type === 'donor' ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(56, 189, 248, 0.4)'
                      }}>
                        {partner.type === 'donor' ? 'مانح معتمد (VIP)' : 'شريك إستراتيجي'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '20px', color: '#fff', fontWeight: 'bold', marginBottom: '10px' }}>{partner.name}</h3>
                    <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '20px', minHeight: '45px' }}>
                      {partner.description || 'شريك فاعل في مسيرة العمل الإنساني وتطوير المشاريع المستدامة.'}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
                      {partner.contribution_amount > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ade80', fontSize: '14px', fontWeight: 'bold' }}>
                          <DollarSign size={16} />
                          <span>إجمالي التمويل: ${partner.contribution_amount}</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '13px', color: '#94a3b8' }}>شراكة برامجية وتقنية</span>
                      )}
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#c9a84c', fontSize: '13px', fontWeight: 'bold' }}>
                        دخول اللوحة <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* شاشة لوحة تحكم الشريك الخاصة بالتقارير الموثقة */
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '20px', padding: '35px', border: '1px solid rgba(201, 168, 76, 0.4)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {selectedPartner.logo_url && (
                  <img src={selectedPartner.logo_url} alt="" style={{ width: '50px', height: '50px', objectFit: 'contain', background: '#fff', borderRadius: '10px', padding: '5px' }} />
                )}
                <div>
                  <h3 style={{ fontSize: '22px', color: '#fff', fontWeight: 'bold', margin: 0 }}>{selectedPartner.name}</h3>
                  <span style={{ fontSize: '13px', color: '#c9a84c' }}>لوحة التقارير والمتابعة الحية للمشاريع المُمولة</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPartner(null)} 
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 18px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', transition: '0.2s' }}
              >
                ← العودة لقائمة الشركاء
              </button>
            </div>

            <h4 style={{ fontSize: '18px', color: '#c9a84c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} /> التقارير الميدانية والمالية الخاصة بمشاريعكم:
            </h4>

            {loadingReports ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div className="spinner-border text-warning" role="status"></div>
                <p style={{ marginTop: '10px', color: '#cbd5e1' }}>جاري استخراج التقارير السرية الخاصة بالجهة...</p>
              </div>
            ) : reports.length === 0 ? (
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '30px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.2)' }}>
                <FileText size={36} color="#94a3b8" style={{ marginBottom: '10px' }} />
                <h5 style={{ color: '#fff', fontWeight: 'bold' }}>لا توجد تقارير مرفوعة لهذه الجهة حتى الآن</h5>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: '5px 0 0 0' }}>سيتم إرفاق تقارير الإنجاز الدورية فور تدشين المراحل القادمة للمشاريع المُمولة.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '15px' }}>
                {reports.map((rep) => (
                  <div key={rep.id} style={{ background: 'rgba(255,255,255,0.07)', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                      <h5 style={{ fontSize: '16px', color: '#fff', fontWeight: 'bold', marginBottom: '5px' }}>{rep.title}</h5>
                      <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0 }}>{rep.summary || 'تقرير تفصيلي لسير العمل ونسب الإنجاز والإنفاق المالي.'}</p>
                      <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '5px', display: 'block' }}>تاريخ الإصدار: {new Date(rep.created_at).toLocaleDateString('ar-SA')}</span>
                    </div>
                    <a 
                      href={rep.report_file_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ background: '#c9a84c', color: '#0b1d3a', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Download size={16} /> تحميل التقرير (PDF)
                    </a>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}