import { Padding, SixK } from '@mui/icons-material'
import { Box, Stack } from '@mui/material'
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

      <GeoHolder onClick={() => { props.onClick() }} />
      <PowerBtn />
    </Stack>
  )
}

export default Selector