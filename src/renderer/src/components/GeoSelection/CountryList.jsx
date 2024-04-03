import React from 'react'
import { GeoItem } from '../GeoItem/GeoItem'
import { Typography } from '@mui/material'



const CountryList = (props) => {
  let serverList = props.serverList
  let countryListProcessed = props.countryListProcessed
  let favList = props.favList
  let setFavList = props.setFavList
  let setLoadCityList = props.setLoadCityList
  let setSelectedItems = props.setSelectedItems
  let setProcessListUpdate = props.setProcessListUpdate

  const handleCountryChange = (countryId_) => {
    setProcessListUpdate(d => !d)
    setLoadCityList(true)
    setSelectedItems((d) => {
      return { ...d, countryId: countryId_, cityId: '' }
    })
  }


  return (
    <>
      {
        serverList?.countries

          ?

          countryListProcessed?.map((d, i) => {
            return (
              <GeoItem key={d?.id} data={d} geoType='country' onClick={(val) => {
                handleCountryChange(val)
              }}
                onFavClick={() => {
                  favList?.countries?.includes(d?.id)
                    ?
                    setFavList((c) => {
                      return { ...c, countries: c.countries.filter((f) => f != d?.id) }
                    })
                    :
                    setFavList((c) => {
                      return { ...c, countries: [...c.countries, d?.id] }
                    })
                }}
              />
            )
          })

          :

          <Typography variant='subtitle2' sx={{ m: 2 }}>
            Loading country list ...
          </Typography>
      }
    </>
  )
}

export default CountryList