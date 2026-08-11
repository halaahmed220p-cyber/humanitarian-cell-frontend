import React, { useState, useEffect } from 'react';
import { Handshake, Building, DollarSign, FileText, Lock, User, ArrowRight, ShieldCheck, Download, LogOut } from 'lucide-react';

export default function PartnersPortal() {
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  
  // حالات تسجيل الدخول
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // دالة التعامل مع تسجيل الدخول
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const response = await fetch('https://humanitarian-cell-frontend.onrender.com/api/partners/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        setSelectedPartner(data.partner);
        fetchReports(data.partner.id);
      } else {
        setLoginError(data.error || 'فشل تسجيل الدخول، يجى التحقق من البيانات.');
      }
    } catch (err) {
      console.error('خطأ في الاتصال:', err);
      setLoginError('حدث خطأ في الاتصال بالسيرفر.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // جلب تقارير الشريك
  const fetchReports = (partnerId) => {
    setLoadingReports(true);
    fetch(`https://humanitarian-cell-frontend.onrender.com/api/partners/${partnerId}/reports`)
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
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* ترويسة الصفحة الملكية */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(201, 168, 76, 0.15)', borderRadius: '50%', marginBottom: '15px', border: '1px solid rgba(201, 168, 76, 0.3)' }}>
            <Handshake size={42} color="#c9a84c" />
          </div>
          <h2 style={{ fontSize: '36px', color: '#fff', fontWeight: 'bold', marginBottom: '10px' }}>
            بوابة الشركاء <span style={{ color: '#c9a84c' }}>والمانحين (الآمنة)</span>
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '16px', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            منصة الإفصاح المالي والتقارير الحية المشفرة المخصصة حصرياً لشركائنا الإستراتيجيين والمانحين الأجلاء.
          </p>
        </div>

        {/* إذا لم يتم تسجيل الدخول، اعرض نموذج الدخول الآمن */}
        {!selectedPartner ? (
          <div style={{ maxWidth: '450px', margin: '0 auto', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '20px', padding: '35px', border: '1px solid rgba(201, 168, 76, 0.4)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <ShieldCheck size={40} color="#c9a84c" style={{ marginBottom: '10px' }} />
              <h3 style={{ fontSize: '20px', color: '#fff', fontWeight: 'bold' }}>تسجيل دخول الجهة المانحة/الشريكة</h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '5px' }}>الرجاء إدخال بيانات الاعتماد الخاصة بجهتكم للوصول إلى التقارير.</p>
            </div>

            {loginError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '10px 15px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '8px' }}>اسم المستخدم (Username)</label>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.080)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '0 12px' }}>
                  <User size={18} color="#94a3b8" />
                  <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="أدخل اسم المستخدم للجهة" 
                    required
                    style={{ width: '100%', background: 'transparent', border: 'none', padding: '12px', color: '#fff', outline: 'none', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '8px' }}>كلمة المرور (Password)</label>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '0 12px' }}>
                  <Lock size={18} color="#94a3b8" />
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="أدخل كلمة المرور الخاصة" 
                    required
                    style={{ width: '100%', background: 'transparent', border: 'none', padding: '12px', color: '#fff', outline: 'none', fontSize: '14px' }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoggingIn}
                style={{ background: '#c9a84c', color: '#0b1d3a', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', transition: '0.2s', marginTop: '10px' }}
              >
                {isLoggingIn ? 'جاري التحقق...' : 'تسجيل الدخول الآمن'}
              </button>
            </form>
          </div>
        ) : (
          /* لوحة تحكم الشريك بعد تسجيل الدخول بنجاح */
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '20px', padding: '35px', border: '1px solid rgba(201, 168, 76, 0.4)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {selectedPartner.logo_url && (
                  <img src={selectedPartner.logo_url} alt="" style={{ width: '50px', height: '50px', objectFit: 'contain', background: '#fff', borderRadius: '10px', padding: '5px' }} />
                )}
                <div>
                  <h3 style={{ fontSize: '22px', color: '#fff', fontWeight: 'bold', margin: 0 }}>{selectedPartner.name}</h3>
                  <span style={{ fontSize: '13px', color: '#c9a84c' }}>مرحباً بك، لوحة التقارير والشفافية الخاصة بجهتكم</span>
                </div>
              </div>
              <button 
                onClick={() => { setSelectedPartner(null); setUsername(''); setPassword(''); }} 
                style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '8px 18px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <LogOut size={16} /> تسجيل الخروج
              </button>
            </div>

            <h4 style={{ fontSize: '18px', color: '#c9a84c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} /> التقارير الميدانية والمالية الخاصة بمشاريعكم المُمولة:
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
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: '5px 0 0 0' }}>سيتم إرفاق تقارير الإنجاز الدورية فور صدورها.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '15px' }}>
                {reports.map((rep) => (
                  <div key={rep.id} style={{ background: 'rgba(255,255,255,0.07)', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                      <h5 style={{ fontSize: '16px', color: '#fff', fontWeight: 'bold', marginBottom: '5px' }}>{rep.title}</h5>
                      <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0 }}>{rep.summary || 'تقرير تفصيلي لسير العمل ونسب الإنجاز والإنفاق المالي للمشروع.'}</p>
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