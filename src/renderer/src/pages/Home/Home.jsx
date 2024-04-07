import React from 'react';
import { useState, useEffect } from 'react';
import { Box, IconButton, Stack } from '@mui/material';
import electronLogo from '../../assets/electron.svg'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ServerListContext } from '../../context/ServerListContext';
import { VpnStatusMainContext } from '../../context/VpnStatusMainContext';
import { DeviceTokenContext } from '../../context/DeviceTokenContext';
import { SelectionContext } from '../../context/SelectionContext';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ConnectBtn from '../../components/ConnectBtn/ConnectBtn';
import GeoSelection from '../../components/GeoSelection/GeoSelection';
import VpnTraffic from '../../components/VpnTraffic/VpnTraffic';
import { handleVpnConnTrigger } from './ConnectionTrigger';



// todo add case of revoked device token and followed by re-regisration

function Home(props) {

    const [vpnStatus, setVpnStatus] = useState("VPN disconnected");
    const { vpnStatusMain, setVpnStatusMain } = React.useContext(VpnStatusMainContext);
    const { serverList, setServerList } = React.useContext(ServerListContext);
    const { deviceToken, setDeviceToken } = React.useContext(DeviceTokenContext);
    const { selectedItems, setSelectedItems } = React.useContext(SelectionContext);
    const [geoSelection, setGeoSelection] = React.useState(false);

    // for vpn status listenening
    useEffect(() => {
        const handleConnectionStatus = (arg) => {
            const message = arg.message;

            setVpnStatus(message);
            // if (message === 'VPN connection established') {
            //     setVpnStatusMain('connected');
            // } else if (message === 'VPN disconnected') {
            //     setVpnStatusMain('disconnected');
            // } else {
            //     setVpnStatusMain('connecting');
            // }

            console.log(message);
        };

        window.ipcRenderer.on('connectionStatus', handleConnectionStatus);

        return () => {
            window.ipcRenderer.removeAllListeners('connectionStatus');
        };
    }, []);


    function triggerVpnConnection() {
        handleVpnConnTrigger(deviceToken, selectedItems, serverList, setVpnStatus, vpnStatusMain, setServerList, setVpnStatusMain, setSelectedItems)
    }

    const getObj = (type, countryId, cityId) => {

        switch (type) {
            case 'country':
                return serverList.countries?.data?.find((c) => c.id === countryId)?.name || '----'
            case 'city':
                return serverList.cities[countryId]?.data?.find((c) => c.id === cityId)?.name || '----'
            default:
                return '----'
        }
    }

    return (
        <>
            <Stack direction={'column'} spacing={1} alignItems={'center'} my={2}>
                <Button
                    size="medium"
                    variant="outlined"
                    style={{
                        height: "30px",
                        borderRadius: "14px",
                        border: '1px solid #CC2229',
                        color: 'white',
                        backdropFilter: blur('4.5px'),
                        background: '#101921'
                    }}
                    onClick={() => setGeoSelection(true)}
                >
                    <Typography style={{ color: 'white', fontSize: '10px' }}>
                        {vpnStatusMain === 'disconnected' ? `Quick connect ` : `Change Location `}
                    </Typography>
                    <ArrowRightIcon />
                </Button>
                {/* todo make text autoscroll */}
                <Typography style={{ fontSize: "20px" }}>
                    {`${selectedItems.countryId ? getObj('country', selectedItems.countryId, null) : '----'} / ${selectedItems.cityId ? getObj('city', selectedItems.countryId, selectedItems.cityId) : '----'}`}
                </Typography>
            </Stack>
            <Box>
                <ConnectBtn
                    onClick={triggerVpnConnection}
                    statusText={vpnStatusMain}
                />

            </Box>
            <Stack direction="row" spacing={1} style={{ alignItems: 'center', justifyContent: 'center', margin: "10px" }} >
                <Typography style={{ fontSize: '12px', fontWeight: '800' }}>
                    {`status :`}
                </Typography>
                <Typography style={{ fontSize: '12px' }} >
                    {vpnStatus ? vpnStatus : 'VPN disconnected'}
                </Typography>
            </Stack>


            <VpnTraffic />
            <GeoSelection
                open={geoSelection}
                onClose={() => setGeoSelection(false)}
            />
        </>
    )
}

export default Home

