import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useProgressApi } from '../hooks/useProgressApi';

// =========================================================================
// מאגר השאלות של מבחן הרמה (Placement Test)
// כל שאלה כוללת:
// - id: מזהה ייחודי
// - question: שאלת המבחן באנגלית
// - options: מערך עם 4 אפשרויות בחירה (אינדקסים 0, 1, 2, 3)
// - answer: האינדקס של התשובה הנכונה בתוך מערך האפשרויות options
//           למשל: answer: 0 אומר שהאפשרות הראשונה (אינדקס 0) היא הנכונה!
//           למשל: answer: 1 אומר שהאפשרות השנייה (אינדקס 1) היא הנכונה!
// - level: רמת השאלה (מתחילים, בינוני, מתקדמים)
// =========================================================================
const QUESTIONS = [
    {
        id: 1,
        question: "Choose the correct sentence:",
        options: [
            "She go to school every day.",      // אינדקס 0
            "She goes to school every day.",    // אינדקס 1 (תשובה נכונה - Present Simple גוף שלישי)
            "She going to school every day.",   // אינדקס 2
            "She gone to school every day."     // אינדקס 3
        ],
        answer: 1, // התשובה הנכונה היא באינדקס 1 (האפשרות השנייה)
        level: "Beginner"
    },
    {
        id: 2,
        question: "What is the opposite of 'Ancient'?",
        options: [
            "Old",       // אינדקס 0
            "Modern",    // אינדקס 1 (תשובה נכונה - ההפך מעתיק זה מודרני)
            "Historic",  // אינדקס 2
            "Antique"    // אינדקס 3
        ],
        answer: 1, // התשובה הנכונה היא באינדקס 1 (האפשרות השנייה)
        level: "Beginner"
    },
    {
        id: 3,
        question: "If I _______ more time, I would learn a new language.",
        options: [
            "have",      // אינדקס 0
            "had",       // אינדקס 1 (תשובה נכונה - Second Conditional)
            "will have", // אינדקס 2
            "am having"  // אינדקס 3
        ],
        answer: 1, // התשובה הנכונה היא באינדקס 1 (האפשרות השנייה)
        level: "Intermediate"
    },
    {
        id: 4,
        question: "Which word means 'able to withstand or recover quickly from difficult conditions'?",
        options: [
            "Fragile",    // אינדקס 0
            "Resilient",  // אינדקס 1 (תשובה נכונה - חוסן / התאוששות מהירה)
            "Rigid",      // אינדקס 2
            "Vulnerable"  // אינדקס 3
        ],
        answer: 1, // התשובה הנכונה היא באינדקס 1 (האפשרות השנייה)
        level: "Intermediate"
    },
    {
        id: 5,
        question: "Hardly _______ the station when the train pulled in.",
        options: [
            "had we reached", // אינדקס 0 (תשובה נכונה - היפוך מבנה Inversion באנגלית מתקדמת)
            "we had reached", // אינדקס 1
            "did we reached", // אינדקס 2
            "we reached"      // אינדקס 3
        ],
        answer: 0, // התשובה הנכונה היא באינדקס 0 (האפשרות הראשונה ברשימה!)
        level: "Advanced"
    },
    {
        id: 6,
        question: "The CEO was accused of being _______ when she refused to change her flawed plan.",
        options: [
            "Obstinate",    // אינדקס 0 (תשובה נכונה - עקשנית / מסרבת להשתנות)
            "Compliant",    // אינדקס 1
            "Magnanimous",  // אינדקס 2
            "Gregarious"    // אינדקס 3
        ],
        answer: 0, // התשובה הנכונה היא באינדקס 0 (האפשרות הראשונה ברשימה!)
        level: "Advanced"
    }
];

// =========================================================================
// קומפוננטת מבחן הרמה
// =========================================================================
export const PlacementTest = () => {
    // הוק לניווט בין דפים באפליקציה ללא רענון דף
    const navigate = useNavigate();

    // שליפת סטטוס התחברות המשתמש מתוך ה-store של Zustand
    const { isAuthenticated } = useAuthStore();

    // שליפת פונקציית עדכון התקדמות ומצב טעינה מה-Hook המותאם אישית
    const { fetchUpdateProgress, loading } = useProgressApi();

    // סטייט שמחזיק את אינדקס השאלה הנוכחית שהמשתמש רואה (מתחיל ב-0 = השאלה הראשונה)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // סטייט שמחזיק את האינדקס של האפשרות שהמשתמש בחר כרגע (null = המשתמש עדיין לא בחר כלום)
    const [selectedOption, setSelectedOption] = useState(null);

    // סטייט שמחזיק את כמות התשובות הנכונות שהמשתמש צבר עד עכשיו (מתחיל ב-0)
    const [score, setScore] = useState(0);

    // סטייט בוליאני שמציין האם סיימנו את כל השאלות במבחן
    const [isFinished, setIsFinished] = useState(false);

    // סטייט בוליאני שמציין האם תוצאות המבחן נשמרו בהצלחה בשרת
    const [saveResult, setSaveResult] = useState(false);

    // שליפת השאלה הנוכחית מתוך מערך השאלות לפי האינדקס הנוכחי
    const currentQuestion = QUESTIONS[currentQuestionIndex];

    // פונקציה שנקראת כאשר המשתמש לוחץ על אחת מ-4 האפשרויות בשאלה
    const handleSelectOption = (index) => {
        // שמירת אינדקס האפשרות שנלחצה בסטייט
        setSelectedOption(index);
    };

    // פונקציה שנקראת בלחיצה על כפתור "Next Question" או "Finish Test"
    const handleNext = async () => {
        // בדיקה האם הבחירה של המשתמש שווה לאינדקס התשובה הנכונה המוגדרת בשאלה
        const isCorrect = selectedOption === currentQuestion.answer;

        // אם המשתמש צדק - מגדילים את הניקוד ב-1, אחרת משאירים את הניקוד הקודם
        const newScore = isCorrect ? score + 1 : score;
        setScore(newScore);

        // איפוס הבחירה לקראת השאלה הבאה (כדי שהשאלה הבאה לא תגיע עם תשובה מסומנת)
        setSelectedOption(null);

        // בדיקה האם נשארו עוד שאלות במבחן
        if (currentQuestionIndex + 1 < QUESTIONS.length) {
            // עוברים לשאלה הבאה על ידי הגדלת אינדקס השאלה ב-1
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // הגענו לסוף המבחן - מסמנים שהמבחן הסתיים
            setIsFinished(true);

            // חישוב אחוז ההצלחה במבחן (בין 0 ל-100)
            const percentage = Math.round((newScore / QUESTIONS.length) * 100);
            
            // במידה והמשתמש מחובר למערכת - נשמור את התוצאה בשרת
            if (isAuthenticated) {
                // שליחת בקשת PATCH לעדכון ציון מבחן הרמה ותוספת נקודות XP בשרת
                const res = await fetchUpdateProgress({
                    placementTestScore: percentage,
                    xpToAdd: newScore * 20
                });
                // אם העדכון בשרת הצליח - נציג הודעה שהמידע נשמר בהצלחה
                if (res) setSaveResult(true);
            }
        }
    };

    // חישוב אחוז ההצלחה הכולל על בסיס הניקוד הסופי
    const percentage = Math.round((score / QUESTIONS.length) * 100);

    // קביעת הרמה בהתאם לאחוז ההצלחה
    let assignedLevel = "Beginner";
    if (percentage > 80) assignedLevel = "Advanced";
    else if (percentage > 50) assignedLevel = "Intermediate";

    // =====================================================================
    // מסך תוצאות (מוצג ברגע שהמשתמש סיים לענות על כל השאלות)
    // =====================================================================
    if (isFinished) {
        return (
            <div className="container py-5 max-w-2xl mx-auto">
                <div className="card shadow-lg border-0 rounded-4 overflow-hidden p-5 text-center">
                    <div className="text-6xl mb-4"></div>
                    <h2 className="fw-bold mb-3 text-dark">Placement Test Completed!</h2>
                    <p className="text-muted fs-5 mb-4">Here are your diagnostic results:</p>

                    {/* הצגת הציון באחוזים וכמות התשובות הנכונות */}
                    <div className="bg-light p-4 rounded-4 mb-4">
                        <div className="display-4 fw-bold text-primary mb-2">{percentage}%</div>
                        <div className="text-muted">You answered {score} out of {QUESTIONS.length} correctly.</div>
                        <hr className="my-3" />
                        <div className="fs-5">
                            Assigned Level: <span className="badge bg-success px-3 py-2 fs-6">{assignedLevel}</span>
                        </div>
                    </div>

                    {/* הצגת הודעת שמירה למשתמש מחובר או הצעה להירשם לאורח */}
                    {isAuthenticated ? (
                        saveResult ? (
                            <div className="alert alert-success py-2 mb-4">
                                Result saved to your dashboard! XP added.
                            </div>
                        ) : loading ? (
                            <div className="spinner-border text-primary mx-auto mb-4" role="status"></div>
                        ) : null
                    ) : (
                        <div className="alert alert-info py-2 mb-4">
                            Want to save your progress and level? Please register or login!
                        </div>
                    )}

                    {/* כפתורי פעולה בסיום המבחן */}
                    <div className="d-flex justify-content-center gap-3">
                        {/* כפתור למעבר לדשבורד (או להרשמה אם מדובר באורח) */}
                        <button
                            className="btn btn-primary px-4 py-2 rounded-3 shadow-sm hover:scale-105 transition-all"
                            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
                        >
                            {isAuthenticated ? 'Go to Dashboard' : 'Create an Account'}
                        </button>
                        {/* כפתור לביצוע המבחן מחדש ואיפוס כל הסטייטים */}
                        <button
                            className="btn btn-outline-secondary px-4 py-2 rounded-3"
                            onClick={() => {
                                setCurrentQuestionIndex(0);
                                setSelectedOption(null);
                                setScore(0);
                                setIsFinished(false);
                                setSaveResult(false);
                            }}
                        >
                            Retake Test
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // =====================================================================
    // מסך השאלה הפעילה (מוצג במהלך המבחן לכל שאלה ושאלה)
    // =====================================================================
    return (
        <div className="container py-5 max-w-2xl mx-auto">
            <div className="card shadow border-0 rounded-4 p-4 p-md-5">
                {/* כותרת עליונה עם מספר השאלה והרמה שלה */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-secondary-subtle text-secondary fw-semibold">
                        Question {currentQuestionIndex + 1} of {QUESTIONS.length}
                    </span>
                    <span className="badge bg-primary-subtle text-primary fw-semibold">
                        Level: {currentQuestion.level}
                    </span>
                </div>

                {/* פס התקדמות (Progress Bar) שמציג את אחוז ההתקדמות במבחן */}
                <div className="progress mb-4" style={{ height: '8px' }}>
                    <div
                        className="progress-bar bg-primary"
                        role="progressbar"
                        style={{ width: `${((currentQuestionIndex) / QUESTIONS.length) * 100}%` }}
                    ></div>
                </div>

                {/* תוכן השאלה הנוכחית */}
                <h4 className="fw-bold mb-4 text-dark">{currentQuestion.question}</h4>

                {/* רשימת 4 האפשרויות לתשובה */}
                <div className="space-y-3 mb-5">
                    {currentQuestion.options.map((opt, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectOption(idx)}
                            className={`w-full text-start p-3 rounded-3 border transition-all text-base ${
                                selectedOption === idx
                                    ? 'border-primary bg-primary-subtle text-primary fw-semibold shadow-sm'
                                    : 'border-gray-200 hover:bg-gray-50 text-dark'
                            }`}
                        >
                            <span className="me-3 fw-bold">{String.fromCharCode(65 + idx)}.</span>
                            {opt}
                        </button>
                    ))}
                </div>

                {/* כפתור מעבר לשאלה הבאה (חסום כל עוד המשתמש לא בחר תשובה) */}
                <div className="d-flex justify-content-end">
                    <button
                        className="btn btn-primary px-4 py-2 rounded-3"
                        disabled={selectedOption === null || loading}
                        onClick={handleNext}
                    >
                        {currentQuestionIndex + 1 === QUESTIONS.length ? 'Finish Test' : 'Next Question'}
                    </button>
                </div>
            </div>
        </div>
    );
};
