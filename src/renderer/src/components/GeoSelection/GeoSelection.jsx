import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { Stack } from '@mui/material';
import { ServerListContext } from '../../context/ServerListContext';
import { SelectionContext } from '../../context/SelectionContext';
import { FavListContext } from '../../context/FavContext';
import CountryList from './CountryList';
import CityList from './CityList';
import GeoSelHeader from './GeoSelHeader';
import { refreshCityList, refreshCountryList } from '../../scripts/utils';
import backgroundImage from '../../assets/background.svg';
import { useRecoilValue } from 'recoil';
import { deviceTokenState } from '../../atoms/app/token';

const GeoSelection = (props) => {

  const { serverList, setServerList } = React.useContext(ServerListContext);
  const deviceToken = useRecoilValue(deviceTokenState);
  const [loadCityList, setLoadCityList] = React.useState(false)
  const { setSelectedItems } = React.useContext(SelectionContext);

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
                    onClose={props.onClose}
                  />
                  :

                  <CountryList
                    setLoadCityList={setLoadCityList}
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