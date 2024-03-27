import { Button, IconButton, Stack, Typography } from '@mui/material'
import React from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

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

    </Stack >
  )
}

export default Header