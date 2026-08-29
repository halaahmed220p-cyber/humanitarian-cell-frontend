import React, { useState } from 'react';
import { MessageSquarePlus, MapPin, CheckCircle } from 'lucide-react';
// استيراد الهيدر والفوتر (تأكد من تعديل المسارات حسب مكان الملفات لديك)
import Header from '../components/Header';
import Footer from '../components/Footer';

const ReportsAndFeedback = () => {
  const [formData, setFormData] = useState({
    type: 'complaint', // complaint (بلاغ) / suggestion (مقترح) / feedback (رأي)
    title: '',         // حقل عنوان البلاغ أو المقترح الجديد
    fullName: '',
    phone: '',
    message: '',
    latitude: '',
    longitude: '',
    locationStatus: 'لم يتم تحديد الموقع بعد'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // دالة لجلب الموقع الجغرافي تلقائياً عبر GPS المتصفح
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('متصفحك لا يدعم خاصية تحديد الموقع الجغرافي');
      return;
    }

    setFormData(prev => ({ ...prev, locationStatus: 'جاري تحديد الموقع...' }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          locationStatus: `تم تحديد الموقع بنجاح (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`
        }));
      },
      (error) => {
        console.error("Error getting location:", error);
        setFormData(prev => ({ ...prev, locationStatus: 'فشل تحديد الموقع. يرجى السماح بالصلاحية.' }));
        alert('⚠️ تعذر تحديد موقعك. يرجى التحقق من تفعيل خدمة الـ GPS والسماح للمتصفح بالوصول إليه.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // دالة إرسال البلاغ
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.latitude || !formData.longitude) {
      alert('⚠️ عذراً، إرفاق وتحديد الموقع الجغرافي (GPS) إلزامي لإرسال البلاغ أو الملاحظة بنجاح.');
      return;
    }

    setIsSubmitting(true);

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://humanitarian-cell-frontend.onrender.com';

      const response = await fetch(`${baseUrl}/api/field-reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: formData.type,
          title: formData.title, // إرسال العنوان للسيرفر
          full_name: formData.fullName,
          phone: formData.phone,
          message: formData.message,
          latitude: formData.latitude,
          longitude: formData.longitude
        }),
      });

      if (!response.ok) {
        throw new Error('حدث خطأ أثناء إرسال البلاغ إلى الخادم.');
      }

      setIsSubmitting(false);
      setSubmittedSuccess(true);
    } catch (error) {
      console.error("Error submitting report:", error);
      alert('حدث خطأ في الاتصال بالسيرفر. يرجى المحاولة مرة أخرى لاحقاً.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <div style={{ padding: '60px 20px', backgroundColor: '#f8fafc', minHeight: '85vh', direction: 'rtl' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: 'rgba(201, 168, 76, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
              <MessageSquarePlus size={30} color="#c9a84c" />
            </div>
            <h2 style={{ color: '#0b1d3a', fontSize: '26px', fontWeight: 'bold', marginBottom: '10px' }}>
              الآراء والمقترحات والبلاغات
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>
              نحن نرحب بمقترحاتكم ونأخذ بلاغاتكم الإنسانية والخدمية بجدية تامة لتعزيز سرعة وكفاءة العمل الميداني.
            </p>
          </div>

          {submittedSuccess ? (
            <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #10b981', color: '#065f46', padding: '25px', borderRadius: '12px', textAlign: 'center' }}>
              <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 10px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>تم إرسال طلبك أو بلاغك بنجاح!</h3>
              <p style={{ fontSize: '14px', marginBottom: '20px' }}>شكراً لمساهمتك معنا. تم توثيق موقعك الجغرافي بدقة، وسيتم متابعة البلاغ من قِبل الفريق المختص في أقرب وقت.</p>
              <button 
                onClick={() => {
                  setSubmittedSuccess(false);
                  setFormData({ type: 'complaint', title: '', fullName: '', phone: '', message: '', latitude: '', longitude: '', locationStatus: 'لم يتم تحديد الموقع بعد' });
                }} 
                style={{ padding: '10px 24px', backgroundColor: '#0b1d3a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                إرسال بلاغ أو مقترح آخر
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* نوع المشاركة */}
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', color: '#0b1d3a' }}>
                  نوع المشاركة <span style={{ color: '#ef4444' }}>*</span>:
                </label>
                <select 
                  value={formData.type} 
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff', outline: 'none' }}
                >
                  <option value="complaint">بلاغ طارئ / شكوى إنسانية ميدانية</option>
                  <option value="suggestion">مقترح تطويري للمشاريع والأنشطة</option>
                  <option value="feedback">رأي أو تقييم عام للخدمات</option>
                </select>
              </div>

              {/* حقل العنوان الجديد */}
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', color: '#0b1d3a' }}>
                  عنوان البلاغ أو الموضوع <span style={{ color: '#ef4444' }}>*</span>:
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: انقطاع مياه الشرب في حي..."
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>

              {/* الاسم ورقم الهاتف */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', color: '#0b1d3a' }}>
                    الاسم الكامل <span style={{ color: '#ef4444' }}>*</span>:
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="أدخل اسمك الكريم..."
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', color: '#0b1d3a' }}>
                    رقم الهاتف (للتواصل) <span style={{ color: '#ef4444' }}>*</span>:
                  </label>
                  <input 
                    type="tel" 
                    required
                    placeholder="00967XXXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>
              </div>

              {/* تفاصيل البلاغ */}
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', color: '#0b1d3a' }}>
                  تفاصيل البلاغ أو الملاحظة <span style={{ color: '#ef4444' }}>*</span>:
                </label>
                <textarea 
                  rows="4"
                  required
                  placeholder="اكتب تفاصيل بلاغك أو مقترحك بوضوح تام..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none', resize: 'vertical' }}
                />
              </div>

              {/* قسم الموقع الجغرافي الإلزامي (GPS) */}
              <div style={{ backgroundColor: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px dashed #c9a84c' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <MapPin size={18} color="#c9a84c" />
                  <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#0b1d3a' }}>
                    الموقع الجغرافي (GPS) <span style={{ color: '#ef4444' }}>* (إلزامي)</span>:
                  </label>
                </div>
                <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '12px', lineHeight: '1.5' }}>
                  لضمان الاستجابة الميدانية السريعة للبلاغات والشكاوى، يتطلب النظام تحديد موقعك الحالي بدقة عبر الأقمار الصناعية.
                </p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                  <button 
                    type="button" 
                    onClick={handleGetLocation}
                    style={{ padding: '10px 18px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px' }}
                  >
                    <MapPin size={16} /> تحديد موقعي الحالي تلقائياً
                  </button>
                  <span style={{ fontSize: '13px', color: formData.latitude ? '#059669' : '#dc2626', fontWeight: 'bold' }}>
                    {formData.locationStatus}
                  </span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{ marginTop: '10px', padding: '14px', backgroundColor: '#c9a84c', color: '#0b1d3a', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1, transition: 'background 0.2s' }}
              >
                {isSubmitting ? 'جاري إرسال البلاغ وتوثيق الموقع...' : 'إرسال البلاغ أو المقترح الآن'}
              </button>

            </form>
          )}

        </div>
      </div>

      <Footer />
    </>
  );
};

export default ReportsAndFeedback;