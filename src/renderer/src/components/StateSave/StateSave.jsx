import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import { deviceTokenState } from '../../atoms/app/token';
import { countryListState } from '../../atoms/available/countryList';
import { cityListState } from '../../atoms/available/cityList';
import { serverListState } from '../../atoms/available/serverList';



const StateSave = () => {

  const deviceToken =  useRecoilValue(deviceTokenState);
  const [countryList, setCountryList] = useRecoilState(countryListState);
  const [cityList, setCityList] = useRecoilState(cityListState);
  const [serverList, setServerList] = useRecoilState(serverListState);

  React.useEffect(() => {

    // loading country list
    const cl = localStorage.getItem("country_list_");
    if(cl) setCountryList(cl);
    // loading city list
    const cty = localStorage.getItem("city_list_");
    if(cty) setCityList(cty);
    // loading server list
    const sl = localStorage.getItem("server_list_");
    if(sl) setServerList(sl);

  },[]);

  window.onbeforeunload = () => {
    localStorage.setItem("device_token_", deviceToken);
    localStorage.setItem("country_list_", countryList);
    localStorage.setItem("city_list_", cityList);
    localStorage.setItem("server_list_", serverList);
  };

  return (
    <></>
  )
}

export default StateSave