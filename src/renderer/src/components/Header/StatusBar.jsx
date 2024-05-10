import { Box, Typography } from '@mui/material'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { statusBarState } from '../../atoms/app/statusBar'
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const StatusBar = () => {


  const StatusElement = () => {
    const statusBarCode = useRecoilValue(statusBarState);

    switch (statusBarCode) {
      // not connected 
      case 0:
        return (<>
          <WarningAmberIcon fontSize="small" color="error" sx={{ mx: 2 }} />
          <Typography sx={{ fontSize: "14px", color: "#54687A", fontWeight: "500" }}>Not Protected</Typography>
        </>)

      case 1:
        return (<>
          <VerifiedUserIcon fontSize="small" color="success" sx={{ mx: 2 }} />
          <Typography sx={{ fontSize: "14px", color: "#54687A", fontWeight: "500" }}>Connection Protected</Typography>
        </>)

      case 2:
        return (<>
          <Typography sx={{ fontSize: "14px", color: "#54687A", fontWeight: "500" }}>Home</Typography>
        </>)

      default:
        return (<>
          <WarningAmberIcon fontSize="small" color="error" sx={{ mx: 2 }} />
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
        width: "237px",
        borderRadius: "18.5px",
        borderWidth: "1px",
        backgroundColor: "#101921"
      }}>

      <StatusElement />
    </Box>
  )
}

export default StatusBar