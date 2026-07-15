import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // إذا لم يكن هناك هاش، اصعد للأعلى فوراً
    if (!hash) {
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    } else {
      // إعطاء مهلة كافية لتهيئة ورندرة بطاقات المشاريع والأخبار
      const timer = setTimeout(() => {
        const id = hash.replace('#', '');
        
        if (id === 'footer') {
          // إذا كان المطلوب هو الفوتر، يفضل التمرير إلى أقصى أسفل الصفحة مباشرة لضمان عدم توقفه بالمنتصف
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
          });
        } else {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 250); // تم رفع المهلة إلى 250ms لضمان اكتمال تحميل المكونات

      return () => clearTimeout(timer);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;