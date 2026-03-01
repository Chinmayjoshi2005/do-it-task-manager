import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer__content">
                <div className="footer__brand">
                    <div className="footer__logo">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px' }}>
                            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#6366f1" />
                            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#a5b4fc" strokeWidth="1.5" fill="none" />
                        </svg>
                        DO IT
                    </div>
                    <p className="footer__tagline">Organize your tasks, build momentum.</p>
                </div>

                <div className="footer__socials">
                    <a href="https://github.com/Chinmayjoshi2005" target="_blank" rel="noreferrer" className="footer__social-link" aria-label="GitHub">
                        <Github size={20} />
                    </a>
                    <a href="https://x.com/Chinmay30Joshi" target="_blank" rel="noreferrer" className="footer__social-link" aria-label="Twitter">
                        <Twitter size={20} />
                    </a>
                    <a href="https://www.linkedin.com/in/chinu-30n/" target="_blank" rel="noreferrer" className="footer__social-link" aria-label="LinkedIn">
                        <Linkedin size={20} />
                    </a>
                    <a href="mailto:chinmay30joshi@gmail.com" className="footer__social-link" aria-label="Email">
                        <Mail size={20} />
                    </a>
                </div>
            </div>
            <div className="footer__bottom">
                <p>&copy; {currentYear} DO IT Task Manager. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
