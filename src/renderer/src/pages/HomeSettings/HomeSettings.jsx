import React from 'react'
import SettingsHeader from '../../components/SettingsHeader/SettingsHeader'
import { Box, Button, Chip, Divider, Grid, List, ListItem, ListItemButton, MenuItem, Select, Stack, Typography } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Switch from '@mui/material/Switch';
import SettingsItem from '../../components/SettingsItem/SettingsItem';
import { DeviceTokenContext } from '../../context/DeviceTokenContext';


function stringToUniqueNumber(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const character = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + character;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash % 1000000000);
}

stringToUniqueNumber("YourString");

const HomeSettings = (props) => {
  const { deviceToken } = React.useContext(DeviceTokenContext);

  const homeSettingsJson = [
    {
      title: 'VPN Settings',
      desc: 'Connection and security',
      variant: 1,
      onClick: () => { props.setSettingsPage('VPN Setting') }
    },
    {
      title: 'App Settings',
      desc: 'App general features',
      variant: 1,
      onClick: () => { props.setSettingsPage('App Setting') }

    },
    {
      title: 'Logs',
      desc: 'See Connection Logs',
      variant: 1,
      onClick: async () => {
        await window.api.openLogger()
      },
      // disabled: true
    },
    {
      title: 'Subscription',
      desc: 'Your current plan is Free',
      variant: 9,
      onClick: () => { },
      disabled: true
    }]

  return (
    <>
      <Stack spacing={1} width={'100%'}>

        <Grid container sx={{ marginBottom: 1 }}>
          <Grid item xs>
            <Typography fontSize={17} sx={{ fontWeight: 800 }}>
              {`User - ${stringToUniqueNumber(deviceToken)}`}
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'end' }} >
            <Chip size="small" label="FREE" color="error" variant="outlined"
              sx={{
                height: 'auto',
                '& .MuiChip-label': {
                  fontSize: '9px'
                },
              }} />
          </Grid>
        </Grid>

        <Grid container sx={{ marginBottom: 2 }}>
          <Grid item xs>
            <Typography fontSize={11}>
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
                <Box sx={{ paddingBottom: 1 }} key={index}>
                  <ListItem disablePadding>
                    <ListItemButton
                      disabled={item?.disabled}
                      onClick={() => { item.onClick() }}
                      sx={{ p: '3px', borderRadius: 1 }}>
                      <SettingsItem
                        title={item.title}
                        desc={item.desc}
                        variant={item.variant}
                      />
                    </ListItemButton>
                  </ListItem>
                  <Divider variant="fullWidth" component="li" />
                </Box>
              )
            })
          }
        </List>

      </Stack>

      {/* // todo make below elemtny to bottom */}

      <Stack sx={{ width: '100%' }}>
        <List  >
          <ListItem disablePadding>
            <ListItemButton

              onClick={() => {
                props.setSettingsPage('Support')
              }}

              sx={{ p: '3px', borderRadius: 1 }}>
              <SettingsItem title={'Support'} desc={'Troubleshooting, contact support etc.'} variant={1} />
            </ListItemButton>
          </ListItem>
        </List>
      </Stack>

    </>
  )
}

export default HomeSettings