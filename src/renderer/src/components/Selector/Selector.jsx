import { Padding, SixK } from '@mui/icons-material'
import { Box, Stack } from '@mui/material'
import React from 'react'
import PowerBtn from './PowerBtn'
import GeoHolder from './GeoHolder'

const Selector = (props) => {

  return (
    <div onClick={() => { props.onClick() }}>

      <Stack direction={'row'} sx={{
        height: "54px",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center"
      }}
      >

        <GeoHolder />
        <PowerBtn />
      </Stack>
    </div>
  )
}

export default Selector