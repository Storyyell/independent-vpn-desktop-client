import { Box, Button, Chip, Divider, Grid, List, ListItem, ListItemButton, MenuItem, Select, Stack, Typography } from '@mui/material'
import React from 'react'
import openBook from '../../assets/open_book.svg'
import SettingsItem from '../../components/SettingsItem/SettingsItem'


const SupportPage = (props) => {

  const supportSettingsJson = [
    {
      title: 'Create ticket',
      desc: 'Create and send a ticket to our support team',
      variant: 1,
      onClick: () => { props.setSettingsPage('create ticket') }
    },
    {
      title: 'Telegram Community',
      desc: 'Ask Community for Help',
      variant: 1,
      onClick: () => { window.api.sysOpen(import.meta.env.VITE_SERVER_TELEGRAM_COMMUNITY_URL) }
    },
    {
      title: 'Report a bug',
      desc: 'Found an issue in our app? Let us know and we wll ge it fixed',
      variant: 1,
      onClick: () => { props.setSettingsPage('report-bug') }
    }]

  const generalInfoSettingsJson = [
    {
      title: 'Privacy policy',
      desc: '',
      variant: 1,
      onClick: () => { }
    },
    {
      title: 'Terms of service',
      desc: 'Ask Community for Help',
      variant: 1,
      onClick: () => { }
    }]

  return (
    <>
      <Stack direction="column" spacing={0.5} alignItems={'center'} width={'100%'}>
        <Box>
          <img src={openBook} alt="Support" width={40} />
        </Box>
        <Typography variant={'h5'} fontWeight={'600'}>Have a question</Typography>
        <Typography variant={'caption'} >We migh have the answer in our help section</Typography>
        <Button variant="contained" color="error" size="small" sx={{ px: 8 }}>Browse Guides</Button>
      </Stack>

      <Typography variant={'h6'} sx={{ mt: 3 }} fontWeight={600}>Troubleshooting</Typography>
      <List>
        {
          supportSettingsJson.map((item, index) => {
            return (
              <Box sx={{ paddingBottom: 1 }} key={index}>
                <ListItem key={index} disablePadding>
                  <ListItemButton sx={{ p: '3px', borderRadius: 1 }} onClick={() => { item.onClick() }}>
                    <SettingsItem title={item.title} desc={item.desc} variant={item.variant} />
                  </ListItemButton>
                </ListItem>
                <Divider variant="fullWidth" component="li" />
              </Box>
            )
          })
        }
      </List>

      <Typography variant={'h6'} sx={{ mt: 1 }} fontWeight={600}>General info</Typography>
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

    </>
  )
}

export default SupportPage