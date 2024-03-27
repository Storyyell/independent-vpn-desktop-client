import { IconButton, Stack } from '@mui/material'
import React from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Header = () => {

  const [menuClick, setMenuClick] = React.useState(false)

  const handleMenuClick = () => {
    setMenuClick(!menuClick)
  }

  return (
    <Stack direction={'row'} width={'100%'} style={{ justifyContent: 'space-between' }}>
      <IconButton sx={{ p: 1, m: 1 }} onClick={handleMenuClick}>
        {menuClick ? < CloseIcon /> : <MenuIcon />}
      </IconButton>
      <IconButton>
        <MenuIcon />
      </IconButton>
    </Stack>
  )
}

export default Header