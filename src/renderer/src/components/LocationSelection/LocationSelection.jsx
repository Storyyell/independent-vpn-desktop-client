import React from 'react'
import Countries from './Countries';
import { Stack } from '@mui/material';
import City from './City';


const LocationSelection = () => {
  const [selectedCountryId, setSelectedCountryId] = React.useState('')
  const [selectedCityId, setSelectedCityId] = React.useState('')

  return (
    <>
    <Stack spacing={3} direction="row" sx={{paddingTop:"40px"}}>  
      <Countries selectedCountryId={selectedCountryId } setSelectedCountryId={setSelectedCountryId}/>
      <City selectedCityId={selectedCityId}  setSelectedCityId={setSelectedCityId}  selectedCountryId={selectedCountryId}/>
    </Stack>
    </>
  )
}

export default LocationSelection