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


  return (
    <Box width='100%'>
      <Stack direction={'row'} style={{ justifyContent: 'space-between', alignItems: 'center', margin: '10px 10px' }}>

        <IconButton onClick={handleMenuClick}>
          {menuClick ? < CloseIcon /> : <MenuIcon />}
        </IconButton>

        {/* side drawer */}

        <Drawer open={menuClick} onClose={() => { setMenuClick(false) }}
          PaperProps={{
            style: {
              background: 'linear-gradient(180deg, #1E1A1B 0%, #171414 100%)',
            }
          }}>
          <Box sx={{ width: '90vw', m: 1, height: '100vh' }} role="presentation">
            <Settings onClick={() => { setMenuClick(false) }} />
          </Box>
        </Drawer>

        <Button
          variant="outlined"
          size='small'
          color='error'
          sx={{
            color: 'white',
          }}
          style={{
            height: '24px',
            borderRadius: '12px',
          }}
        >
          <Typography sx={{ fontSize: '8px', color: 'white' }}>
            Upgrade to Premium
          </Typography>
        </Button>

      </Stack>
    </Box >

  )
}

export default Header