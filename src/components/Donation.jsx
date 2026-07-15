import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Donation = () => {
  const [projects, setProjects] = useState([]); // المشاريع الآتية من قاعدة البيانات
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    amount: '',
    project: 'عام',
    paymentMethod: 'kuraimi' // الكريمي كخيار افتراضي
  });
  
  // حالات جديدة لإدارة السند المرفوع
  const [receiptImage, setReceiptImage] = useState(null);
  const [receiptName, setReceiptName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // دالة التعامل مع تغيير المدخلات النصية
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // دالة التعامل مع رفع صورة السند
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptImage(file);
      setReceiptName(file.name);
    }
  };

  // جلب المشاريع من السيرفر/قاعدة البيانات عند تحميل الصفحة
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/projects/active');
        setProjects(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error("خطأ أثناء جلب المشاريع:", error);
        setProjects([
          { id: '1', title: 'سلة الغذاء للأسر المتعففة', description: 'توفير السلال الغذائية الأساسية لتمكين العائلات الأكثر احتياجاً من لقمة العيش الكريمة.', target: 15000, raised: 9750 },
          { id: '2', title: 'كفالة ورعاية الأيتام', description: 'توفير الدعم المالي والتعليمي والصحي للأيتام لضمان مستقبل مشرق وآمن لهم.', target: 20000, raised: 8000 }
        ]);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSend = new FormData();
    dataToSend.append('fullName', formData.fullName);
    dataToSend.append('email', formData.email);
    dataToSend.append('phone', formData.phone);
    dataToSend.append('amount', formData.amount);
    dataToSend.append('project', formData.project);
    dataToSend.append('paymentMethod', formData.paymentMethod);
    if (receiptImage) {
      dataToSend.append('receipt', receiptImage);
    }

    axios.post('http://localhost:3000/api/donations', dataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(() => setSubmitted(true))
      .catch(err => console.error("خطأ في إرسال التبرع:", err));
  };

  return (
    <div className="donation-page" style={{ direction: 'rtl', minHeight: '100vh', backgroundColor: '#fdfbf7' }}>
      
      {/* 1. قسم البانر الداكن (Hero Section) المنسجم تماماً مع الهوية البصرية */}
      <div style={{ 
        background: 'linear-gradient(135deg, #111e36 0%, #1a2a4a 100%)', 
        padding: '160px 20px 80px', 
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '4px solid #c4a35a'
      }}>
        {/* تأثير جمالي خفيف في الخلفية */}
        <div style={{ 
          position: 'absolute', 
          top: 0, left: 0, right: 0, bottom: 0, 
          opacity: 0.05, 
          backgroundImage: 'radial-gradient(circle, #c4a35a 1px, transparent 1px)', 
          backgroundSize: '20px 20px' 
        }}></div>

        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <span style={{ 
            color: '#c4a35a', 
            fontWeight: 'bold', 
            fontSize: '1rem', 
            letterSpacing: '1px', 
            textTransform: 'uppercase', 
            display: 'block', 
            marginBottom: '15px' 
          }}>
            بوابة العطاء الإنساني
          </span>
          <h1 style={{ 
            color: '#ffffff', 
            fontSize: '3.2rem', 
            marginBottom: '20px', 
            fontWeight: '800',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            مساهمتكم تصنع الأمل
          </h1>
          <p style={{ 
            color: '#e2e8f0', 
            fontSize: '1.2rem', 
            maxWidth: '650px', 
            margin: '0 auto', 
            lineHeight: '1.9',
            fontWeight: '300'
          }}>
            بخطوات بسيطة وسريعة، يمكنك توجيه تبرعك مباشرة إلى الفئات المستهدفة عبر خيارات دفع محلية ودولية آمنة.
          </p>
          <div style={{ 
            width: '80px', 
            height: '4px', 
            backgroundColor: '#c4a35a', 
            margin: '25px auto 0', 
            borderRadius: '10px' 
          }}></div>
        </div>
      </div>

      {/* 2. محتوى الاستمارة والمشاريع بالأسفل */}
      <div style={{ maxWidth: '1140px', margin: '-40px auto 80px', padding: '0 20px', position: 'relative', zIndex: 2 }}>
        
        {submitted ? (
          <div style={{ textAlign: 'center', backgroundColor: '#ffffff', padding: '60px 40px', borderRadius: '24px', boxShadow: '0 20px 50px rgba(26, 42, 74, 0.08)', maxWidth: '600px', margin: '0 auto', border: '1px solid #f1ece1' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#2ecc71', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', boxShadow: '0 10px 20px rgba(46, 204, 113, 0.2)' }}>
              <i className="fas fa-heart" style={{ color: '#fff', fontSize: '2.5rem' }}></i>
            </div>
            <h2 style={{ color: '#1a2a4a', marginBottom: '15px', fontWeight: 'bold' }}>تقبل الله طاعتكم وصالح أعمالكم!</h2>
            <p style={{ color: '#606f7b', lineHeight: '1.8', fontSize: '1.05rem' }}>
              تم استلام تفاصيل تبرعكم الكريم وسند التحويل بنجاح. سنرسل إليكم سند الاستلام والتفاصيل عبر واتساب أو البريد قريباً.
            </p>
            <button 
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  fullName: '',
                  email: '',
                  phone: '',
                  amount: '',
                  project: 'عام',
                  paymentMethod: 'kuraimi'
                });
                setReceiptImage(null);
                setReceiptName('');
              }} 
              style={{ marginTop: '35px', padding: '12px 35px', backgroundColor: '#c4a35a', color: '#fff', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: 'all 0.3s', boxShadow: '0 5px 15px rgba(196, 163, 90, 0.3)' }}
            >
              تقديم تبرع جديد
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '45px', alignItems: 'start' }}>
            
            {/* قسم استمارة التبرع */}
            <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '24px', boxShadow: '0 15px 40px rgba(26, 42, 74, 0.04)', border: '1px solid #f1ece1' }}>
              <h3 style={{ color: '#1a2a4a', marginBottom: '30px', fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '5px', height: '22px', backgroundColor: '#c4a35a', borderRadius: '3px', display: 'inline-block' }}></span>
                بيانات المتبرع الكريم
              </h3>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#1a2a4a', fontWeight: '600', fontSize: '0.95rem' }}>الاسم الكامل (أو فاعل خير)</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName} 
                    onChange={handleChange}
                    placeholder="مثال: أحمد محمد عبد الله" 
                    style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e1dbcf', outline: 'none', fontSize: '0.95rem', backgroundColor: '#faf9f6' }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#1a2a4a', fontWeight: '600', fontSize: '0.95rem' }}>البريد الإلكتروني</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email} 
                      onChange={handleChange}
                      placeholder="name@example.com" 
                      style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e1dbcf', outline: 'none', textAlign: 'left', backgroundColor: '#faf9f6' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#1a2a4a', fontWeight: '600', fontSize: '0.95rem' }}>رقم الجوال</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone} 
                      onChange={handleChange}
                      placeholder="77xxxxxxx" 
                      style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e1dbcf', outline: 'none', textAlign: 'left', backgroundColor: '#faf9f6' }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#1a2a4a', fontWeight: '600', fontSize: '0.95rem' }}>تخصيص مساهمتك إلى</label>
                  <select 
                    name="project" 
                    value={formData.project} 
                    onChange={handleChange}
                    style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e1dbcf', backgroundColor: '#faf9f6', outline: 'none', fontSize: '0.95rem' }}
                  >
                    <option value="عام">تبرع عام لأنشطة الخلية كافة</option>
                    {(projects || []).map((proj) => (
                      <option key={proj.id || proj._id} value={proj.title}>{proj.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#1a2a4a', fontWeight: '600', fontSize: '0.95rem' }}>مبلغ التبرع ($ أو ما يعادله)</label>
                  <input 
                    type="number" 
                    name="amount"
                    value={formData.amount} 
                    onChange={handleChange}
                    placeholder="حدد قيمة مساهمتك الكريمة بالدولار" 
                    style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e1dbcf', outline: 'none', fontSize: '1.1rem', fontWeight: 'bold', backgroundColor: '#faf9f6' }}
                    required
                  />
                </div>

                {/* طرق الدفع المطورة */}
                <div>
                  <label style={{ display: 'block', marginBottom: '12px', color: '#1a2a4a', fontWeight: '600', fontSize: '0.95rem' }}>طريقة الدفع المناسبة</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                    
                    {/* خيار الكريمي */}
                    <label style={{ 
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', 
                      border: formData.paymentMethod === 'kuraimi' ? '2.5px solid #c4a35a' : '1px solid #e1dbcf', 
                      borderRadius: '14px', padding: '14px', cursor: 'pointer', 
                      backgroundColor: formData.paymentMethod === 'kuraimi' ? '#fdfbf7' : '#ffffff',
                      boxShadow: formData.paymentMethod === 'kuraimi' ? '0 5px 15px rgba(196, 163, 90, 0.1)' : 'none',
                      transition: 'all 0.2s'
                    }}>
                      <input type="radio" name="paymentMethod" value="kuraimi" checked={formData.paymentMethod === 'kuraimi'} onChange={handleChange} style={{ display: 'none' }} />
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#005a9c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: '900' }}>KIB</span>
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#1a2a4a' }}>الكريمي موني</span>
                    </label>

                    {/* خيار الفيزا */}
                  

                    {/* خيار بايبال */}
                 

                  </div>
                </div>

                {/* الحقول الديناميكية للكريمي */}
                {formData.paymentMethod === 'kuraimi' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px', backgroundColor: '#f4f7f6', borderRadius: '14px', border: '1px solid #e1dbcf' }}>
                    
                    {/* حساب المنصة الثابت للتحويل */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: '#ffffff', padding: '15px', borderRadius: '10px', border: '1px solid #d3cbbe' }}>
                      <div style={{ width: '45px', height: '45px', borderRadius: '10px', backgroundColor: '#005a9c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className="fas fa-university" style={{ color: '#fff', fontSize: '1.25rem' }}></i>
                      </div>
                      <div style={{ flexGrow: 1 }}>
                        <span style={{ fontSize: '0.75rem', color: '#7f8c8d', display: 'block', marginBottom: '2px' }}>حساب المنصة للتحويل المباشر</span>
                        <strong style={{ fontSize: '1.1rem', color: '#1a2a4a', letterSpacing: '0.5px', display: 'block' }}>3014256382</strong>
                        <span style={{ fontSize: '0.8rem', color: '#606f7b', display: 'block', marginTop: '2px' }}>باسم: مؤسسة خلية الأعمال الإنسانية</span>
                      </div>
                    </div>

                    {/* حقل رفع السند */}
                    <div>
                      <span style={{ display: 'block', marginBottom: '8px', color: '#1a2a4a', fontWeight: '600', fontSize: '0.9rem' }}>رفع صورة سند التحويل</span>
                      <label style={{ 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', 
                        border: '2px dashed #c4a35a', padding: '15px', borderRadius: '10px', 
                        cursor: 'pointer', backgroundColor: '#ffffff', transition: 'all 0.3s'
                      }}>
                        <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} required />
                        <i className="fas fa-cloud-upload-alt" style={{ color: '#c4a35a', fontSize: '1.4rem' }}></i>
                        <span style={{ fontSize: '0.9rem', color: '#606f7b', fontWeight: 'bold' }}>
                          {receiptName ? `مرفق: ${receiptName}` : 'اختر صورة السند من جهازك'}
                        </span>
                      </label>
                    </div>

                  </div>
                )}

                <button 
                  type="submit" 
                  style={{ width: '100%', padding: '16px', backgroundColor: '#1a2a4a', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', transition: 'all 0.3s', marginTop: '12px', boxShadow: '0 8px 25px rgba(26, 42, 74, 0.15)' }}
                >
                  إرسال تبرع آمن الآن
                </button>
              </form>
            </div>

            {/* قسم المشاريع الديناميكية */}
            <div>
              <h3 style={{ color: '#1a2a4a', marginBottom: '30px', fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '5px', height: '22px', backgroundColor: '#1a2a4a', borderRadius: '3px', display: 'inline-block' }}></span>
                مشاريع بحاجة لدعمكم العاجل
              </h3>
              
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
                  <p>جاري تحميل المشاريع الحالية...</p>
                </div>
              ) : (
                (projects || []).map((proj) => {
                  const progressPercentage = proj.target > 0 
                    ? Math.min(Math.round(((proj.raised || 0) / proj.target) * 100), 100) 
                    : 0;

                  return (
                    <div key={proj.id || proj._id} style={{ 
                      backgroundColor: '#fff', 
                      borderRadius: '18px', 
                      padding: '25px', 
                      marginBottom: '22px', 
                      boxShadow: '0 10px 25px rgba(26, 42, 74, 0.02)', 
                      border: '1px solid #f1ece1',
                      borderRight: '5px solid #c4a35a',
                      transition: 'transform 0.3s'
                    }}>
                      <h4 style={{ color: '#1a2a4a', marginBottom: '12px', fontSize: '1.25rem', fontWeight: 'bold' }}>{proj.title}</h4>
                      <p style={{ color: '#606f7b', fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.7' }}>{proj.description}</p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px', color: '#1a2a4a', fontWeight: 'bold' }}>
                        <span style={{ color: '#c4a35a' }}>تم جمع: {progressPercentage}%</span>
                        <span>المطلوب: ${proj.target ? proj.target.toLocaleString() : 0}</span>
                      </div>
                      
                      <div style={{ width: '100%', height: '10px', backgroundColor: '#faf9f6', borderRadius: '10px', overflow: 'hidden', border: '1px solid #f1ece1' }}>
                        <div style={{ 
                          width: `${progressPercentage}%`, 
                          height: '100%', 
                          background: 'linear-gradient(90deg, #1a2a4a, #c4a35a)',
                          borderRadius: '10px' 
                        }}></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Donation;