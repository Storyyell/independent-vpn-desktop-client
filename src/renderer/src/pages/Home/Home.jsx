import React from 'react';
import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import electronLogo from '../../assets/electron.svg'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LocationSelection from '../../components/LocationSelection/LocationSelection';
import { ServerListContext } from '../../context/ServerListContext';
import { VpnStatusMainContext } from '../../context/VpnStatusMainContext';
import CircularProgress from '@mui/material/CircularProgress';
import { DeviceTokenContext } from '../../context/DeviceTokenContext';
import { SelectionContext } from '../../context/SelectionContext';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ConnectBtn from '../../components/ConnectBtn/ConnectBtn';


// todo add case of revoked device token and followed by re-regisration

function Home() {

    const [vpnStatus, setVpnStatus] = useState("VPN disconnected");
    const { serverList, setServerList } = React.useContext(ServerListContext);
    const { vpnStatusMain, setVpnStatusMain } = React.useContext(VpnStatusMainContext);
    const { deviceToken, setDeviceToken } = React.useContext(DeviceTokenContext);
    const { selectedItems, setSelectedItems } = React.useContext(SelectionContext);


    function triggerVpnConnection() {
        if (vpnStatusMain !== 'connected') {

            console.log("vpn connection triggered fron renderer");
            let sl = serverList.servers?.[`${selectedItems.countryId}-${selectedItems.cityId}`] || []
            if (sl.length > 0) {

                const randomIndex = Math.floor(Math.random() * sl.length);
                const server = sl[randomIndex]
                console.log(server);

                let serverParms = {
                    device_token: deviceToken,
                    countryCode: selectedItems.countryId,
                    cityCode: selectedItems.cityId,
                    serverId: server.id
                }

                window.api.triggerConnection(serverParms);

            } else {
                setVpnStatus("fetching server list...")
                // Todo handle this case properly
                setTimeout(() => { setVpnStatus("VPN disconnected") }, 2000);
            }
        } else {
            window.api.triggerDisconnection()
        }
    }


    function genLogoStyle() {
        return {
            filter: vpnStatusMain === 'connected' ? 'drop-shadow(0 0 1.2em #6988e6aa)' : 'none'
        }
    }

    return (
        <>
            <Stack direction={'column'} spacing={3} alignItems={'center'} my={3}>
                <Button
                    size="medium"
                    variant="outlined"
                    style={{
                        width: "184px",
                        height: "46px",
                        borderRadius: "23px",
                        border: '2px solid #CC2229',
                        color: 'white',
                        backdropFilter: blur('4.5px'),
                        background: '#101921'
                    }}
                    onClick={triggerVpnConnection}
                >
                    {/* {vpnStatusMain === 'connected' && 'disconnect vpn'} */}
                    {/* {vpnStatusMain === 'disconnected' && 'connect vpn'} */}
                    {/* {vpnStatusMain === 'connecting' && 'connecting...'}{vpnStatusMain === 'connecting' && <CircularProgress size="15px" color="secondary" sx={{ mx: 2 }} />} */}
                    {`Quick connect `}
                    <ArrowRightIcon />
                </Button>

                <Typography variant={'h4'}>
                    United States / Buffalo
                </Typography>
            </Stack>
            <Box>
                <ConnectBtn />
            </Box>

            <img alt="logo" className="logo" style={genLogoStyle()} src={electronLogo} />
            <div className="creator">sentinel - dvpn</div>
            <div className="text">
                Your Decentralized VPN Solution
            </div>
            <Stack direction="row" spacing={1} style={{ paddingTop: "8px", alignItems: 'center' }} >
                <Typography variant="overline" display="block" gutterBottom>
                    {`status :`}
                </Typography>
                <Typography variant="caption" display="block" gutterBottom >
                    {vpnStatus ? vpnStatus : 'VPN disconnected'}
                </Typography>
            </Stack>

            <div className="actions">
                <div className="action">
                    <Button
                        size="medium"
                        variant="outlined"
                        style={{ minWidth: "150px", height: "40px", borderRadius: "20px" }}
                        onClick={triggerVpnConnection}
                    >
                        {vpnStatusMain === 'connected' && 'disconnect vpn'}
                        {vpnStatusMain === 'disconnected' && 'connect vpn'}
                        {vpnStatusMain === 'connecting' && 'connecting...'}{vpnStatusMain === 'connecting' && <CircularProgress size="15px" color="secondary" sx={{ mx: 2 }} />}
                    </Button>
                </div>
            </div>
            <LocationSelection />
        </>
    )
}

export default Home

