import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { Stack } from '@mui/material';
import { ServerListContext } from '../../context/ServerListContext';
import { SelectionContext } from '../../context/SelectionContext';
import { DeviceTokenContext } from '../../context/DeviceTokenContext';
import { FavListContext } from '../../context/FavContext';
import CountryList from './CountryList';
import CityList from './CityList';
import GeoSelHeader from './GeoSelHeader';
import SearchBar from './SearchBar';


const GeoSelection = (props) => {

  const { serverList, setServerList } = React.useContext(ServerListContext);
  const { deviceToken } = React.useContext(DeviceTokenContext);
  const [loadCityList, setLoadCityList] = React.useState(false)
  const { selectedItems, setSelectedItems } = React.useContext(SelectionContext);
  const { favList, setFavList } = React.useContext(FavListContext);
  const [favIconClick, setFavIconClick] = React.useState(false);
  const [countryListProcessed, setCountryListProcessed] = React.useState(serverList?.countries || []);
  const [cityListProcessed, setCityListProcessed] = React.useState(serverList?.cities?.[selectedItems?.countryId] || []);
  const [searchField, setSearchField] = React.useState('');
  const [processListUpdate, setProcessListUpdate] = React.useState(false)

  const mentIconStyle = {
    width: '30px',
    height: '30px',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    borderRadius: '5px',
  }


  // for refreshing the country list
  React.useEffect(() => {
    if (deviceToken) {
      window.api.getCountries(deviceToken)
        .then((res) => {
          setServerList((d) => {
            return { ...d, countries: res.data }
          })
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }, [deviceToken])


  // for refreshing the city list
  React.useEffect(() => {
    if (selectedItems?.countryId && deviceToken) {
      window.api.getCities(deviceToken, selectedItems?.countryId)
        .then((res) => {
          setServerList((d) => {
            return {
              ...d, cities: {
                ...d.cities,
                [selectedItems?.countryId]: res.data
              }
            }
          })
        })
        .catch((e) => {
          console.log(e)
        })
    }

  }, [selectedItems?.countryId, deviceToken])


  // for refreshing the processed country list
  React.useEffect(() => {
    favIconClick ?
      setCountryListProcessed(serverList?.countries.filter((d) => {
        return favList?.countries?.includes(d?.id)
      }))
      :
      setCountryListProcessed(serverList?.countries)

  }, [serverList?.countries, favIconClick, favList?.countries])

  // for refreshing the processed city list
  React.useEffect(() => {

    favIconClick ?
      setCityListProcessed(serverList?.cities?.[selectedItems?.countryId].filter((d) => {
        return favList?.cities?.[selectedItems?.countryId]?.includes(d?.id)
      }))
      :
      setCityListProcessed(serverList?.cities[selectedItems?.countryId])

  }, [serverList?.cities, favIconClick, favList?.cities, processListUpdate])

  // for search functionality
  React.useEffect(() => {
    if (loadCityList) {
      setCityListProcessed((l) => {
        return (serverList?.cities?.[selectedItems?.countryId]?.filter((d) => { return (d?.name?.toLowerCase()?.includes(searchField.toLowerCase())) }))
      })
    } else {
      setCountryListProcessed(() => {
        return (serverList?.countries?.filter((d) => { return (d?.name?.toLowerCase().includes(searchField.toLowerCase())) }))
      })
    }
  }, [searchField])

  const DrawerList = (
    <>
      <Stack direction={'column'} spacing={1} sx={{ height: '80vh', margin: '10px 10px' }}>

        <GeoSelHeader
          favIconClick={favIconClick}
          setFavIconClick={setFavIconClick}
          mentIconStyle={mentIconStyle}
          loadCityList={loadCityList}
          setLoadCityList={setLoadCityList}
          setSelectedItems={setSelectedItems}
          onClose={props.onClose}
        />

        <SearchBar
          searchField={searchField}
          setSearchField={setSearchField}
          loadCityList={loadCityList}
          favIconClick={favIconClick}
          setFavList={setFavList}
          onClose={props.onClose}
          setLoadCityList={setLoadCityList}
        />

        <Stack direction={'column'} spacing={2} style={{ margin: '8px' }}>

          <Box sx={{ width: '100%' }} role="presentation" >

            <List >
              {
                loadCityList
                  ?

                  <CityList
                    serverList={serverList}
                    cityListProcessed={cityListProcessed}
                    selectedItems={selectedItems}
                    favList={favList}
                    setFavList={setFavList}
                    deviceToken={deviceToken}
                    setServerList={setServerList}
                    setSelectedItems={setSelectedItems}
                    onClose={props.onClose}

                  />
                  :

                  <CountryList
                    serverList={serverList}
                    countryListProcessed={countryListProcessed}
                    favList={favList}
                    setFavList={setFavList}
                    setLoadCityList={setLoadCityList}
                    setSelectedItems={setSelectedItems}
                    setProcessListUpdate={setProcessListUpdate}
                  />
              }
            </List>
            <Divider />
          </Box>

        </Stack>
      </Stack>

    </>
  );
  //
  return (
    <Drawer
      open={props.open}
      onClose={props.onClose}
      anchor='bottom'
      PaperProps={{
        style: {
          background: 'linear-gradient(180deg, #1E1A1B 0%, #171414 100%)',
        }
      }}
    >
      {DrawerList}
    </Drawer>

  )
}

export default GeoSelection