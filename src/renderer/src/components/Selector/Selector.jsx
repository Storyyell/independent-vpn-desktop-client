import { Box, IconButton, Stack } from '@mui/material'
import React from 'react'
import GeoHolder from './GeoHolder'
import ConnectBtn from './ConnectBtn/ConnectBtn'

const Selector = (props) => {

  return (
    <Stack direction={'row'} sx={{
      height: "54px",
      width: "100%",
      alignItems: "center",
      justifyContent: "space-around"
    }}
    >
      <IconButton
        sx={{ borderRadius: "34px" }}
        onClick={() => { props.onClick() }}>
        <GeoHolder />
      </IconButton>
      <ConnectBtn />
    </Stack>
  )
}

export default Selector