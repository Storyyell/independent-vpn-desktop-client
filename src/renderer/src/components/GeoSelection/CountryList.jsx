import React from 'react'
import { GeoItem } from '../GeoItem/GeoItem'
import { Box, Typography } from '@mui/material'
import { useRecoilState, useRecoilValue, useRecoilCallback, useSetRecoilState, useResetRecoilState } from 'recoil'
import { deviceTokenState } from '../../atoms/app/token'
import { countryListState } from '../../atoms/available/countryList'
import { countrySelectedState } from '../../atoms/userSelection/country'
import { citySelectedState } from '../../atoms/userSelection/city'

const dataValidityPeroid = 10 * 60 * 1000 // 10minutes


const CountryList = (props) => {

  let setLoadCityList = props.setLoadCityList

  const deviceToken = useRecoilValue(deviceTokenState);
  const [countryList, setCountryList] = useRecoilState(countryListState);
  const setCountrySelected = useSetRecoilState(countrySelectedState);
  const resetCitySelected = useResetRecoilState(citySelectedState);

  let countryListProcessed = countryList.data || [];

  React.useEffect(() => {
    const now = new Date();

    if (deviceToken && (now - countryList.timeStamp > dataValidityPeroid)) {

      console.log("county list fetch trigerred")

      window.api.getCountries(deviceToken)
        .then((res) => {
          if (res.data) {
            setCountryList({
              timeStamp: new Date(),
              data: res.data
            })
          }
        })
        .catch((e) => {
          console.log(e)
        })

    }
  }, [])


  const handleCountryChange = (countryId) => {
    setCountrySelected(countryId);
    resetCitySelected();
    setLoadCityList(true);
  }


  return (
    <>
      {
        countryListProcessed.length > 0
          ?
          countryListProcessed?.map((d, i) => {
            return (
              <GeoItem key={d?.id} data={d} geoType='country' onClick={(val) => {
                handleCountryChange(val)
              }}
              />
            )
          })

          :
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '470px',
            flexGrow: 1
          }}>
            <Typography sx={{
              m: 1,
              color: 'grey',
              fontSize: '16px'
            }}>
              Loading country list ...
            </Typography>
            <Typography sx={{
              m: 0,
              fontSize: '12px',
            }}>
              please wait...
            </Typography>
            <Box sx={{ height: "200px" }}></Box>
          </Box>

      }
    </>
  )
}

export default CountryList