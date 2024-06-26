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
import StatusBar from './StatusBar';
import backgroundImage from '../../assets/background.svg';



const Header = () => {

  const [menuClick, setMenuClick] = React.useState(false)

  const handleMenuClick = () => {
    setMenuClick(!menuClick)
  }

  return (
    <Stack direction={'row'} style={{ justifyContent: 'space-between', alignItems: 'center', width: "100%" }}>
      <GearBtn menuClick={menuClick} handleMenuClick={handleMenuClick} />

      {/* side drawer */}
      <Drawer
        open={menuClick}
        onClose={() => { setMenuClick(false); }}
        PaperProps={{
          style: {
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          },
        }}
      >
        <Box
          className={"app-padding"}
          sx={{ width: '100vw', height: '100vh', display: "flex", flexDirection: "column" }}
          role="presentation">
          <Settings onClick={() => { setMenuClick(false); }} />
        </Box>
      </Drawer>


      <StatusBar />
      <Box sx={{ width: "37px", height: "37px" }}></Box>
    </Stack>
  )
}

export default Header