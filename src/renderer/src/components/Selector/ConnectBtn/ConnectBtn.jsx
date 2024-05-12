import React from 'react'
import { Box, IconButton, Stack } from '@mui/material'
import DisconnectBtn from './DisconnectBtn';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { vpnConnectionState } from '../../../atoms/app/vpnConnectionState';
import BtnSpinner from './BtnSpinner';
import PowerBtn from './PowerBtn';
import { handleVpnConnTrigger } from '../../../pages/Home/ConnectionTrigger';
import { deviceTokenState } from '../../../atoms/app/token';
import { countrySelectedState } from '../../../atoms/userSelection/country';
import { citySelectedState } from '../../../atoms/userSelection/city';
import { countryListState } from '../../../atoms/available/countryList';
import { cityListState } from '../../../atoms/available/cityList';
import { serverSelectedState } from '../../../atoms/userSelection/server';
import { serverListState } from '../../../atoms/available/serverList';


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
  const deviceToken = useRecoilValue(deviceTokenState);
  const [countryCodeSelected, setCountrySelected] = useRecoilState(countrySelectedState);
  const [cityCodeSelected, setCitySelected] = useRecoilState(citySelectedState);
  const [countryList, setCountryList] = useRecoilState(countryListState);
  const [cityList, setCityList] = useRecoilState(cityListState);
  const setServerSelected = useSetRecoilState(serverSelectedState);
  const [serverListObj, setServerListObj] = useRecoilState(serverListState);


  return (
    <IconButton onClick={() => {

      debugger;

      handleVpnConnTrigger(
        deviceToken,
        countryCodeSelected,
        cityCodeSelected,
        vpnConnectionStatus,
        setVpnConnectionStatus,
        countryList,
        setCountryList,
        cityList,
        setCityList,
        setCountrySelected,
        setCitySelected,
        setServerSelected,
        serverListObj,
        setServerListObj
      )
    }}>
      {renderVpnStatusIcon(vpnConnectionStatus)}
    </IconButton>
  )
}

export default ConnectBtn

