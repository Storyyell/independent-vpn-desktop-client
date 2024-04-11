import React from "react";
import { createContext, useState } from "react";

const VpnTunnelStatusContext = createContext({});

function VpnTunnelStatusProvider({ children }) {
    const [vpnTunnelStatus, setVpnTunnelStatus] = useState('disconnected');

    return (
        <VpnTunnelStatusContext.Provider value={{ vpnTunnelStatus, setVpnTunnelStatus }}>
            {children}
        </VpnTunnelStatusContext.Provider>
    );
}

export { VpnTunnelStatusContext, VpnTunnelStatusProvider };
