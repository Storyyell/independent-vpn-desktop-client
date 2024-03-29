import { IconButton, Stack, Typography } from '@mui/material'
import React from 'react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';


const SettingsHeader = (props) => {
  return (
    <Stack direction={'row'} sx={{ marginBottom: 4 }} alignItems={'center'} >
      <IconButton onClick={() => { props.onClick() }} sx={{ marginRight: '10px' }}>
        <ArrowBackIosIcon />
      </IconButton>
      <Typography variant={'h6'}>{props.header}</Typography>
    </Stack>
  )
}

export default SettingsHeader