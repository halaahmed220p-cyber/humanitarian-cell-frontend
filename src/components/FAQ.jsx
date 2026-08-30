import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const FAQ = () => {
  // حالة لتخزين رقم السؤال المفتوح حالياً (null يعني لا يوجد سؤال مفتوح)
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "ما هي خلية الأعمال الإنسانية؟",
      answer: "خلية الأعمال الإنسانية (HAC) هي منصة تنموية وإنسانية تهدف إلى تنظيم وتنسيق التدخلات الإنسانية والخدمية، وربط المتبرعين بالمشاريع الأكثر احتياجاً في مختلف المحافظات."
    },
    {
      question: "ما هي البرامج الأربعة؟",
      answer: "تتوزع مشاريعنا على أربعة برامج رئيسية تخدم القطاعات الإنسانية والخدمية الأساسية لتلبية احتياجات المجتمعات المستهدفة."
    },
    {
      question: "ما هي المشاريع الموسمية الثمانية؟",
      answer: "هي حزمة من المشاريع الإنسانية والدورية التي يتم إطلاقها في مواسم محددة (مثل رمضان، الأضاحي، الحقيبة المدرسية، الشتاء، وغيرها) لتخفيف الأعباء عن العائلات."
    },
    {
      question: "كيف أجد مشروعاً محدداً؟",
      answer: "يمكنك استخدام قسم 'محفظة المشاريع' أو صفحة 'البرامج' للبحث عن المشاريع وتصفيتها حسب المحافظة أو البرنامج بكل سهولة."
    },
    {
      question: "كيف أقدم بلاغاً؟",
      answer: "عبر الانتقال إلى صفحة 'الآراء والبلاغات'، حيث يمكنك تعبئة نموذج البلاغ وتحديد موقعك الجغرافي (GPS) بدقة لضمان سرعة استجابة الفريق الميداني."
    },
    {
      question: "هل يمكنني طرح رأي أو مقترح؟",
      answer: "نعم، بالتأكيد! خصصنا صفحة 'الآراء والبلاغات' لاستقبال كافة مقترحاتكم التطويرية وآرائكم لتعزيز كفاءة العمل الإنساني."
    },
    {
      question: "كيف أتبرع؟",
      answer: "يمكنك الضغط على زر 'تبرع الآن' في أعلى الصفحة والاطلاع على وسائل التبرع المتاحة والمشاريع التي تحتاج إلى دعم عاجل."
    },
    {
      question: "كيف أتابع تبرعي؟",
      answer: "يتيح لك النظام إمكانية متابعة نسبة الإنجاز للمشاريع التي ساهمت فيها وتحديثات سير العمل الميداني أولاً بأول."
    },
    {
      question: "هل HAC AI موظف بشري؟",
      answer: "لا، HAC AI هو مساعد ذكاء اصطناعي مصمم خصيصاً للإجابة على استفسارات الزوار وربطهم بقاعدة معرفة المنصة المعتمدة على مدار الساعة."
    },
    {
      question: "كيف أتواصل مع HAC؟",
      answer: "يمكنك زيارة صفحة 'تواصل معنا' أو إرسال بلاغك أو مقترحك مباشرة عبر صفحة الآراء والبلاغات المتاحة في القائمة الرئيسية."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Header />

      <div style={{ padding: '60px 20px', backgroundColor: '#f8fafc', minHeight: '85vh', direction: 'rtl' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* رأس الصفحة */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', display: 'inline-block', marginBottom: '15px' }}>
              الأسئلة الشائعة
            </span>
            <h2 style={{ color: '#0b1d3a', fontSize: '32px', fontWeight: 'bold', marginBottom: '12px' }}>
              إجابات مباشرة ومنظمة
            </h2>
            <p style={{ color: '#64748b', fontSize: '14.5px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
              الأسئلة مصاغة خصيصة خدمة للزوار، وربط لطحناً بقاعدة معرفة HAC AI المعتمدة.
            </p>
          </div>

          {/* قائمة الأسئلة بنظام عمودين */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '20px' }}>
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index}
                  style={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0', 
                    overflow: 'hidden',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    style={{
                      width: '100%',
                      padding: '18px 20px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      textAlign: 'right',
                      outline: 'none'
                    }}
                  >
                    <span style={{ color: '#0b1d3a', fontSize: '15px', fontWeight: 'bold' }}>
                      {faq.question}
                    </span>
                    {isOpen ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#64748b" />}
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 20px 18px 20px', color: '#475569', fontSize: '14px', lineHeight: '1.7', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default FAQ;