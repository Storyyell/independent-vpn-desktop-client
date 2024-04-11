import { Box, Button, Chip, Divider, Grid, List, ListItem, ListItemButton, MenuItem, Select, Stack, Typography } from '@mui/material'
import React from 'react'
import openBook from '../../assets/open_book.svg'
import SettingsItem from '../../components/SettingsItem/SettingsItem'
import Modal from '@mui/material/Modal';
import SocialLink from './SocialLink';

const SupportPage = (props) => {

  const [modalOpen, setModalOpen] = React.useState(false);

  const handleModalClose = () => setModalOpen(false);

  const supportSettingsJson = [
    {
      title: 'Create ticket',
      desc: 'Create and send a ticket to our support team',
      variant: 1,
      onClick: () => { props.setSettingsPage('create ticket') }
    },
    {
      title: 'Community',
      desc: 'Ask Community for Help',
      variant: 1,
      onClick: () => {
        // window.api.sysOpen('https://google.com')
        setModalOpen(true)
      }
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
      onClick: () => {
        window.api.sysOpen('https://sentinel.co/privacy-policy')
      }
    },
    {
      title: 'Terms of service',
      desc: 'Ask Community for Help',
      variant: 1,
      onClick: () => {
        window.api.sysOpen('https://sentinel.co/terms-of-service')
      }
    }]



  return (
    <>
      <Stack direction="column" spacing={1} alignItems={'center'} width={'100%'} >

        <Box>
          <img src={openBook} alt="Support" width={25} />
        </Box>
        <Typography fontSize={'12px'} fontWeight={'600'} >Have a question</Typography>
        <Typography fontSize={'10px'} fontWeight={'400'} >We migh have the answer in our help section</Typography>
        <Button variant="contained" color="error" size="small" sx={{ px: 5 }}> <Typography style={{ fontSize: '10px', fontWeight: '600' }}>Browse Guides</Typography> </Button>

      </Stack>

      <Typography fontSize={'14px'} fontWeight={600} sx={{ mt: 1 }}>Troubleshooting</Typography>

      <List>
        {
          supportSettingsJson.map((item, index) => {
            return (
              <Box sx={{ paddingBottom: 1 }} key={index}>
                <ListItem disablePadding>
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


      <Typography fontSize={'14px'} fontWeight={600} sx={{ mt: 1 }} >General info</Typography>
      <List>
        {
          generalInfoSettingsJson.map((item, index) => {
            return (
              <Box key={index}>
                <ListItem disablePadding>
                  <ListItemButton sx={{ p: '3px', borderRadius: 1 }}
                    onClick={item.onClick}>
                    <SettingsItem title={item.title} desc={item.desc} variant={item.variant} />
                  </ListItemButton>
                </ListItem>
                <Divider variant="fullWidth" component="li" />
              </Box>
            )
          })
        }
      </List>

      <Modal
        open={modalOpen}
        onClose={handleModalClose}
      >
        <div>
          <SocialLink />
        </div>
      </Modal>

    </>
  )
}

export default SupportPage