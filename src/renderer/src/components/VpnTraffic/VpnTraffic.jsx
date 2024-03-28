import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';

const VpnTraffic = () => {
  return (
    <Box sx={{ my: 8, width: '100%' }} >
      <Stack direction={'row'} justifyContent={'space-between'} sx={{ mx: '70px' }}>
        <Stack direction={'row'}>
          <Stack justifyContent={'center'} alignItems={'center'} sx={{ p: 1, m: 'auto', backgroundColor: 'whitesmoke', borderRadius: '10px' }}>
            <ArrowCircleDownIcon fontSize='small' sx={{ color: '#232F4E' }} />
          </Stack>
          <Stack direction={'column'} sx={{ px: 2 }}>
            <Typography variant={'h6'} fontWeight={'800'}>Downlink</Typography>
            <Typography variant={'h6'}>0.00 KB/s</Typography>
          </Stack>
        </Stack>
        <Stack direction={'row'}>
          <Stack justifyContent={'center'} alignItems={'center'} sx={{ p: 1, m: 'auto', backgroundColor: 'whitesmoke', borderRadius: '10px' }}>
            <ArrowCircleUpIcon fontSize='small' sx={{ color: '#232F4E' }} />
          </Stack>
          <Stack direction={'column'} sx={{ px: 2 }}>
            <Typography variant={'h6'} fontWeight={'800'}>Uplink</Typography>
            <Typography variant={'h6'}>0.00 KB/s</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}

export default VpnTraffic