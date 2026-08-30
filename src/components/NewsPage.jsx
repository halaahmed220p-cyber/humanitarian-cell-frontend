import React, { useState, useEffect } from 'react';

const ProgramDetail = () => {
  const [newsData, setNewsData] = useState([]);
  const [reportsData, setReportsData] = useState([]);
  const [featuredReport, setFeaturedReport] = useState(null);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // تصحيح رابط الـ Backend الخاص بـ Render (مع التأكد من استخدام اسم خدمة الـ backend الصحيح)
    const API_BASE_URL = 'https://humanitarian-cell-backend.onrender.com';

    fetch(`${API_BASE_URL}/api/news`)
      .then((res) => {
        if (!res.ok) throw new Error('فشل في جلب بيانات الأخبار');
        return res.json();
      })
      .then((data) => {
        setNewsData(data);
        setLoadingNews(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoadingNews(false);
      });

    fetch(`${API_BASE_URL}/api/reports`) 
      .then((res) => {
        if (!res.ok) throw new Error('فشل في جلب بيانات التقارير');
        return res.json();
      })
      .then((data) => {
        const featured = data.find(r => r.is_featured || r.featured) || data[0];
        const ordinaryReports = data.filter(r => r.id !== (featured?.id || null));
        
        setFeaturedReport(featured);
        setReportsData(ordinaryReports);
        setLoadingReports(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingReports(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">تفاصيل البرامج والأنشطة الإنسانية</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            خطأ: {error}
          </div>
        )}

        {/* قسم التقارير المميزة */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">التقرير المميز</h2>
          {loadingReports ? (
            <p className="text-gray-500">جاري تحميل التقارير...</p>
          ) : featuredReport ? (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-bold text-blue-600 mb-2">{featuredReport.title || featuredReport.name}</h3>
              <p className="text-gray-600">{featuredReport.description || featuredReport.summary}</p>
            </div>
          ) : (
            <p className="text-gray-500">لا توجد تقارير متاحة حالياً.</p>
          )}
        </div>

        {/* قسم الأخبار */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">آخر الأخبار</h2>
          {loadingNews ? (
            <p className="text-gray-500">جاري تحميل الأخبار...</p>
          ) : newsData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsData.map((item, index) => (
                <div key={item.id || index} className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-2">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.content || item.snippet}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">لا توجد أخبار متاحة.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;