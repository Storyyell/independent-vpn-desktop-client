import { Box, Typography } from '@mui/material';
import React from 'react';
import { useRecoilValue } from 'recoil';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { vpnConnectionState } from '../../atoms/app/vpnConnectionState';

const StatusBar = (props) => {


  const StatusElement = (props) => {

    if (props.text) {
      return (<Typography sx={{ fontSize: "14px", fontWeight: "500" }}>{props.text}</Typography>)
    }

    const vpnConnectionStatus = useRecoilValue(vpnConnectionState);

    switch (vpnConnectionStatus) {
      // not connected 
      case 0:
        return (<>
          <WarningAmberIcon fontSize="small" color="error" sx={{ mr: 1 }} />
          <Typography sx={{ fontSize: "14px", color: "#54687A", fontWeight: "500" }}>Not Protected</Typography>
        </>)
      // connected
      case 1:
        return (<>
          <VerifiedUserIcon fontSize="small" color="success" sx={{ mr: 1 }} />
          <Typography sx={{ fontSize: "14px", color: "#54687A", fontWeight: "500" }}>Connection Protected</Typography>
        </>)
      default:
        return (<>
          <WarningAmberIcon fontSize="small" color="error" sx={{ mr: 1 }} />
          <Typography sx={{ fontSize: "14px", color: "#54687A", fontWeight: "500" }}>Not Protected</Typography>
        </>)
    }

  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "37px",
        width: "217px",
        borderRadius: "18.5px",
        backgroundColor: "#101921"
      }}>

      <StatusElement text={props.text} />
    </Box>
  )
}

export default StatusBar