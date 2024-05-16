import React from 'react';
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import GeoSelection from '../../components/GeoSelection/GeoSelection';
import { DnsListContext } from '../../context/DnsListContext';
import Selector from '../../components/Selector/Selector';
import ConnectSwitch from '../../components/ConnectSwitch/ConnectSwitch';
import MapBoxUI from '../../components/MapBoxUI/MapBoxUI';


function Home() {

    const [vpnStatus, setVpnStatus] = useState("VPN disconnected");
    const [geoSelection, setGeoSelection] = React.useState(false);

    const { dnsObj, setDnsObj } = React.useContext(DnsListContext);

    React.useEffect(() => {
        if (dnsObj.selectedDns) {
            window.api.setDns(dnsObj.selectedDns)
        }
        window.api.getDnsList()
            .then((res) => {
                setDnsObj((t) => {
                    return {
                        dnsList: res.dnsList,
                        selectedDns: t.selectedDns || res.selectedDns || 0
                    }
                });
            })
            .catch((err) => { })
    }, []);

    useEffect(() => {
        const handleConnectionStatus = (arg) => {
            const { message, connected, connectionProgress, disconnectionProgress } = arg;
            setVpnStatus(message);
        };

        window.ipcRenderer.on('connectionStatus', handleConnectionStatus);

        return () => {
            window.ipcRenderer.removeAllListeners('connectionStatus');
        };
    }, []);

    return (
        <>
            <Box sx={{ height: "20px" }}>   </Box>

            <MapBoxUI />

            <GeoSelection
                open={geoSelection}
                onClose={() => setGeoSelection(false)}
            />

            <ConnectSwitch />

            <Selector onClick={() => setGeoSelection(true)} />
        </>
    )
}

export default Home

