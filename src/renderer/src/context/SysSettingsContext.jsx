import React, { createContext, useState, useEffect } from "react";

const sysSettingsDefault = {
    killSwitch: true,
    trayIcon: true,
    analytics: false,
    crashReport: false,
}

const SysSettingsContext = createContext({});

function SysSettingsProvider({ children }) {

    let initialState = JSON.parse(localStorage.getItem('system_settings')) || sysSettingsDefault;
    initialState = { ...sysSettingsDefault, ...initialState };

    const [SysSettings, setSysSettings] = useState(initialState);

    useEffect(() => {
        try {
            const jsonStr = JSON.stringify(SysSettings);
            localStorage.setItem('system_settings', jsonStr);

        } catch (error) {
            // console.error('Error saving to local storage', error);
        }
    }, [SysSettings]);

    return (
        <SysSettingsContext.Provider value={{ SysSettings, setSysSettings }}>
            {children}
        </SysSettingsContext.Provider>
    );
}

export { SysSettingsContext, SysSettingsProvider };
