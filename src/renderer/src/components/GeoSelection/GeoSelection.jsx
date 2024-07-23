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
import { refreshCityList, refreshCountryList } from '../../scripts/utils';
import backgroundImage from '../../assets/background.svg';

const GeoSelection = (props) => {

  const { serverList, setServerList } = React.useContext(ServerListContext);
  const { deviceToken } = React.useContext(DeviceTokenContext);
  const [loadCityList, setLoadCityList] = React.useState(false)
  const { selectedItems, setSelectedItems } = React.useContext(SelectionContext);
  const { favList, setFavList } = React.useContext(FavListContext);
  const [favIconClick, setFavIconClick] = React.useState(false);
  const [countryListProcessed, setCountryListProcessed] = React.useState(serverList?.countries?.data || []);
  const [cityListProcessed, setCityListProcessed] = React.useState(serverList?.cities?.[selectedItems?.countryId]?.data || []);
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