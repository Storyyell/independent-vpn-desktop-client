import { Padding, SixK } from '@mui/icons-material'
import { Box, IconButton, Stack } from '@mui/material'
import React from 'react'
import PowerBtn from './PowerBtn'
import GeoHolder from './GeoHolder'

const Selector = (props) => {

  return (
    <Stack direction={'row'} sx={{
      height: "54px",
      width: "100%",
      alignItems: "center",
      justifyContent: "space-around"
    }}
    >
      <IconButton sx={{ borderRadius: "34px" }}>
        <GeoHolder onClick={() => { props.onClick() }} />
      </IconButton>
      <IconButton>
        <PowerBtn />
      </IconButton>
    </Stack>
  )
}

export default Selector