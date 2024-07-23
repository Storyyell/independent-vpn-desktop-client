import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { Stack } from '@mui/material';
import CountryList from './CountryList';
import CityList from './CityList';
import GeoSelHeader from './GeoSelHeader';
import { refreshCityList, refreshCountryList } from '../../scripts/utils';
import backgroundImage from '../../assets/background.svg';
import { useRecoilValue } from 'recoil';
import { deviceTokenState } from '../../atoms/app/token';

const GeoSelection = (props) => {

  const deviceToken = useRecoilValue(deviceTokenState);
  const [loadCityList, setLoadCityList] = React.useState(false)

  const mentIconStyle = {
    width: '30px',
    height: '30px',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    borderRadius: '5px',
  }

  const DrawerList = (
    <>
      <Stack direction={'column'} spacing={1} className='app-padding' sx={{ height: '100vh' }} style={{ overflowY: 'scroll' }}>

        <Box style={{ marginBottom: "8px" }}>
          <GeoSelHeader
            mentIconStyle={mentIconStyle}
            loadCityList={loadCityList}
            setLoadCityList={setLoadCityList}
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