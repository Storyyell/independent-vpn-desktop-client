import React from 'react'
import Switch from '@mui/material/Switch';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import { Box, Stack, Typography } from '@mui/material';

const ConnectSwitch = () => {

  return (
    <Stack
      direction={"column"}
      sx={{
        p: 2,
        alignItems: "center",
      }} >
      <Switch
        color='warning'
        checkedIcon={<ElectricBoltIcon fontSize='small' />}
        size='medium'
      />
      <Typography>Not Connected</Typography>
    </Stack>
  )
}

export default ConnectSwitch