import { Button, IconButton, Stack, Typography } from '@mui/material'
import React from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';

import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import HomeSettings from '../../pages/HomeSettings/HomeSettings';
import Settings from '../../pages/Settings/Settings';
import GearBtn from './GearBtn';


const Header = () => {

  const [menuClick, setMenuClick] = React.useState(false)

  const handleMenuClick = () => {
    setMenuClick(!menuClick)
  }

  return (
    <Stack direction={'row'} style={{ justifyContent: 'space-between', alignItems: 'center', width: "100%" }}>
      <GearBtn menuClick={menuClick} handleMenuClick={handleMenuClick} />

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

    </Stack>
  )
}

export default Header