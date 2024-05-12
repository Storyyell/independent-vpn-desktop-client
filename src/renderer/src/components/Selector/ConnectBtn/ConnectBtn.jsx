import React from 'react'
import { Box, IconButton, Stack } from '@mui/material'
import DisconnectBtn from './DisconnectBtn';
import { useRecoilState } from 'recoil';
import { vpnConnectionState } from '../../../atoms/app/vpnConnectionState';
import BtnSpinner from './BtnSpinner';
import PowerBtn from './PowerBtn';


function renderVpnStatusIcon(vpnConnectionStatus) {
  switch (vpnConnectionStatus) {
    case 0:
      return <PowerBtn />;
    case 2:
      return <BtnSpinner color="success" />;
    case 1:
      return <DisconnectBtn />;
    case 3:
      return <BtnSpinner color="error" />;
    default:
      return <PowerBtn />;
  }
}


const ConnectBtn = () => {
  const [vpnConnectionStatus, setVpnConnectionStatus] = useRecoilState(vpnConnectionState);

  return (
    <IconButton>
      {renderVpnStatusIcon(vpnConnectionStatus)}
    </IconButton>
  )
}

export default ConnectBtn

// handleVpnConnTrigger(deviceToken, { countryId: countryId, cityId: cityId_ }, serverList, () => { }, vpnStatusMain, setServerList, setVpnStatusMain, setSelectedItems)
