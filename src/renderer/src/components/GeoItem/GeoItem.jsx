import { Box, Stack, Typography } from '@mui/material'
import React from 'react'

export const GeoItem = () => {
  return (
    <Box>
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Stack direction={'column'}>
          abc
        </Stack>
        <Typography>
          cde
        </Typography>
      </Stack>
    </Box>
  )
}
