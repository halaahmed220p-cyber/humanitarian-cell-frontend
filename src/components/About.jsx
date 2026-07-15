export default function About() {
  return (
    <section className="about" id="about">
        <div className="container">
            <div className="section-header">
                <span className="section-label">من نحن</span>
                <h2 className="section-title">نبذة عن <span>خلية الأعمال الإنسانية</span></h2>
            </div>
            <div className="about-grid">
                <div className="about-image">
                    <div className="about-img-main">
                        <i className="fas fa-hand-holding-heart"></i>
                    </div>
                    <div className="about-img-accent">
                        <div className="years">
                            <div className="num">8+</div>
                            <div className="text">سنوات خبرة</div>
                        </div>
                    </div>
                </div>
                <div className="about-content">
                    <h3>رسالتنا هي خدمة الإنسان</h3>
                    <p>
                        خلية إنسانية غير ربحية تعمل في اليمن، تسعى لتعزيز العمل الإغاثي والتنموي بالتنسيق مع الجهات المعنية. نؤمن بأن كل إنسان يستحق الحياة الكريمة، ونعمل بجد لتحقيق هذا الهدف من خلال مشاريعنا المتنوعة.
                    </p>
                    <div className="about-features">
                        <div className="about-feature">
                            <i className="fas fa-check"></i>
                            <span>شفافية كاملة</span>
                        </div>
                        <div className="about-feature">
                            <i className="fas fa-check"></i>
                            <span>تغطية واسعة</span>
                        </div>
                        <div className="about-feature">
                            <i className="fas fa-check"></i>
                            <span>فريق متخصص</span>
                        </div>
                        <div className="about-feature">
                            <i className="fas fa-check"></i>
                            <span>تأثير مستدام</span>
                        </div>
                    </div>
                    <a href="#" className="read-more">
                        اقرأ المزيد
                        <i className="fas fa-arrow-left"></i>
                    </a>
                </div>
            </div>
        </div>
    </section>
  );
}