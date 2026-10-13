import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import './Home.css';

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();

    return (
        <div className="fade-in">
            {/* Hero Section */}
            <div className="home-hero-section text-center">
                <div className="home-hero-glow"></div>
                <div className="container py-4 relative z-10">
                    <span className="hero-pill-badge">
                        Master English from Scratch
                    </span>
                    <h1 className="hero-title">
                        English-as-a-language
                    </h1>
                    <p className="hero-subtitle">
                        Interactive phonics, vocabulary games, guided lessons, and diagnostic tests designed to make learning English joyful and fast.
                    </p>
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                        {isAuthenticated ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="hero-btn-primary"
                            >
                                Continue Learning (Dashboard)
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/register')}
                                className="hero-btn-primary"
                            >
                                Get Started Free
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/placement-test')}
                            className="hero-btn-secondary"
                        >
                            Take Level Test
                        </button>
                    </div>
                </div>
            </div>

            {/* Hebrew Experiential Showcase Section (בתוך div ייעודי עם הסבר עשיר וחווייתי בעברית) */}
            <div className="container py-4">
                <div className="home-hebrew-experience-card" dir="rtl">
                    <div className="home-hebrew-header">
                        <span className="home-hebrew-badge">
                            חוויית למידה ידידותית בעברית • מושלם גם למי שלא יודע מילה באנגלית
                        </span>
                        <h2 className="home-hebrew-title">
                            לומדים אנגלית בקלות, בכיף ובביטחון – מהצעד הראשון וללא ידע מוקדם
                        </h2>
                        <p className="home-hebrew-lead">
                            מרגישים שאנגלית היא שפה זרה, מאיימת או מסובכת? הגעתם בדיוק למקום הנכון! 
                            פיתחנו את פלטפורמת הלמידה במיוחד כדי להעניק לכם חוויה מהנה, פשוטה וצבעונית. 
                            אצלנו לא צריך שום ידע מוקדם – מתחילים בצלילי אותיות האלפבית בליווי ציורים מקסימים והקלטות קול ברורות, 
                            ממשיכים במשחקים מהנים וצבירת נקודות התקדמות, ומקבלים ליווי צמוד עד שתרגישו בטוחים לדבר, לקרוא ולהבין.
                        </p>
                    </div>

                    <div className="home-hebrew-grid">
                        <div className="home-hebrew-item" onClick={() => navigate('/alphabet')}>
                            <div className="home-hebrew-item-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 20h4l2-6h4l2 6h4" />
                                    <path d="m10 14 2-6 2 6" />
                                </svg>
                            </div>
                            <div className="home-hebrew-item-content">
                                <h4>מתחילים מהיסוד עם אותיות האלפבית בליווי קול וציורים</h4>
                                <p>
                                    לא זוכרים איך נראית האות או איך הוגים אותה? בכל כרטיס אות יש איור צבעוני ידידותי, 
                                    מילה לדוגמה והגייה קולית אמיתית. לוחצים, מקשיבים לצליל ומצליחים בקלות!
                                </p>
                                <span className="home-hebrew-item-link">תרגול אותיות עכשיו &larr;</span>
                            </div>
                        </div>

                        <div className="home-hebrew-item" onClick={() => navigate('/games')}>
                            <div className="home-hebrew-item-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="6" width="20" height="12" rx="4" />
                                    <line x1="6" y1="12" x2="10" y2="12" />
                                    <line x1="8" y1="10" x2="8" y2="14" />
                                    <circle cx="15" cy="11" r="1" />
                                    <circle cx="17" cy="13" r="1" />
                                </svg>
                            </div>
                            <div className="home-hebrew-item-content">
                                <h4>למידה דרך משחק והנאה</h4>
                                <p>
                                    במקום שינון יבש של מילים – לומדים דרך חידונים קלילים, משחקי מילים 
                                    ותרגולים אינטראקטיביים שהופכים כל דקת למידה לחווייתית וממכרת.
                                </p>
                                <span className="home-hebrew-item-link">משחקי למידה &larr;</span>
                            </div>
                        </div>

                        <div className="home-hebrew-item" onClick={() => navigate('/placement-test')}>
                            <div className="home-hebrew-item-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <circle cx="12" cy="12" r="6" />
                                    <circle cx="12" cy="12" r="2" />
                                </svg>
                            </div>
                            <div className="home-hebrew-item-content">
                                <h4>מבדק רמה אישי בלי לחץ</h4>
                                <p>
                                    רוצים לדעת מאיזה שלב הכי מתאים לכם להתחיל? מבדק הרמה שלנו מאבחן את נקודת הפתיחה המדויקת 
                                    שלכם לפי תקני השפה הבינלאומיים – בלי ציונים מלחיצים, רק הכוונה ידידותית.
                                </p>
                                <span className="home-hebrew-item-link">בדקו את הרמה שלכם &larr;</span>
                            </div>
                        </div>

                        <div className="home-hebrew-item" onClick={() => navigate('/resources')}>
                            <div className="home-hebrew-item-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="2" y1="12" x2="22" y2="12" />
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                </svg>
                            </div>
                            <div className="home-hebrew-item-content">
                                <h4>מילונים מומלצים וערוצי יוטיוב סבלניים</h4>
                                <p>
                                    ריכזנו עבורכם דף קישורים ייעודי עם מיטב המילונים הבינלאומיים (מרים-וובסטר, אוקספורד, קיימברידג') 
                                    וערוצי יוטיוב סבלניים להאזנה ודיבור (ערוצי רבקה, אינגליש איזי פרקטיס, וארנל) – הכל בליווי הסבר מפורט בעברית!
                                </p>
                                <span className="home-hebrew-item-link">גלו את הקישורים והסרטונים &larr;</span>
                            </div>
                        </div>
                    </div>

                    <div className="home-hebrew-actions">
                        <button
                            onClick={() => navigate('/alphabet')}
                            className="btn-hebrew-primary"
                        >
                            התחילו עכשיו עם אותיות האלפבית
                        </button>
                        <button
                            onClick={() => navigate('/resources')}
                            className="btn-hebrew-secondary"
                        >
                            דף קישורים וסרטונים מומלצים
                        </button>
                        <button
                            onClick={() => navigate('/placement-test')}
                            className="btn-hebrew-secondary"
                        >
                            מבדק רמה אישי וחינמי
                        </button>
                    </div>
                </div>
            </div>

            {/* Feature Cards Section */}
            <div className="container py-5">
                <div className="text-center mb-5">
                    <h2 className="fw-bold mb-2" style={{ fontSize: '2rem', color: 'var(--text-main, #2b3650)' }}>Everything You Need to Succeed</h2>
                    <p style={{ color: 'var(--text-secondary, #475569)' }}>A step-by-step path designed for all proficiency levels</p>
                </div>

                <div className="row g-4">
                    <div className="col-md-6 col-lg-3">
                        <div
                            onClick={() => navigate('/alphabet')}
                            className="feature-card"
                        >
                            <div className="feature-card-icon-wrap">
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 20h4l2-6h4l2 6h4" />
                                    <path d="m10 14 2-6 2 6" />
                                </svg>
                            </div>
                            <h4 className="feature-card-title">Alphabet & Phonics</h4>
                            <p className="feature-card-desc">
                                Interactive audio pronunciation for all 26 letters with illustrated animal cards, phonetics, and speech synthesis.
                            </p>
                            <div className="feature-card-link">
                                Practice letters &rarr;
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-3">
                        <div
                            onClick={() => navigate('/placement-test')}
                            className="feature-card"
                        >
                            <div className="feature-card-icon-wrap">
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <circle cx="12" cy="12" r="6" />
                                    <circle cx="12" cy="12" r="2" />
                                </svg>
                            </div>
                            <h4 className="feature-card-title">Placement Test</h4>
                            <p className="feature-card-desc">
                                Diagnostic questions from Beginner to Advanced pinpointing your exact CEFR level with detailed feedback.
                            </p>
                            <div className="feature-card-link">
                                Start test &rarr;
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-3">
                        <div
                            onClick={() => navigate('/resources')}
                            className="feature-card"
                        >
                            <div className="feature-card-icon-wrap">
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="2" y1="12" x2="22" y2="12" />
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                </svg>
                            </div>
                            <h4 className="feature-card-title">Curated Resources</h4>
                            <p className="feature-card-desc">
                                World-class dictionaries (Merriam-Webster, Oxford, Cambridge) and top YouTube channels with rich Hebrew guides.
                            </p>
                            <div className="feature-card-link">
                                Explore links &rarr;
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-3">
                        <div
                            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                            className="feature-card"
                        >
                            <div className="feature-card-icon-wrap">
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                                    <path d="M4 22h16" />
                                    <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
                                    <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
                                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                                </svg>
                            </div>
                            <h4 className="feature-card-title">XP & Gamified Progress</h4>
                            <p className="feature-card-desc">
                                Earn experience points (XP), level up, track completion rates, and celebrate milestones on your personal dashboard.
                            </p>
                            <div className="feature-card-link">
                                View tracker &rarr;
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Home;
