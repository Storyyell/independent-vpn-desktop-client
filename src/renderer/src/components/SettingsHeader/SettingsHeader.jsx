import { IconButton, Stack, Typography } from '@mui/material'
import React from 'react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';


const SettingsHeader = (props) => {
  return (
    <Stack direction={'row'} sx={{ marginBottom: 2 }} alignItems={'center'} >
      <IconButton onClick={() => { props.onClick() }} sx={{ marginRight: 1 }}>
        <ArrowBackIosIcon fontSize='small' />
      </IconButton>
      <Typography fontSize={'14px'}>{props.header}</Typography>
    </Stack>
  )
}

export default SettingsHeader