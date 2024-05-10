import { Box, Typography } from '@mui/material'
import React from 'react'
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


const GeoHolder = () => {
  return (
    <Box sx={{
      height: "54px",
      borderRadius: "27px",
      backgroundColor: "#1D2026",
      display: "flex",
      alignItems: "center",
      p: 2,
      justifyContent: "space-around",
      width: "236px"
    }}>

      <TravelExploreIcon sx={{ color: "#444B57" }} />

      <Typography sx={{
        fontSize: "16px",
        fontWeight: "500",
        color: "#444B57"
      }}>
        SelectNode
      </Typography>

      <ArrowForwardIosIcon sx={{ color: "#444B57" }} />

    </Box>
  )
}

export default GeoHolder