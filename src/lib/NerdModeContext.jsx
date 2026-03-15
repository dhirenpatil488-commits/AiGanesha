import React, { createContext, useContext, useState, useEffect } from 'react';

const NerdModeContext = createContext();

export const NerdProvider = ({ children }) => {
    // Nerd mode is now permanently enabled
    const [isNerdMode] = useState(true);

    return (
        <NerdModeContext.Provider value={{ isNerdMode }}>
            <div className="nerd-mode-active font-mono">
                {children}
            </div>
        </NerdModeContext.Provider>
    );
};

export const useNerdMode = () => {
    const context = useContext(NerdModeContext);
    if (!context) {
        throw new Error('useNerdMode must be used within a NerdProvider');
    }
    return context;
};
