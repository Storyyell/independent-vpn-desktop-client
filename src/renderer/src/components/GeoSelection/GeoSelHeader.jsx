import { Box, IconButton, Stack, Typography } from '@mui/material'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import favIcon from '../../assets/favIcon.svg';
import GearBtn from '../Header/GearBtn';
import StatusBar from '../Header/StatusBar';


const GeoSelHeader = (props) => {
  let favIconClick = props.favIconClick
  let setFavIconClick = props.setFavIconClick
  let mentIconStyle = props.mentIconStyle
  let loadCityList = props.loadCityList
  let setLoadCityList = props.setLoadCityList
  let setSelectedItems = props.setSelectedItems

  return (
    <Stack direction={'row'} style={{ justifyContent: 'space-between', alignItems: 'center', width: "100%" }}>
      <GearBtn menuClick={true}
        handleMenuClick={() => {
          if (loadCityList) {
            setSelectedItems((d) => {
              return { ...d, cityId: '' }
            })
            setLoadCityList(false)
          } else {
            props.onClose()
          }
        }} />

      <StatusBar text={loadCityList ? "Select Your City" : "Select Country"} />
      <Box sx={{ width: "37px", height: "37px" }}></Box>
    </Stack>
  )
}

export default GeoSelHeader