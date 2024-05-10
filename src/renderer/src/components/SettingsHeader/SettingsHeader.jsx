import { Box, IconButton, Stack, Typography } from '@mui/material'
import React from 'react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import GearBtn from '../Header/GearBtn';
import StatusBar from '../Header/StatusBar';


const SettingsHeader = (props) => {
  return (
    <Stack
      direction={'row'}
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        width: "100%",
        marginBottom: "32px"
      }}
    >
      <GearBtn handleMenuClick={() => { props.onClick() }} menuClick={true} />
      <StatusBar />
      <Box sx={{ width: "37px", height: "37px" }}></Box>
    </Stack>
  )
}

export default SettingsHeader