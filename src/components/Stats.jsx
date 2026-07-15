import { useEffect, useRef } from 'react';

export default function Stats() {
    // نستخدم useRef للإشارة إلى حاوية الإحصائيات
    const statsRef = useRef(null);

    useEffect(() => {
        const counters = document.querySelectorAll('.counter');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };
            updateCounter();
        };

        const observerOptions = { threshold: 0.5 };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // عندما يظهر القسم، نقوم بتشغيل العداد لكل عنصر
                    counters.forEach(c => animateCounter(c));
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        // تنظيف الـ Observer عند إغلاق المكون
        return () => observer.disconnect();
    }, []);

    return (
        <section className="stats" ref={statsRef}>
            <div className="container">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon"><i className="fas fa-project-diagram"></i></div>
                        <div className="stat-number">+<span className="counter" data-target="120">0</span></div>
                        <div className="stat-label">مشروع منفذ</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><i className="fas fa-users"></i></div>
                        <div className="stat-number">+<span className="counter" data-target="50000">0</span></div>
                        <div className="stat-label">مستفيد</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><i className="fas fa-hand-holding-heart"></i></div>
                        <div className="stat-number">+<span className="counter" data-target="350">0</span></div>
                        <div className="stat-label">متطوع</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><i className="fas fa-map-marker-alt"></i></div>
                        <div className="stat-number"><span className="counter" data-target="15">0</span></div>
                        <div className="stat-label">محافظة</div>
                    </div>
                </div>
            </div>
        </section>
    );
}