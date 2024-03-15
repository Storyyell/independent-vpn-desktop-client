import React from 'react'
import Countries from './Countries';
import { Stack } from '@mui/material';
import City from './City';


const LocationSelection = () => {
  
  return (
    <>
    <Stack spacing={3} direction="row" sx={{paddingTop:"40px"}}>  
      <Countries />
      <City />
    </Stack>
    </>
  )
}

export default LocationSelection