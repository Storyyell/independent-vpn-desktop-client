import React from 'react'
import { Stack } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress';

const BtnSpinner = (props) => {
  return (
    <Stack sx={{
      borderRadius: "50%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#1D2026",
      width: "54px",
      height: "54px",
    }}>
      <CircularProgress
        size={20}
        color={props.color}
      />
    </Stack>
  )
}

export default BtnSpinner