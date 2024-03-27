import { Button, IconButton, Stack, Typography } from '@mui/material'
import React from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Header = () => {

  const [menuClick, setMenuClick] = React.useState(false)

  const handleMenuClick = () => {
    setMenuClick(!menuClick)
  }

  return (
    <Stack direction={'row'} width={'100%'} style={{ justifyContent: 'space-between', alignItems: 'center' }}>
      <IconButton sx={{ p: 1, m: 1 }} onClick={handleMenuClick}>
        {menuClick ? < CloseIcon /> : <MenuIcon />}
      </IconButton>

      <Button
        variant="contained"
        size='small'
        sx={{
          height: '30px',
          borderRadius: "15px",
          mx: 2,
          my: 1,
          p: 1,
        }}>
        <Typography variant="overline" sx={{ m: 1, fontSize: '9px' }}>
          Upgrade to Premium
        </Typography>

      </Button>
    </Stack>
  )
}

export default Header