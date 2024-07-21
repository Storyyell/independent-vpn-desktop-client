import React from "react";
import { createContext, useState } from "react";

const VpnStatusMainContext = createContext({});

function VpnStatusMainProvider({ children }) {
    const [vpnStatusMain, setVpnStatusMain] = useState('disconnected');

    return (
        <VpnStatusMainContext.Provider value={{ vpnStatusMain, setVpnStatusMain }}>
            {children}
        </VpnStatusMainContext.Provider>
    );
}

export { VpnStatusMainContext, VpnStatusMainProvider };

