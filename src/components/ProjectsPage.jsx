const ProjectsPage = () => {
  return (
    <div dir="rtl">
      <h1>اختبار الخريطة</h1>
      {/* هذا مجرد اختبار بسيط للتأكد أن المكون يظهر */}
      <div style={{ background: 'red', width: '100%', height: '100px' }}>
        إذا ظهر هذا المربع الأحمر، فالمشكلة ليست في استدعاء المكون!
      </div>
      <MapComponent /> 
    </div>
  );
};