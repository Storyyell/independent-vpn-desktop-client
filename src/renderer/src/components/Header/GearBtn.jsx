import { IconButton } from '@mui/material'
import React from 'react'
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';


const GearBtn = (props) => {
  return (
    <IconButton
      onClick={props.handleMenuClick}
      style={{
        width: "37px",
        height: "37px",
        borderRadius: "50%",
        backgroundColor: "#1F2B36"
      }}
    >
      {props.menuClick ? < KeyboardBackspaceIcon /> : <SettingsIcon
        fontSize='small'
      />}
    </IconButton>
  )
}

export default GearBtn