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
          <Typography fontSize={"12px"} sx={{ fontWeight: 600 }} >
            {props.title}
          </Typography>

          <Typography fontSize={"10px"} color={"grey"}>
            {props.desc}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={2} sx={{ textAlign: 'end' }} justifyContent={'flex-end'} display={'flex'}>

        {/* navigation */}
        {variant == 1 && <KeyboardArrowRightIcon fontSize='small' />}

        {/* toggle button */}
        {variant == 2 && <Switch
          color='error'
          size='medium'
          checked={props?.checked}
          onChange={(e) => {
            props?.onChange(e.target.checked)
          }}

        />}

        {/* selection */}
        {variant == 3 && <Select
          value={'v2ray'}
          label="Age"
          size='small'
          sx={{
            borderRadius: '17px',
            height: '30px',
            px: 1,
            fontSize: '10px',
            backgroundColor: '#101921',
            width: '100px'

          }}
        >
          <MenuItem value={'v2ray'} >v2ray</MenuItem>
          <MenuItem value={'wireguard'} disabled>wireguard</MenuItem>
        </Select>
        }
        {
          variant == 4 && <Select
            value={props.value}
            label={props.label}
            size='small'
            sx={{
              borderRadius: '17px',
              height: '30px',
              px: 1,
              fontSize: '10px',
              backgroundColor: '#101921',
              width: '100px'
            }}
            onChange={(e) => { props.onChange(e) }}
          >
            {
              (props?.array || [])?.map((item, index) => {
                return <MenuItem value={item?.id} key={item?.id}>{item?.name}</MenuItem>
              })
            }
          </Select>
        }

      </Grid>
    </Grid >
  )
}
export default SettingsItem