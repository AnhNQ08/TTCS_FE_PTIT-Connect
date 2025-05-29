import React, {createContext, useEffect, useState} from 'react';

export const CurtainContext = createContext();

export const CurtainProvider = ({children}) => {
    const [showCurtain, setShowCurtain] = useState(false);

    return (
        <CurtainContext.Provider value={{showCurtain, setShowCurtain}}>
            {children}
        </CurtainContext.Provider>
    );
};

export default CurtainContext;