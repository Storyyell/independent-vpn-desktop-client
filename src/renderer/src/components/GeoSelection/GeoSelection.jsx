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
import { refreshCityList, refreshCountryList } from '../../scripts/utils';
import backgroundImage from '../../assets/background.svg'; // Import the background image



const GeoSelection = (props) => {

  const { serverList, setServerList } = React.useContext(ServerListContext);
  const { deviceToken } = React.useContext(DeviceTokenContext);
  const [loadCityList, setLoadCityList] = React.useState(false)
  const { selectedItems, setSelectedItems } = React.useContext(SelectionContext);
  const { favList, setFavList } = React.useContext(FavListContext);
  const [favIconClick, setFavIconClick] = React.useState(false);
  const [countryListProcessed, setCountryListProcessed] = React.useState(serverList?.countries?.data || []);
  const [cityListProcessed, setCityListProcessed] = React.useState(serverList?.cities?.[selectedItems?.countryId]?.data || []);
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
    if (props.open) {
      refreshCountryList(deviceToken, serverList, setServerList);
    }
  }, [deviceToken, props.open])


  // for refreshing the city list
  React.useEffect(() => {
    refreshCityList(selectedItems?.countryId, deviceToken, serverList, setServerList);
  }, [selectedItems?.countryId, deviceToken])


  // for refreshing the processed country list
  React.useEffect(() => {
    favIconClick ?
      setCountryListProcessed(serverList?.countries?.data?.filter((d) => {
        return favList?.countries?.includes(d?.id)
      }))
      :
      setCountryListProcessed(serverList?.countries?.data?.sort((a, b) => a?.name.localeCompare(b?.name)) || [])

  }, [serverList?.countries, favIconClick, favList?.countries])

  // for refreshing the processed city list
  React.useEffect(() => {

    favIconClick ?
      setCityListProcessed(serverList?.cities?.[selectedItems?.countryId]?.data?.filter((d) => {
        return favList?.cities?.[selectedItems?.countryId]?.includes(d?.id)
      }))
      :
      setCityListProcessed(serverList?.cities[selectedItems?.countryId]?.data || [])

  }, [serverList?.cities, favIconClick, favList?.cities, processListUpdate])

  // for search functionality
  React.useEffect(() => {
    if (loadCityList) {
      setCityListProcessed((l) => {
        return (serverList?.cities?.[selectedItems?.countryId]?.data?.filter((d) => { return (d?.name?.toLowerCase()?.includes(searchField.toLowerCase())) }))
      })
    } else {
      setCountryListProcessed(() => {
        return (serverList?.countries?.data?.filter((d) => { return (d?.name?.toLowerCase().includes(searchField.toLowerCase())) }))
      })
    }
  }, [searchField])

  const DrawerList = (
    <>
      <Stack direction={'column'} spacing={1} className='app-padding' sx={{ height: '100vh' }} style={{ overflowY: 'scroll' }}>

        <Box style={{ marginBottom: "8px" }}>
          <GeoSelHeader
            favIconClick={favIconClick}
            setFavIconClick={setFavIconClick}
            mentIconStyle={mentIconStyle}
            loadCityList={loadCityList}
            setLoadCityList={setLoadCityList}
            setSelectedItems={setSelectedItems}
            onClose={props.onClose}
          />
        </Box>

        {/* <SearchBar
          searchField={searchField}
          setSearchField={setSearchField}
          loadCityList={loadCityList}
          favIconClick={favIconClick}
          setFavList={setFavList}
          onClose={props.onClose}
          setLoadCityList={setLoadCityList}
          serverList={serverList}
          deviceToken={deviceToken}
          setServerList={setServerList}

        /> */}

        <Stack direction={'column'} spacing={2}>

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
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        },
      }}
    >
      {DrawerList}
    </Drawer>

  )
}

export default GeoSelection