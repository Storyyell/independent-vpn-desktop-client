import * as React from 'react';
import { GeoItem } from '../GeoItem/GeoItem';
import { Box, Typography } from '@mui/material';
import { refreshCityList, refreshServerList } from '../../scripts/utils';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { countrySelectedState } from '../../atoms/userSelection/country';
import { deviceTokenState } from '../../atoms/app/token';
import { cityListState } from '../../atoms/available/cityList';
import { citySelectedState } from '../../atoms/userSelection/city';

const dataValidityPeroid = 10 * 60 * 1000 // 10minutes

const CityList = (props) => {

  const countryId = useRecoilValue(countrySelectedState);
  const deviceToken = useRecoilValue(deviceTokenState);
  const [cityObj, setCityObj] = useRecoilState(cityListState);
  const setCitySelected = useSetRecoilState(citySelectedState);

  let cityListProcessed = (cityObj?.[countryId]?.data) || [];

  React.useEffect(() => {
    cityListProcessed = refreshCityList(deviceToken, countryId, cityObj, setCityObj);
  }, []);

  const handleCityChange = (cityId_) => {
    // trigerring vpn connection 
    setCitySelected(cityId_);
  };

  return (
    <>
      {
        cityListProcessed.length > 0 ?
          cityListProcessed?.map((d, i) => {
            return (
              <GeoItem key={i} geoType='city' data={{ ...d, code: null }}
                onClick={(val) => {
                  handleCityChange(val);
                  props.onClose();
                }}
              />
            )
          }) :

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
              Loading city list ...
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

export default CityList