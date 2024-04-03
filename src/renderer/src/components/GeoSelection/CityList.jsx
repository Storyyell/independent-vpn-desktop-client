import * as React from 'react';
import { GeoItem } from '../GeoItem/GeoItem';
import { Typography } from '@mui/material';



const CityList = (props) => {

  let serverList = props.serverList
  let cityListProcessed = props.cityListProcessed
  let selectedItems = props.selectedItems
  let favList = props.favList
  let setFavList = props.setFavList
  let handleCityChange = props.handleCityChange



  return (
    <>
      {
        serverList?.cities[selectedItems?.countryId] ?
          cityListProcessed?.map((d, i) => {
            return (
              <GeoItem key={i} geoType='city' data={{ ...d, code: (serverList?.countries.find(d => d.id == selectedItems?.countryId))?.code }} onClick={(val) => {
                handleCityChange(val)
              }}
                onFavClick={() => {
                  favList?.cities?.[selectedItems?.countryId]?.includes(d?.id)
                    ?
                    setFavList((c) => {
                      const filteredCities = (c?.cities?.[selectedItems?.countryId]).filter((f) => f !== d.id);
                      if (filteredCities.length === 0) {
                        const newCities = { ...c.cities };
                        delete newCities[selectedItems?.countryId];
                        return { ...c, cities: newCities };
                      } else {
                        return { ...c, cities: { ...c.cities, [selectedItems?.countryId]: filteredCities } };
                      }
                    })
                    :
                    setFavList((c) => {
                      return { ...c, cities: { ...c.cities, [selectedItems?.countryId]: [...(c?.cities?.[selectedItems?.countryId] || []), d?.id] } };
                    })
                }}
              />
            )
          }) :

          <Typography variant='subtitle2' sx={{ m: 2 }}>
            Loading cities list ...
          </Typography>
      }
    </>
  )
}

export default CityList