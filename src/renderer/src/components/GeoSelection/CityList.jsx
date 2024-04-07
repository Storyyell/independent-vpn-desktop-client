import * as React from 'react';
import { GeoItem } from '../GeoItem/GeoItem';
import { Typography } from '@mui/material';
import { refreshServerList } from '../../scripts/utils';
import { handleVpnConnTrigger } from '../../pages/Home/ConnectionTrigger';
import { VpnStatusMainContext } from '../../context/VpnStatusMainContext';


const CityList = (props) => {

  let serverList = props.serverList
  let cityListProcessed = props.cityListProcessed
  let selectedItems = props.selectedItems
  let favList = props.favList
  let setFavList = props.setFavList
  let setSelectedItems = props.setSelectedItems
  let deviceToken = props.deviceToken
  let setServerList = props.setServerList

  const { vpnStatusMain, setVpnStatusMain } = React.useContext(VpnStatusMainContext);


  const handleCityChange = (cityId_) => {

    setSelectedItems((d) => {
      return { ...d, cityId: cityId_ }
    })

    // refreshServerList(selectedItems?.countryId, cityId_, setServerList, serverList, deviceToken);

    handleVpnConnTrigger(deviceToken, { ...selectedItems, cityId: cityId_ }, serverList, vpnStatusMain, vpnStatusMain, setServerList, setVpnStatusMain)

  };

  return (
    <>
      {
        serverList?.cities[selectedItems?.countryId]?.data ?
          cityListProcessed?.map((d, i) => {
            return (
              <GeoItem key={i} geoType='city' data={{ ...d, code: (serverList?.countries?.data?.find(d => d.id == selectedItems?.countryId))?.code }} onClick={(val) => {
                handleCityChange(val)
                props.onClose()
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