import React from 'react'
import SettingsHeader from '../../components/SettingsHeader/SettingsHeader'
import { Box, Button, Chip, Divider, Grid, List, ListItem, ListItemButton, MenuItem, Select, Stack, Typography } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Switch from '@mui/material/Switch';
import SettingsItem from '../../components/SettingsItem/SettingsItem';


const homeSettingsJson = [
  {
    title: 'App version 1.1.1.1',
    desc: 'You are using the latest version',
    variant: null
  },
  {
    title: 'App appearance',
    desc: 'Default',
    variant: null
  },
  {
    title: 'Push notifications',
    desc: 'Get notified about location updates, alerts, and new security features.',
    variant: 2,
    onClick: () => { }
  },
  {
    title: 'Subscription',
    desc: 'Your current plan is Free',
    variant: 9
  }]

const generalInfoSettingsJson = [
  {
    title: 'Analytics',
    desc: 'Provide anonymous app usage data.',
    variant: 2,
    onClick: () => { }
  },
  {
    title: 'Send crash report',
    desc: 'These don’t contain personal info and help us improve your experience.',
    variant: 2,
    onClick: () => { }
  },
]

const AppSettings = () => {
  return (
    <>
      <Stack spacing={1} width={'100%'}>

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

        <Typography fontSize={'14px'} fontWeight={600} sx={{ mt: 1 }}>Help us improve</Typography>

        <List>
          {
            generalInfoSettingsJson.map((item, index) => {
              return (
                <Box sx={{ paddingBottom: 1 }} key={index}>
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

      </Stack>

    </>
  )
}

export default AppSettings