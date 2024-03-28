import { Button, IconButton, Stack, Typography } from '@mui/material'
import React from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';


const Header = () => {

  const [menuClick, setMenuClick] = React.useState(false)

  const handleMenuClick = () => {
    setMenuClick(!menuClick)
  }

  const mentIconStyle = {
    width: '32px',
    height: '32px'
  }

  const DrawerList = (
    <Box sx={{ width: '90vw' }} role="presentation" onClick={() => { setMenuClick(false) }}>
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );




  return (
    <Stack direction={'row'} width={'100%'} style={{ justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>

      <IconButton onClick={handleMenuClick}>
        {menuClick ? < CloseIcon style={mentIconStyle} /> : <MenuIcon style={mentIconStyle} />}
      </IconButton>

      <Drawer open={menuClick} onClose={() => { setMenuClick(false) }}>
        {DrawerList}
      </Drawer>

      <Button
        variant="contained"
        size='small'
        sx={{
          height: '32px',
          borderRadius: '16px',
          background: '#CC2229',
          backdropFilter: 'blur(2px)'

        }}>
        <Typography variant="overline" sx={{ fontSize: '12px', color: 'white' }}>
          Upgrade to Premium
        </Typography>
      </Button>

    </Stack>
  )
}

export default Header