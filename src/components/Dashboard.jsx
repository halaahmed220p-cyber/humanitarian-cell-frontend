import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent'; // المكون الذي أنشأناه قبل قليل

const Dashboard = () => {
  const [projects, setProjects] = useState([]); // هنا سنخزن المشاريع القادمة من قاعدة البيانات
  const [selectedGov, setSelectedGov] = useState(null);

  // دالة لجلب البيانات من قاعدة البيانات (سنكملها لاحقاً)
  const fetchProjects = async (location) => {
    // سنضع هنا رابط الـ API الخاص بك لاحقاً
    console.log("جاري جلب مشاريع محافظة:", location);
  };

  const handleGovClick = (govId) => {
    setSelectedGov(govId);
    fetchProjects(govId);
  };

  return (
    <div className="main-container">
      <div className="map-section">
        <MapComponent 
            onSelectGovernorate={handleGovClick} 
            // سنمرر البيانات هنا لاحقاً
        />
      </div>
      <div className="sidebar">
        {/* هنا سنضع قائمة المشاريع */}
        <div className="panel">
           {selectedGov ? <h3>مشاريع {selectedGov}</h3> : <p>اختر محافظة لعرض المشاريع</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;