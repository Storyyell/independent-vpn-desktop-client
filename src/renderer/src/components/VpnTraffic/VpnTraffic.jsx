import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';

const VpnTraffic = () => {
  return (
    <Box sx={{ my: 4, width: '100%' }} >
      <Stack direction={'row'} justifyContent={'space-around'}>

        <Stack direction={'row'}>
          <Stack justifyContent={'center'} alignItems={'center'} sx={{ p: "5px", m: 'auto', backgroundColor: 'whitesmoke', borderRadius: '10px' }}>
            <ArrowCircleDownIcon fontSize='small' sx={{ color: '#232F4E' }} />
          </Stack>
          <Stack direction={'column'} sx={{ px: 2 }}>
            <Typography fontWeight={'800'} style={{ fontSize: '12px' }}>Downlink</Typography>
            <Typography style={{ fontSize: '12px' }} >0.00 KB/s</Typography>
          </Stack>
        </Stack>

        <Stack direction={'row'}>
          <Stack justifyContent={'center'} alignItems={'center'} sx={{ p: "5px", m: 'auto', backgroundColor: 'whitesmoke', borderRadius: '10px' }}>
            <ArrowCircleUpIcon fontSize='small' sx={{ color: '#232F4E' }} />
          </Stack>
          <Stack direction={'column'} sx={{ px: 2 }}>
            <Typography fontWeight={'800'} style={{ fontSize: '12px' }}>Uplink</Typography>
            <Typography style={{ fontSize: '12px' }} >0.00 KB/s</Typography>
          </Stack>
        </Stack>

      </Stack>
    </Box>
  )
}

export default VpnTraffic