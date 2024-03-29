import React from 'react'
import SettingsHeader from '../../components/SettingsHeader/SettingsHeader'
import { Box, Button, Chip, Divider, Grid, List, ListItem, ListItemButton, MenuItem, Select, Stack, Typography } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Switch from '@mui/material/Switch';
import SettingsItem from '../../components/SettingsItem/SettingsItem';

const homeSettingsJson = [
  {
    title: 'VPN Settings',
    desc: 'Connection and security',
    variant: 1
  },
  {
    title: 'App Settings',
    desc: 'App general features',
    variant: 1
  },
  {
    title: 'Logs',
    desc: 'See Connection Logs',
    variant: 1
  },
  {
    title: 'Subscription',
    desc: 'Your current plan is Free',
    variant: 9
  }]

const VpnSetting = () => {
  return (
    <>
      <Grid container spacing={1} width={'100%'}>

        <Grid container sx={{ marginBottom: 1 }}>
          <Grid item xs>
            <Typography variant={'h5'} sx={{ fontWeight: 900 }}>
              vpnsetting
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'end' }} >
            <Chip label="FREE" color="error" variant="outlined" sx={{ px: 1 }} />
          </Grid>
        </Grid>

        <Grid container sx={{ marginBottom: 2 }}>
          <Grid item xs>
            <Typography variant={'subtitle2'} >
              Explore Settings in the App
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'end' }}>

          </Grid>
        </Grid>

        <Divider />
        <List sx={{ width: '100%' }}>
          {
            homeSettingsJson.map((item, index) => {
              return (
                <Box sx={{ paddingBottom: 1 }}>
                  <ListItem key={index} disablePadding>
                    <ListItemButton sx={{ p: '3px', borderRadius: 1 }}>
                      <SettingsItem title={item.title} desc={item.desc} variant={item.variant} />
                    </ListItemButton>
                  </ListItem>
                  <Divider variant="fullWidth" component="li" />
                </Box>
              )
            })
          }
        </List>

      </Grid>

      {/* // todo make below elemtny to bottom */}
      <Box variant='div' sx={{ width: '100%' }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton sx={{ p: '3px', borderRadius: 1 }}>
              <SettingsItem title={'Support'} desc={'Troubleshooting, contact support etc.'} variant={1} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

    </>
  )
}

export default VpnSetting