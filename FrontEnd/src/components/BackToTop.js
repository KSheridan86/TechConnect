import React, { useState, useEffect } from 'react';

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScroll = () => {
        const scrollTop = document.documentElement.scrollTop;
        setIsVisible(scrollTop > 300);
    };

    const scrollToTop = () => {
        window.scrollTo({
        top: 0,
        behavior: 'smooth',
        });
    };

    return (
        <button
            id="no-shadow"
            className={`back-to-top-button mb-3 ${isVisible ? 'visible' : ''}`}
            onClick={scrollToTop}>
                <img id="arrow-image" src={process.env.PUBLIC_URL + '/images/back-to-top.png'} alt="Back to top" />
        </button>
    );
};

export default BackToTop;