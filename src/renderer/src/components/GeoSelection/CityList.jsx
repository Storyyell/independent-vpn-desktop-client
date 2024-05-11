import * as React from 'react';
import { GeoItem } from '../GeoItem/GeoItem';
import { Typography } from '@mui/material';
import { refreshServerList } from '../../scripts/utils';
import { handleVpnConnTrigger } from '../../pages/Home/ConnectionTrigger';
import { VpnStatusMainContext } from '../../context/VpnStatusMainContext';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { countrySelectedState } from '../../atoms/userSelection/country';
import { deviceTokenState } from '../../atoms/app/token';
import { cityListState } from '../../atoms/available/cityList';
import { citySelectedState } from '../../atoms/userSelection/city';

const dataValidityPeroid = 10 * 60 * 1000 // 10minutes

const CityList = (props) => {

  let serverList = props.serverList
  let setSelectedItems = props.setSelectedItems
  let setServerList = props.setServerList

  const { vpnStatusMain, setVpnStatusMain } = React.useContext(VpnStatusMainContext);

  const countryId = useRecoilValue(countrySelectedState);
  const deviceToken = useRecoilValue(deviceTokenState);
  const [cityObj, setCityObj] = useRecoilState(cityListState);
  const setCitySelected = useSetRecoilState(citySelectedState);

  let cityListProcessed = (cityObj?.[countryId]?.data) || [];

  React.useEffect(() => {
    const now = new Date();
    if (deviceToken && ((now - (cityObj?.[countryId]?.timeStamp || 0)) > dataValidityPeroid)) {
      console.log("fetching city list for country id : ", countryId);
      window.api.getCities(deviceToken, countryId)
        .then((res) => {
          if (res.data) {
            setCityObj((cityObjOld) => {
              return ({
                ...cityObjOld,
                [countryId]: {
                  timeStamp: new Date(),
                  data: res.data
                }
              })
            })
          }
        })
        .catch((e) => {
          console.log(e);
        })
    }
  }, []);

  const handleCityChange = (cityId_) => {
    // trigerring vpn connection 
    // handleVpnConnTrigger(deviceToken, { countryId: countryId, cityId: cityId_ }, serverList, () => { }, vpnStatusMain, setServerList, setVpnStatusMain, setSelectedItems)
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

          <Typography sx={{ m: 2 }}>
            Loading cities list ...
          </Typography>
      }
    </>
  )
}

export default CityList