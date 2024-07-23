import { Box, IconButton, Stack, Typography } from '@mui/material'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import favIcon from '../../assets/favIcon.svg';
import GearBtn from '../Header/GearBtn';
import StatusBar from '../Header/StatusBar';
import PublicIcon from '@mui/icons-material/Public';
import FlagCircleIcon from '@mui/icons-material/FlagCircle';
import { useResetRecoilState } from 'recoil';
import { countryListState } from '../../atoms/available/countryList';
import { countrySelectedState } from '../../atoms/userSelection/country';
import { citySelectedState } from '../../atoms/userSelection/city';


const GeoSelHeader = (props) => {
  let loadCityList = props.loadCityList
  let setLoadCityList = props.setLoadCityList
  let setSelectedItems = props.setSelectedItems

  const resetCountrySelection = useResetRecoilState(countrySelectedState);
  const resetCitySelection = useResetRecoilState(citySelectedState);

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
      {/* <Box sx={{ width: "37px", height: "37px" }}></Box> */}
      
      {loadCityList ? 
      <IconButton
        onClick={()=>{
          resetCitySelection();
          props.onClose();
        }}>
      <FlagCircleIcon/></IconButton>
      :
      <IconButton 
      onClick={()=>{
        resetCountrySelection();
        resetCitySelection();
        props.onClose();
      }}><PublicIcon/></IconButton>
        }

    </Stack>
  )
}

export default GeoSelHeader