import React from 'react'
import SettingsHeader from '../../components/SettingsHeader/SettingsHeader'
import { Box, Button, Chip, Divider, Grid, List, ListItem, ListItemButton, MenuItem, Select, Stack, Typography } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Switch from '@mui/material/Switch';
import SettingsItem from '../../components/SettingsItem/SettingsItem';

const homeSettingsJson = [
  {
    title: 'Auto-connect',
    desc: 'Automaically reconnects if you switch networks or restart the app.',
    variant: 2,
    onClick: () => { props.setSettingsPage('vpnsetting') }
  },
  {
    title: 'Protocol',
    desc: 'Changes the VPN Protocol',
    variant: 3,
    options: ['V2RAY', 'WIREGUARD'],
    onClick: () => { props.setSettingsPage('appsetting') }

  },
  {
    title: 'CleanWeb',
    desc: 'Blocks ads, trackers and malware when VPN is restart.',
    variant: 2,
    onClick: () => { }

  },
  {
    title: 'VPN Kill Switch',
    desc: 'Disables internet access when VPN connection drops or is turned off.',
    variant: 2,
    onClick: () => { }

  },
  {
    title: 'Override GPS Location',
    desc: 'Match your GPS location to your VPN location.',
    variant: 2,
    onClick: () => { }

  },
  {
    title: 'Tray Icon',
    desc: 'Show App in System Tray when running in background',
    variant: 2,
    onClick: () => { }

  }]

const VpnSetting = () => {
  return (
    <>
      <Stack spacing={1} width={'100%'}>

        <List sx={{ width: '100%' }}>
          {
            homeSettingsJson.map((item, index) => {
              return (
                <Box key={index} sx={{ paddingBottom: 1 }}>
                  <ListItem disablePadding>
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

      </Stack>

    </>
  )
}

export default VpnSetting