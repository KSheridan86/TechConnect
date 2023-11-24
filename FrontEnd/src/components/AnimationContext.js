import { createContext, useContext, useState } from 'react';

const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const value = {
        shouldAnimate,
        setShouldAnimate,
    };
    return (
        <AnimationContext.Provider value={value}>{children}</AnimationContext.Provider>
    );
};

export const useAnimation = () => {
    return useContext(AnimationContext);
};

