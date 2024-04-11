import React from 'react'
import SettingsHeader from '../../components/SettingsHeader/SettingsHeader'
import { Box, Button, Chip, Divider, Grid, List, ListItem, ListItemButton, MenuItem, Select, Stack, Typography } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Switch from '@mui/material/Switch';


function SettingsItem(props) {

  const variant = parseInt(props.variant)
  // const variant = 1


  return (
    <Grid container sx={{ marginBottom: 0.5, display: (variant != 0 ? 'flex' : 'none') }}>
      <Grid item xs>
        <Stack direction="column" spacing={1}>
          <Typography fontSize={11} sx={{ fontWeight: 600 }} >
            {props.title}
          </Typography>

          <Typography fontSize={9}>
            {props.desc}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={2} sx={{ textAlign: 'end' }} justifyContent={'flex-end'} alignItems={'center'} display={'flex'}>
        {variant == 1 && <KeyboardArrowRightIcon fontSize='small' />}
        {variant == 2 && <Switch defaultChecked size='small' />}
        {variant == 3 && <Select
          value={'v2ray'}
          label="Age"
          size='small'
          sx={{ width: '100px', }}
        >
          <MenuItem value={'v2ray'} >v2ray</MenuItem>
          <MenuItem value={'wireguard'} disabled>wireguard</MenuItem>
        </Select>}

      </Grid>
    </Grid>
  )
}
export default SettingsItem