import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Resources.css';

export interface ExternalResource {
    id: string;
    title: string;
    englishSubtitle: string;
    url: string;
    category: 'dictionary' | 'youtube';
    categoryLabelHe: string;
    badgeColor: string;
    levelTagHe: string;
    hebrewExplanation: {
        summary: string;
        whatItOffers: string;
        whyWeLoveIt: string;
        recommendedFor: string;
        tip: string;
    };
}

export const EXTERNAL_RESOURCES: ExternalResource[] = [
    {
        id: 'merriam-webster',
        title: 'Merriam-Webster Dictionary',
        englishSubtitle: "America's Most Trusted Online Dictionary & Thesaurus",
        url: 'https://www.merriam-webster.com/',
        category: 'dictionary',
        categoryLabelHe: 'מילון אמריקאי רשמי',
        badgeColor: 'badge-dict',
        levelTagHe: 'לכל הרמות • מתחילים עד מתקדמים',
        hebrewExplanation: {
            summary: 'מילון מריאם-וובסטר הוא המילון האמריקאי המוביל והוותיק ביותר בעולם, ונחשב לאסמכתא עליונה לאוצר מילים, הגדרות ואיות נכון.',
            whatItOffers: 'הגדרות בהירות ומפורטות, מילים נרדפות והפכים, השמעת הגייה קולית אמיתית באנגלית אמריקאית, ומשפטי הדגמה רבים הממחישים שימוש טבעי.',
            whyWeLoveIt: 'כולל מדור פופולרי של מילת היום, חידוני מילים אינטראקטיביים והסברים פשוטים למונחים מודרניים.',
            recommendedFor: 'לכל מי שנתקל במילה לא מוכרת ורוצה לדעת איך מבטאים אותה במדויק ואיך להשתמש בה במשפט תקין.',
            tip: 'לחצו על כפתור השמע לצד כל מילה כדי להאזין שוב ושוב לצליל המדויק שלה.'
        }
    },
    {
        id: 'oxford-learners',
        title: "Oxford Learner's Dictionaries",
        englishSubtitle: 'Oxford University Press — Specially Designed for English Learners',
        url: 'https://www.oxfordlearnersdictionaries.com/',
        category: 'dictionary',
        categoryLabelHe: 'מילון אוקספורד לתלמידים',
        badgeColor: 'badge-oxford',
        levelTagHe: 'מותאם במיוחד ללומדי שפה • ממתחילים ועד מתקדמים',
        hebrewExplanation: {
            summary: 'מילון אוקספורד הרשמי לתלמידים נבנה כולו במיוחד עבור לומדי אנגלית כשפה שנייה, בשפה פשוטה וללא ניסוחים מסורבלים.',
            whatItOffers: 'הגדרות קצרות וקולעות, תיוג רשמי של מילים לפי רמות קושי בינלאומיות, והשוואה קולית בין הגייה בריטית לאמריקאית.',
            whyWeLoveIt: 'מכיל רשימה ייעודית של שלושת אלפים המילים החיוניות ביותר שכל לומד אנגלית חייב להכיר כדי לנהל שיחה שוטפת.',
            recommendedFor: 'תלמידים מתחילים ומתקדמים כאחד שמחפשים הסברים נהירים בלי להסתבך עם הגדרות כבדות.',
            tip: 'חפשו את תג הרמה ליד המילה כדי לדעת עד כמה היא נפוצה ובסיסית.'
        }
    },
    {
        id: 'cambridge-dictionary',
        title: 'Cambridge Dictionary',
        englishSubtitle: "Cambridge University Press — Learner's & English-Hebrew Tools",
        url: 'https://dictionary.cambridge.org/',
        category: 'dictionary',
        categoryLabelHe: 'מילון קיימברידג העולמי',
        badgeColor: 'badge-cambridge',
        levelTagHe: 'כולל תרגום לעברית • כל הרמות',
        hebrewExplanation: {
            summary: 'מילון קיימברידג היוקרתי מציע כלי מחקר ושפה מהמעלה הראשונה, כולל תמיכה מעולה בתרגום עברי ישיר והסברי דקדוק ידידותיים.',
            whatItOffers: 'מילון לתלמידים, תרגום ישיר לאנגלית ועברית, טבלאות נטיית פעלים, כללי דקדוק ברורים והסברים על ההבדל בין מילים דומות.',
            whyWeLoveIt: 'ממשק בהיר ונקי עם אפשרות לקבל גם תרגום ישיר לעברית וגם הסבר באנגלית פשוטה על המשמעות.',
            recommendedFor: 'מי שמעדיף לפעמים לראות תרגום עברי ישיר לצד משפטי דוגמה באנגלית.',
            tip: 'בתיבת החיפוש ניתן לבחור באפשרות תרגום עברי כדי לקבל פירוש מהיר ומדויק.'
        }
    },
    {
        id: 'engvid-rebecca',
        title: 'Learn English with Rebecca',
        englishSubtitle: 'Clear, Patient & Methodical Video Lessons for All Levels',
        url: 'https://www.youtube.com/@engVidRebecca',
        category: 'youtube',
        categoryLabelHe: 'ערוץ יוטיוב • שיעורי וידאו עם רבקה',
        badgeColor: 'badge-youtube',
        levelTagHe: 'אידיאלי למתחילים ובינוניים • שיעורי לוח',
        hebrewExplanation: {
            summary: 'ערוץ הווידאו המצליח של המורה רבקה מציע מאות שיעורים מסודרים בהגשה רגועה, איטית, ברורה ומעודדת.',
            whatItOffers: 'הסברים שלב אחר שלב על לוח לבן, טיפים פשוטים לדקדוק ומבנה המשפט, זיהוי ותיקון טעויות נפוצות, והרחבת אוצר מילים יומיומי.',
            whyWeLoveIt: 'רבקה מדברת בקצב נוח במיוחד, בהגייה ברורה ומלאת סבלנות, כך שגם לומדים מתחילים מצליחים לעקוב ולהבין בקלות.',
            recommendedFor: 'למי שמעדיף ללמוד כאילו יש לו מורה פרטית סבלנית שמסבירה כל נושא לאט ובפשטות.',
            tip: 'הפעילו את הכתוביות ביוטיוב — שילוב הקול עם הטקסט הכתוב יאיץ את קליטת השפה.'
        }
    },
    {
        id: 'english-easy-practice',
        title: 'English Easy Practice',
        englishSubtitle: 'Listen & Repeat — Real Life Conversational Stories',
        url: 'https://www.youtube.com/@EnglishEasyPractice',
        category: 'youtube',
        categoryLabelHe: 'ערוץ יוטיוב • תרגול האזנה ודיבור',
        badgeColor: 'badge-youtube',
        levelTagHe: 'ממוקד דיבור ושטף • שאלות ותשובות',
        hebrewExplanation: {
            summary: 'ערוץ מומלץ ביותר לשיפור יכולת הדיבור וההאזנה באמצעות שיטת הקשב וחזור עם סיפורים קצרים מהחיים.',
            whatItOffers: 'סרטונים אינטראקטיביים עם כתוביות ברורות, שאלות מנחות על סיפורים קצרים, וזמן ייעודי המאפשר לכם לענות בקול רם.',
            whyWeLoveIt: 'במקום לשנן חוקי דקדוק יבשים, מתרגלים שיחה טבעית ומפתחים רפלקס דיבור באנגלית בלי צורך לתרגם בראש מעברית.',
            recommendedFor: 'מי שרוצה לשבור את מחסום הדיבור, לשפר את המבטא ולדבר בביטחון.',
            tip: 'אל תסתפקו בהאזנה בלבד — חזרו בקול רם על כל משפט כפי שהקריין מנחה בסרטון.'
        }
    },
    {
        id: 'arnels-everyday-english',
        title: "Arnel's Everyday English",
        englishSubtitle: 'Natural, Lively English & Real Daily Conversations',
        url: 'https://www.youtube.com/@ArnelsEverydayEnglish',
        category: 'youtube',
        categoryLabelHe: 'ערוץ יוטיוב • אנגלית יומיומית וחיה',
        badgeColor: 'badge-youtube',
        levelTagHe: 'בינוני ומתקדם • ביטויים ושיחות אמיתיות',
        hebrewExplanation: {
            summary: 'הערוץ התוסס והפופולרי של ארנל מלמד את האנגלית האמיתית שמדברים ברחוב, בסדרות ובשיחות עם חברים.',
            whatItOffers: 'ביטויים נפוצים, צירופי מילים שימושיים, השוואות בין אנגלית רשמית לאופן שבו אנשים באמת מדברים, וטיפים לביטחון עצמי.',
            whyWeLoveIt: 'הגשה אנרגטית, מלאת הומור וסרטונים קצרים וקליטים שנעים לצפות בהם בכל שעה ביום.',
            recommendedFor: 'לומדים שרוצים להישמע טבעיים, להבין סרטים ושיחות חופשיות ולהפסיק להישמע כמו ספר דקדוק.',
            tip: 'בחרו ביטוי אחד חדש מכל סרטון ונסו לתרגל אותו במהלך היום.'
        }
    }
];

export const Resources: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'dictionary' | 'youtube'>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const filteredResources = useMemo(() => {
        return EXTERNAL_RESOURCES.filter((res) => {
            const matchesCategory = selectedCategory === 'all' || res.category === selectedCategory;
            const query = searchQuery.trim().toLowerCase();
            if (!query) return matchesCategory;

            const matchesText =
                res.title.toLowerCase().includes(query) ||
                res.englishSubtitle.toLowerCase().includes(query) ||
                res.categoryLabelHe.includes(query) ||
                res.hebrewExplanation.summary.includes(query) ||
                res.hebrewExplanation.whatItOffers.includes(query) ||
                res.hebrewExplanation.whyWeLoveIt.includes(query) ||
                res.hebrewExplanation.recommendedFor.includes(query);

            return matchesCategory && matchesText;
        });
    }, [selectedCategory, searchQuery]);

    return (
        <div className="resources-page fade-in">
            {/* Header / Hero Section */}
            <div className="resources-hero text-center">
                <div className="resources-hero-glow"></div>
                <div className="container py-4 relative z-10">
                    <span className="resources-pill-badge">
                        Recommended External Resources & Guides
                    </span>
                    <h1 className="resources-hero-title">
                        קישורים ומקורות לימוד מומלצים
                    </h1>
                    <p className="resources-hero-subtitle">
                        ריכזנו עבורכם את מיטב המילונים הבינלאומיים וערוצי הווידאו המובילים בעולם, 
                        עם הסבר מפורט בעברית לכל קישור – כדי שתוכלו להעשיר את האנגלית שלכם בביטחון ובכיף.
                    </p>

                    {/* Quick navigation helpers */}
                    <div className="resources-quick-nav d-flex justify-content-center gap-2 flex-wrap">
                        <button
                            onClick={() => navigate('/alphabet')}
                            className="btn-quick-nav"
                        >
                            אותיות האלפבית
                        </button>
                        <button
                            onClick={() => navigate('/placement-test')}
                            className="btn-quick-nav"
                        >
                            מבדק רמה
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="btn-quick-nav"
                        >
                            חזרה לדף הבית
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container py-5">
                {/* Search & Filter Toolbar */}
                <div className="resources-toolbar mb-4">
                    <div className="resources-filters d-flex gap-2 flex-wrap justify-content-center">
                        <button
                            type="button"
                            className={`resources-filter-pill ${selectedCategory === 'all' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('all')}
                        >
                            כל הקישורים ({EXTERNAL_RESOURCES.length})
                        </button>
                        <button
                            type="button"
                            className={`resources-filter-pill ${selectedCategory === 'dictionary' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('dictionary')}
                        >
                            מילונים מובילים (3)
                        </button>
                        <button
                            type="button"
                            className={`resources-filter-pill ${selectedCategory === 'youtube' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('youtube')}
                        >
                            ערוצי יוטיוב מומלצים (3)
                        </button>
                    </div>

                    <div className="resources-search-wrap mt-3">
                        <input
                            type="text"
                            placeholder="חיפוש לפי שם, מילון, יוטיוב, או נושא..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="resources-search-input"
                            dir="rtl"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                className="resources-search-clear"
                                onClick={() => setSearchQuery('')}
                                title="נקה חיפוש"
                            >
                                &times;
                            </button>
                        )}
                    </div>
                </div>

                {/* Resources Cards Grid */}
                {filteredResources.length === 0 ? (
                    <div className="resources-empty text-center py-5">
                        <div className="resources-empty-icon mb-3">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </div>
                        <h3>לא נמצאו קישורים מתאימים לחיפוש</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            נסו לחפש מילה אחרת או נקו את שורת החיפוש.
                        </p>
                        <button
                            className="button button-primary button-pill mt-2"
                            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                        >
                            הצג את כל הקישורים
                        </button>
                    </div>
                ) : (
                    <div className="resources-grid">
                        {filteredResources.map((res) => (
                            <div key={res.id} className="resource-card">
                                {/* Card Header with Category & Level */}
                                <div className="resource-card-header">
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <span className={`resource-category-tag ${res.badgeColor}`}>
                                            {res.categoryLabelHe}
                                        </span>
                                        <span className="resource-level-pill">
                                            {res.levelTagHe}
                                        </span>
                                    </div>
                                    <h3 className="resource-title" dir="ltr">{res.title}</h3>
                                    <p className="resource-subtitle" dir="ltr">{res.englishSubtitle}</p>
                                </div>

                                {/* External Direct Link Button */}
                                <div className="resource-action-banner">
                                    <a
                                        href={res.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="resource-external-btn"
                                        title={`פתח את ${res.title} בחלון חדש`}
                                    >
                                        <span>מעבר לאתר הרשמי</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                            <polyline points="15 3 21 3 21 9" />
                                            <line x1="10" y1="14" x2="21" y2="3" />
                                        </svg>
                                    </a>
                                    <span className="resource-url-pill" dir="ltr">
                                        {res.url.replace(/^https?:\/\//, '')}
                                    </span>
                                </div>

                                {/* Hebrew Information Div */}
                                <div className="resource-hebrew-box" dir="rtl">
                                    <div className="resource-hebrew-badge">
                                        מידע והסבר מפורט
                                    </div>

                                    <p className="resource-hebrew-summary">
                                        {res.hebrewExplanation.summary}
                                    </p>

                                    <div className="resource-detail-row">
                                        <strong>מה האתר מציע:</strong>
                                        <span>{res.hebrewExplanation.whatItOffers}</span>
                                    </div>

                                    <div className="resource-detail-row">
                                        <strong>למה כדאי להשתמש:</strong>
                                        <span>{res.hebrewExplanation.whyWeLoveIt}</span>
                                    </div>

                                    <div className="resource-detail-row">
                                        <strong>למי זה מתאים:</strong>
                                        <span>{res.hebrewExplanation.recommendedFor}</span>
                                    </div>

                                    <div className="resource-hebrew-tip">
                                        <strong>טיפ שימושי:</strong> {res.hebrewExplanation.tip}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Bottom Call to Action Box in Hebrew */}
                <div className="resources-bottom-banner mt-5 text-center" dir="rtl">
                    <div className="resources-bottom-badge">
                        צעד אחר צעד לשליטה באנגלית
                    </div>
                    <h3 className="resources-bottom-title">
                        רוצים להתחיל ללמוד כבר עכשיו באתר?
                    </h3>
                    <p className="resources-bottom-desc">
                        האתר שלנו מלווה אתכם מהבסיס המוחלט – החל מאותיות האלפבית וציורים ידידותיים עם הגייה קולית, 
                        ועד מבדק רמה מקיף המותאם לתקן הבינלאומי.
                    </p>
                    <div className="d-flex justify-content-center gap-3 flex-wrap mt-3">
                        <button
                            onClick={() => navigate('/alphabet')}
                            className="button button-primary button-lg button-pill"
                        >
                            התחילו עם לימוד אותיות האלפבית
                        </button>
                        <button
                            onClick={() => navigate('/placement-test')}
                            className="button button-outline button-lg button-pill"
                        >
                            עברו מבדק רמה חינמי
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Resources;
