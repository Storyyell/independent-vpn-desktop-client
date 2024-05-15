import React from 'react'
import Switch from '@mui/material/Switch';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import { Box, Stack, Typography } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { vpnConnectionState } from '../../atoms/app/vpnConnectionState';

function Loader() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setProgress((currentProgress) => (currentProgress + 1) % 4);
    }, 500);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty array ensures effect runs only once on mount

  return (
    <>
      {progress === 0 && "."}
      {progress === 1 && ".."}
      {progress === 2 && "..."}
      {progress === 3 && "...."}
    </>
  );
}

function renderVpnStatusMessage(vpnConnectionStatus) {
  switch (vpnConnectionStatus) {
    case 0:
      return <Typography fontWeight={400}>Not Connected</Typography>;
    case 2:
      return <Typography sx={{width:"120px"}} fontWeight={400}>Connecting <Loader/> </Typography>;
    case 1:
      return <Typography fontWeight={400}>Securely Connected</Typography>;
    case 3:
      return <Typography sx={{width:"120px"}} fontWeight={400}>Disconnecting </Typography>;
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