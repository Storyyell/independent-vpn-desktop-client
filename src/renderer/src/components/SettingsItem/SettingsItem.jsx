import React from 'react'
import SettingsHeader from '../../components/SettingsHeader/SettingsHeader'
import { Box, Button, Chip, Divider, Grid, List, ListItem, ListItemButton, MenuItem, Select, Stack, Typography } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Switch from '@mui/material/Switch';


function SettingsItem(props) {

  const variant = parseInt(props.variant)
  // const variant = 1


  return (
    <Grid container sx={{ marginBottom: 1, display: (variant != 0 ? 'flex' : 'none') }}>
      <Grid item xs>
        <Stack direction="column" spacing={1}>
          <Typography variant={'subtitle1'} sx={{ fontWeight: 600 }} fontSize={16}>
            {props.title}
          </Typography>

          <Typography variant={'caption'} fontSize={'14px'}>
            {props.desc}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={1} sx={{ textAlign: 'end' }} justifyContent={'flex-end'} alignItems={'center'} display={'flex'}>
        {variant == 1 && <KeyboardArrowRightIcon fontSize='medium' />}
        {variant == 2 && <Switch defaultChecked fontSize='medium' />}
        {variant == 3 && <Select
          // labelId="demo-simple-select-label"
          // id="demo-simple-select"
          value={'v2ray'}
          label="Age"
          // onChange={handleChange}
          size='small'
          sx={{ width: '100px' }}
        >
          <MenuItem value={'v2ray'}>v2ray</MenuItem>
          <MenuItem value={'wireguard'}>wireguard</MenuItem>
        </Select>}

      </Grid>
    </Grid>
  )
}
export default SettingsItem