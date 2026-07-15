export default function Hero() {
  return (
    <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-pattern"></div>
        <div className="hero-content">
            <div className="hero-text">
                <div className="hero-badge">
                    <i className="fas fa-heart"></i>
                    منظمة إنسانية غير ربحية
                </div>
                <h1 className="hero-title">
                    نعمل من أجل إنسانٍ<br />يستحق <span>الحياة الكريمة</span>
                </h1>
                <p className="hero-desc">
                    خلية إنسانية غير ربحية تعمل في اليمن، تسعى لتعزيز العمل الإغاثي والتنموي بالتنسيق مع الجهات المعنية.
                </p>
                <div className="hero-buttons">
                    <a href="#about" className="btn btn-primary">
                        <i className="fas fa-arrow-left"></i>
                        تعرف علينا
                    </a>
                    <a href="#projects" className="btn btn-outline">
                        <i className="fas fa-hand-holding-heart"></i>
                        مشاريعنا
                    </a>
                </div>
            </div>
            <div className="hero-visual">
                <div className="hero-image-wrapper">
                    <div className="hero-image">
                        <i className="fas fa-hands-holding-child"></i>
                    </div>
                    <div className="floating-card card-1">
                        <div className="icon">
                            <i className="fas fa-users"></i>
                        </div>
                        <div className="info">
                            <h4>المستفيدين</h4>
                            <p>+50,000</p>
                        </div>
                    </div>
                    <div className="floating-card card-2">
                        <div className="icon">
                            <i className="fas fa-project-diagram"></i>
                        </div>
                        <div className="info">
                            <h4>المشاريع</h4>
                            <p>+120</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}