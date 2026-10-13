import React from 'react';
import './Footer.css';

interface Creator {
    id: number;
    name: string;
}

export const Footer: React.FC = () => {
    const creators: Creator[] = [
        { id: 1, name: 'מאיר זילברמן' },
        { id: 2, name: 'שלמה וקסמן' },
        { id: 3, name: 'זיסל סגל' },
    ];

    return (
        <footer className="footer-container">
            <div className="footer-content">
                {/* Brand name & icon */}
                <div className="footer-brand">
                    <span className="footer-icon-badge" title="English as a Language">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                        </svg>
                    </span>
                    <span className="footer-brand-title">
                        English-as-a-language
                    </span>
                </div>

                {/* Creators */}
                <div className="footer-creators-card">
                    <span className="footer-creators-label">יוצרי האתר:</span>
                    <div className="footer-creators-list" dir="rtl">
                        {creators.map((creator) => (
                            <span key={creator.id} className="creator-tag">
                                {creator.id}. {creator.name}
                            </span>
                        ))}
                    </div>
                </div>

                <p className="footer-bottom-text">
                    &copy; {new Date().getFullYear()} English-as-a-language. All rights reserved.
                </p>
            </div>
        </footer>
    );
};
export default Footer;
