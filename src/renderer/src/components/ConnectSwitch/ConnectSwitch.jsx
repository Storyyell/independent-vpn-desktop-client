import React from 'react'
import Switch from '@mui/material/Switch';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import { Box, Stack, Typography } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { vpnConnectionState } from '../../atoms/app/vpnConnectionState';


function renderVpnStatusMessage(vpnConnectionStatus) {
  switch (vpnConnectionStatus) {
    case 0:
      return <Typography fontWeight={400}>Not Connected</Typography>;
    case 2:
      return <Typography fontWeight={400}>Connecting...</Typography>;
    case 1:
      return <Typography fontWeight={400}>Securely Connected</Typography>;
    case 3:
      return <Typography fontWeight={400}>Disconnecting...</Typography>;
    default:
      return <Typography fontWeight={400}>Not Connected</Typography>;
  }
}



const ConnectSwitch = () => {

  const vpnConnectionStatus = useRecoilValue(vpnConnectionState);


  return (
    <Stack
      direction={"column"}
      sx={{
        p: 1,
        alignItems: "center",
      }} >
      {renderVpnStatusMessage(vpnConnectionStatus)}
    </Stack>
  )
}

export default ConnectSwitch