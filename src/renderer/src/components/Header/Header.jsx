import { Button, IconButton, Stack, Typography } from '@mui/material'
import React from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import HomeSettings from '../../pages/HomeSettings/HomeSettings';
import Settings from '../../pages/Settings/Settings';


const Header = () => {

  const [menuClick, setMenuClick] = React.useState(false)

  const handleMenuClick = () => {
    setMenuClick(!menuClick)
  }

  const mentIconStyle = {
    width: '32px',
    height: '32px'
  }


  return (
    <Stack direction={'row'} width={'100%'} style={{ justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>

      <IconButton onClick={handleMenuClick}>
        {menuClick ? < CloseIcon style={mentIconStyle} /> : <MenuIcon style={mentIconStyle} />}
      </IconButton>

      {/* side drawer */}

      <Drawer open={menuClick} onClose={() => { setMenuClick(false) }} >
        <Box sx={{ width: '90vw', p: 4, height: '100vh' }} role="presentation"
          style={{
            background: 'linear-gradient(180deg, #1E1A1B 0%, #171414 100%)'
          }}>
          <Settings onClick={() => { setMenuClick(false) }} />
        </Box>
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