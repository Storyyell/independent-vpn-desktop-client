import React from 'react'
import { useRecoilValue } from 'recoil';
import { deviceTokenState } from '../../atoms/app/token';
import { countryListState } from '../../atoms/available/countryList';
import { cityListState } from '../../atoms/available/cityList';
import { serverListState } from '../../atoms/available/serverList';


const StateSave = () => {

  const deviceToken =  useRecoilValue(deviceTokenState);
  const countryList = useRecoilValue(countryListState);
  const cityList = useRecoilValue(cityListState);
  const serverList = useRecoilValue(serverListState);

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