import { Box, Typography } from '@mui/material'
import React from 'react'
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useRecoilValue } from 'recoil';
import { countryNameSelected } from '../../selectors/countryNameSelection';


const GeoHolder = (props) => {

  const countryChoosed = useRecoilValue(countryNameSelected);

  return (
    <div onClick={() => { props.onClick() }}>
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

        {countryChoosed.code ?
          <img
            src={`https://flagcdn.com/36x27/${(countryChoosed.code).toLowerCase()}.png`}
            alt="Country Flag"
            style={{
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              objectFit: 'cover',
            }}
            loading="lazy"
          />
          :
          <TravelExploreIcon sx={{ color: "#444B57" }} />
        }




        <Typography sx={{
          fontSize: "16px",
          fontWeight: "500",
          color: "#444B57"
        }}>
          {countryChoosed.name ? countryChoosed.name : "SelectNode"}
        </Typography>

        <ArrowForwardIosIcon sx={{ color: "#444B57" }} />

      </Box>
    </div>
  )
}

export default GeoHolder