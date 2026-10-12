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
                        ⚡
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
