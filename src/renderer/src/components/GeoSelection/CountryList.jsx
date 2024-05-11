import React from 'react'
import { GeoItem } from '../GeoItem/GeoItem'
import { Typography } from '@mui/material'
import { useRecoilState, useRecoilValue } from 'recoil'
import { deviceTokenState } from '../../atoms/app/token'
import { countryListState } from '../../atoms/available/countryList'

const dataValidityPeroid = 10 * 60 * 1000 // 10minutes


const CountryList = (props) => {
  let setLoadCityList = props.setLoadCityList
  let setSelectedItems = props.setSelectedItems
  let setProcessListUpdate = props.setProcessListUpdate


  const deviceToken = useRecoilValue(deviceTokenState);
  const [countryList, setCountryList] = useRecoilState(countryListState);

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

  let countryListProcessed = countryList.data

  const handleCountryChange = (countryId_) => {
    setProcessListUpdate(d => !d)
    setLoadCityList(true)
    setSelectedItems((d) => {
      return { ...d, countryId: countryId_, cityId: null }
    })
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

          <Typography sx={{ m: 2 }}>
            Loading country list ...

          </Typography>
      }
    </>
  )
}

export default CountryList