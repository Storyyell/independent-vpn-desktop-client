import React from 'react'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Box } from '@mui/system';


const PowerBtn = () => {
  return (
    <Box sx={{
      width: "54px",
      height: "54px",
      backgroundColor: "#1D2026",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "27px"
    }}>
      <PowerSettingsNewIcon />
    </Box>
  )
}

export default PowerBtn